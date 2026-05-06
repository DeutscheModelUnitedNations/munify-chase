/**
 * Server-side Y.Doc cache for resolution papers.
 *
 * Each connected paper is held in memory as a single canonical `Y.Doc`.
 * All edits — from connected clients via WebSocket and from server-side
 * mutations like amendment-apply — go through this cache so the in-memory
 * doc is the source of truth. The doc binary is persisted to
 * `paper_yjs_doc.state` on a debounce, and the JSON projection is
 * mirrored to `resolution_paper.content` so amendment-apply, print,
 * snapshots, etc. can keep reading JSON.
 */

import * as Y from 'yjs';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db/db';
import { jsonToYDoc, yDocToJson } from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import {
	createEmptyResolution,
	migrateResolution,
	type Resolution
} from '@deutschemodelunitednations/munify-resolution-editor/schema';

const PERSIST_DEBOUNCE_MS = 1500;
const IDLE_EVICT_MS = 30_000;

interface CacheEntry {
	doc: Y.Doc;
	refCount: number;
	dirty: boolean;
	persistTimer: ReturnType<typeof setTimeout> | null;
	idleTimer: ReturnType<typeof setTimeout> | null;
}

const cache = new Map<string, CacheEntry>();
const loadingPromises = new Map<string, Promise<CacheEntry>>();

async function loadEntry(paperId: string): Promise<CacheEntry> {
	const doc = new Y.Doc();
	const existing = await db.query.paperYjsDoc.findFirst({
		where: { paperId }
	});
	if (existing?.state) {
		Y.applyUpdate(doc, existing.state);
	} else {
		// First-time access: seed from `resolution_paper.content`, migrating
		// legacy format if needed. Falls back to an empty resolution if the
		// content is missing or unparseable.
		const paper = await db.query.resolutionPaper.findFirst({
			where: { id: paperId }
		});
		let seed: Resolution;
		try {
			seed = paper?.content
				? migrateResolution(paper.content)
				: createEmptyResolution(paper?.title ?? '');
		} catch (err) {
			console.warn('[yjs] could not migrate paper content, seeding empty', paperId, err);
			seed = createEmptyResolution(paper?.title ?? '');
		}
		jsonToYDoc(doc, seed);
		// Persist immediately so future loads use the binary doc.
		const state = Y.encodeStateAsUpdate(doc);
		await db
			.insert(schema.paperYjsDoc)
			.values({ paperId, state })
			.onConflictDoUpdate({
				target: schema.paperYjsDoc.paperId,
				set: { state, updatedAt: new Date() }
			});
	}

	const entry: CacheEntry = {
		doc,
		refCount: 0,
		dirty: false,
		persistTimer: null,
		idleTimer: null
	};

	const onUpdate = (_update: Uint8Array, _origin: unknown) => {
		entry.dirty = true;
		schedulePersist(paperId, entry);
	};
	doc.on('update', onUpdate);
	(entry as CacheEntry & { _onUpdate: typeof onUpdate })._onUpdate = onUpdate;

	return entry;
}

async function getOrLoad(paperId: string): Promise<CacheEntry> {
	const existing = cache.get(paperId);
	if (existing) return existing;
	let pending = loadingPromises.get(paperId);
	if (pending) return pending;
	pending = loadEntry(paperId).then((entry) => {
		cache.set(paperId, entry);
		loadingPromises.delete(paperId);
		return entry;
	});
	loadingPromises.set(paperId, pending);
	return pending;
}

function schedulePersist(paperId: string, entry: CacheEntry) {
	if (entry.persistTimer) return;
	entry.persistTimer = setTimeout(() => {
		entry.persistTimer = null;
		void persist(paperId, entry);
	}, PERSIST_DEBOUNCE_MS);
}

async function persist(paperId: string, entry: CacheEntry): Promise<void> {
	if (!entry.dirty) return;
	entry.dirty = false;
	const state = Y.encodeStateAsUpdate(entry.doc);
	const json = yDocToJson(entry.doc);
	try {
		await db.transaction(async (tx) => {
			await tx
				.insert(schema.paperYjsDoc)
				.values({ paperId, state })
				.onConflictDoUpdate({
					target: schema.paperYjsDoc.paperId,
					set: { state, updatedAt: new Date() }
				});
			await tx
				.update(schema.resolutionPaper)
				.set({ content: json })
				.where(eq(schema.resolutionPaper.id, paperId));
		});
	} catch (err) {
		// Mark dirty again so the next tick retries.
		entry.dirty = true;
		console.error('[yjs] failed to persist paper', paperId, err);
	}
}

function scheduleIdleEvict(paperId: string, entry: CacheEntry) {
	if (entry.idleTimer) clearTimeout(entry.idleTimer);
	entry.idleTimer = setTimeout(async () => {
		if (entry.refCount > 0) return;
		await persist(paperId, entry);
		const onUpdate = (entry as CacheEntry & { _onUpdate?: (u: Uint8Array, o: unknown) => void })
			._onUpdate;
		if (onUpdate) entry.doc.off('update', onUpdate);
		entry.doc.destroy();
		cache.delete(paperId);
	}, IDLE_EVICT_MS);
}

/**
 * Acquire a Y.Doc for the given paper. Increments the cache entry's
 * ref count; the caller must release it when done.
 */
export async function acquirePaperDoc(paperId: string): Promise<{
	doc: Y.Doc;
	release: () => void;
}> {
	const entry = await getOrLoad(paperId);
	entry.refCount++;
	if (entry.idleTimer) {
		clearTimeout(entry.idleTimer);
		entry.idleTimer = null;
	}
	let released = false;
	return {
		doc: entry.doc,
		release: () => {
			if (released) return;
			released = true;
			entry.refCount--;
			if (entry.refCount <= 0) scheduleIdleEvict(paperId, entry);
		}
	};
}

/**
 * Run a server-side mutation against the paper's Y.Doc. The function
 * receives the live doc and may apply Y operations directly. The mutation
 * is wrapped in a `Y.transact` so observers — including connected
 * websocket peers — see one coherent update.
 */
export async function applyServerMutation<T>(paperId: string, fn: (doc: Y.Doc) => T): Promise<T> {
	const { doc, release } = await acquirePaperDoc(paperId);
	try {
		let result!: T;
		doc.transact(() => {
			result = fn(doc);
		}, 'server');
		// Force-flush persist so callers can read fresh JSON immediately.
		const entry = cache.get(paperId);
		if (entry?.dirty) {
			if (entry.persistTimer) {
				clearTimeout(entry.persistTimer);
				entry.persistTimer = null;
			}
			await persist(paperId, entry);
		}
		return result;
	} finally {
		release();
	}
}

/**
 * Get the latest persisted JSON projection of a paper. Used by callers
 * that need to read content immediately after `applyServerMutation`.
 */
export async function readPaperJson(paperId: string): Promise<Resolution | null> {
	const cached = cache.get(paperId);
	if (cached) return yDocToJson(cached.doc);
	const paper = await db.query.resolutionPaper.findFirst({ where: { id: paperId } });
	if (!paper?.content) return null;
	try {
		return migrateResolution(paper.content);
	} catch {
		return null;
	}
}

/**
 * Force-persist all dirty docs and shut down the cache.
 * Intended for graceful server shutdown.
 */
export async function flushAll(): Promise<void> {
	for (const [paperId, entry] of cache) {
		if (entry.persistTimer) clearTimeout(entry.persistTimer);
		entry.persistTimer = null;
		if (entry.dirty) await persist(paperId, entry);
	}
}
