/**
 * Server-side Y.Doc cache for resolution papers.
 *
 * Each connected paper is held in memory as a single canonical `Y.Doc`.
 * All edits — from connected clients via WebSocket and from server-side
 * mutations like amendment-apply — go through this cache so the in-memory
 * doc is the source of truth. The doc binary is persisted to
 * `paper_yjs_doc.state` on a debounce.
 *
 * Horizontal scaling: when `REDIS_URL` is set, every doc update is also
 * published to Redis so other Node instances can apply it to their own
 * cached docs. Each instance tags its messages with a unique `instanceId`
 * and ignores its own echoes.
 *
 * Corrupt-state policy: if `paper_yjs_doc.state` fails to decode we throw
 * (no silent rehydration). Callers — including `openYjsRoom` — surface this
 * to the client. Manual recovery via the most recent snapshot is the
 * intended fallback.
 */

import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness';
import { db, schema } from '../db/db';
import { configPrivate } from '$config/private';
import { Redis } from 'ioredis';
import { nanoid } from '$lib/helpers/nanoid';

const PERSIST_DEBOUNCE_MS = 1500;
const IDLE_EVICT_MS = 30_000;

const INSTANCE_ID = nanoid();

const DOC_CHANNEL_PREFIX = 'yjs:doc:';
const AWARENESS_CHANNEL_PREFIX = 'yjs:awareness:';

interface CacheEntry {
	doc: Y.Doc;
	awareness: awarenessProtocol.Awareness;
	refCount: number;
	dirty: boolean;
	persistTimer: ReturnType<typeof setTimeout> | null;
	idleTimer: ReturnType<typeof setTimeout> | null;
}

const cache = new Map<string, CacheEntry>();
const loadingPromises = new Map<string, Promise<CacheEntry>>();

// ---------------------------------------------------------------------------
// Redis pub/sub (multi-instance fanout)
// ---------------------------------------------------------------------------

let pubClient: Redis | undefined;
let subClient: Redis | undefined;

if (configPrivate.REDIS_URL) {
	pubClient = new Redis(configPrivate.REDIS_URL);
	subClient = new Redis(configPrivate.REDIS_URL);

	subClient.psubscribe(`${DOC_CHANNEL_PREFIX}*`, `${AWARENESS_CHANNEL_PREFIX}*`).catch((err) => {
		console.error('[yjs] redis psubscribe failed', err);
	});

	subClient.on('pmessageBuffer', (_pattern: Buffer, channel: Buffer, message: Buffer) => {
		const channelStr = channel.toString('utf8');
		if (message.byteLength < 22) return; // 22-char nanoid prefix
		const senderId = message.subarray(0, 22).toString('utf8');
		if (senderId === INSTANCE_ID) return; // own echo

		const payload = message.subarray(22);

		if (channelStr.startsWith(DOC_CHANNEL_PREFIX)) {
			const paperId = channelStr.slice(DOC_CHANNEL_PREFIX.length);
			const entry = cache.get(paperId);
			if (!entry) return; // doc not loaded on this instance, nothing to apply
			Y.applyUpdate(entry.doc, new Uint8Array(payload), 'remote');
		} else if (channelStr.startsWith(AWARENESS_CHANNEL_PREFIX)) {
			const paperId = channelStr.slice(AWARENESS_CHANNEL_PREFIX.length);
			const entry = cache.get(paperId);
			if (!entry) return;
			awarenessProtocol.applyAwarenessUpdate(entry.awareness, new Uint8Array(payload), 'remote');
		}
	});
}

function publishDocUpdate(paperId: string, update: Uint8Array) {
	if (!pubClient) return;
	const idBytes = Buffer.from(INSTANCE_ID, 'utf8');
	const payload = Buffer.concat([idBytes, Buffer.from(update)]);
	pubClient
		.publish(`${DOC_CHANNEL_PREFIX}${paperId}`, payload as unknown as string)
		.catch((err) => {
			console.error('[yjs] redis publish doc update failed', { paperId, err });
		});
}

function publishAwarenessUpdate(paperId: string, update: Uint8Array) {
	if (!pubClient) return;
	const idBytes = Buffer.from(INSTANCE_ID, 'utf8');
	const payload = Buffer.concat([idBytes, Buffer.from(update)]);
	pubClient
		.publish(`${AWARENESS_CHANNEL_PREFIX}${paperId}`, payload as unknown as string)
		.catch((err) => {
			console.error('[yjs] redis publish awareness failed', { paperId, err });
		});
}

// ---------------------------------------------------------------------------
// Cache lifecycle
// ---------------------------------------------------------------------------

export class CorruptYjsStateError extends Error {
	constructor(
		public paperId: string,
		cause: unknown
	) {
		super(`paper_yjs_doc.state for paper ${paperId} failed to decode`);
		this.cause = cause;
	}
}

async function loadEntry(paperId: string): Promise<CacheEntry> {
	const doc = new Y.Doc();
	const existing = await db.query.paperYjsDoc.findFirst({ where: { paperId } });

	if (existing?.state && existing.state.byteLength > 0) {
		try {
			Y.applyUpdate(doc, existing.state);
		} catch (err) {
			console.error('[yjs] corrupt paper_yjs_doc.state — hard failing', {
				paperId,
				byteLength: existing.state.byteLength,
				err
			});
			throw new CorruptYjsStateError(paperId, err);
		}
	}
	// If there's no row yet, the doc starts empty. The first persist will
	// insert. This is the expected path for a freshly-created paper.

	const awareness = new awarenessProtocol.Awareness(doc);

	const entry: CacheEntry = {
		doc,
		awareness,
		refCount: 0,
		dirty: false,
		persistTimer: null,
		idleTimer: null
	};

	const onUpdate = (update: Uint8Array, origin: unknown) => {
		entry.dirty = true;
		schedulePersist(paperId, entry);
		// Only republish updates that originated locally (a ws client or a
		// server mutation). Updates with origin === 'remote' came from Redis.
		if (origin !== 'remote') {
			publishDocUpdate(paperId, update);
		}
	};
	doc.on('update', onUpdate);
	(entry as CacheEntry & { _onUpdate: typeof onUpdate })._onUpdate = onUpdate;

	const onAwarenessUpdate = (
		_changed: { added: number[]; updated: number[]; removed: number[] },
		origin: unknown
	) => {
		if (origin === 'remote') return;
		const allClients = Array.from(awareness.getStates().keys());
		const update = awarenessProtocol.encodeAwarenessUpdate(awareness, allClients);
		publishAwarenessUpdate(paperId, update);
	};
	awareness.on('update', onAwarenessUpdate);
	(entry as CacheEntry & { _onAwarenessUpdate: typeof onAwarenessUpdate })._onAwarenessUpdate =
		onAwarenessUpdate;

	return entry;
}

function getOrLoad(paperId: string): Promise<CacheEntry> {
	const existing = cache.get(paperId);
	if (existing) return Promise.resolve(existing);
	let pending = loadingPromises.get(paperId);
	if (pending) return pending;
	pending = loadEntry(paperId)
		.then((entry) => {
			cache.set(paperId, entry);
			return entry;
		})
		.finally(() => {
			loadingPromises.delete(paperId);
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
	const state = Buffer.from(Y.encodeStateAsUpdate(entry.doc));
	try {
		await db
			.insert(schema.paperYjsDoc)
			.values({ paperId, state })
			.onConflictDoUpdate({
				target: schema.paperYjsDoc.paperId,
				set: { state, updatedAt: new Date() }
			});
	} catch (err) {
		entry.dirty = true; // retry on next tick
		console.error('[yjs] failed to persist paper', paperId, err);
	}
}

function scheduleIdleEvict(paperId: string, entry: CacheEntry) {
	if (entry.idleTimer) clearTimeout(entry.idleTimer);
	entry.idleTimer = setTimeout(async () => {
		if (entry.refCount > 0) return;
		await persist(paperId, entry);
		if (entry.dirty) {
			// persist failed; keep doc in memory and reschedule
			entry.idleTimer = null;
			scheduleIdleEvict(paperId, entry);
			return;
		}
		const onUpdate = (entry as CacheEntry & { _onUpdate?: (u: Uint8Array, o: unknown) => void })
			._onUpdate;
		if (onUpdate) entry.doc.off('update', onUpdate);
		const onAwarenessUpdate = (
			entry as CacheEntry & {
				_onAwarenessUpdate?: (
					changed: { added: number[]; updated: number[]; removed: number[] },
					origin: unknown
				) => void;
			}
		)._onAwarenessUpdate;
		if (onAwarenessUpdate) entry.awareness.off('update', onAwarenessUpdate);
		entry.awareness.destroy();
		entry.doc.destroy();
		cache.delete(paperId);
	}, IDLE_EVICT_MS);
}

/**
 * Acquire a Y.Doc + awareness for the given paper. Increments the cache
 * entry's ref count; the caller must release it when done.
 *
 * Throws `CorruptYjsStateError` if the persisted state is unreadable.
 */
export async function acquirePaperDoc(paperId: string): Promise<{
	doc: Y.Doc;
	awareness: awarenessProtocol.Awareness;
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
		awareness: entry.awareness,
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
 * websocket peers and other Node instances — see one coherent update.
 */
export async function applyServerMutation<T>(paperId: string, fn: (doc: Y.Doc) => T): Promise<T> {
	const handle = await acquirePaperDoc(paperId);
	try {
		let result!: T;
		handle.doc.transact(() => {
			result = fn(handle.doc);
		}, 'server');
		// Force-flush persist so callers can read fresh state immediately.
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
		handle.release();
	}
}

/**
 * Read the current JSON projection of a paper's Y.Doc — for snapshots, PDF
 * export, etc. Loads the doc into the cache if it isn't already.
 */
export async function readPaperJson(paperId: string): Promise<string> {
	const handle = await acquirePaperDoc(paperId);
	try {
		const { yDocToJson } = await import('@deutschemodelunitednations/munify-resolution-editor/yjs');
		return JSON.stringify(yDocToJson(handle.doc));
	} finally {
		handle.release();
	}
}

/**
 * Force-persist all dirty docs. Intended for graceful server shutdown.
 */
export async function flushAll(): Promise<void> {
	for (const [paperId, entry] of cache) {
		if (entry.persistTimer) clearTimeout(entry.persistTimer);
		entry.persistTimer = null;
		if (entry.dirty) await persist(paperId, entry);
	}
}
