/**
 * Server-side yjs backend for resolution papers, built on Hocuspocus.
 * Docs persist to `paper_yjs_doc.state`; with `REDIS_URL` set, updates sync
 * across Node instances. Authorization in `onConnect` reuses the authHelper
 * filters the Rumble ability rules use: team/global admin write, paperEditor
 * writes while WORKING_PAPER, other conference members read-only.
 */

import { Hocuspocus, type Document, type connectedPayload } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { Redis as RedisExtension } from '@hocuspocus/extension-redis';
import { Redis } from 'ioredis';
import * as Y from 'yjs';
import { db, schema } from '../db/db';
import { configPrivate } from '$config/private';
import type { Context } from '$api/context';
import {
	isParticipantInConference,
	isPaperEditor,
	isTeamInConference
} from '$api/services/authHelper';
import { authenticateToken } from '$api/services/auth';

const PERSIST_DEBOUNCE_MS = 1500;

// How often each open session re-runs its permission check, so status changes
// and revocations take effect without a reconnect.
const REAUTH_INTERVAL_MS = 30_000;

// `ctx` is undefined when upgrade-time auth failed (native client without a
// session cookie); onAuthenticate resolves it from the in-band Bearer token.
export interface YjsConnectionContext {
	ctx: Context | undefined;
}

export class CorruptYjsStateError extends Error {
	/**
	 * Sent verbatim to the client in the permission-denied message, so the UI
	 * can distinguish a corrupt doc from a plain authorization failure.
	 */
	reason = 'document-corrupt';

	constructor(
		public paperId: string,
		cause: unknown
	) {
		super(`paper_yjs_doc.state for paper ${paperId} failed to decode`);
		this.cause = cause;
	}
}

interface AuthResult {
	allowed: boolean;
	canWrite: boolean;
}

async function authorize(paperId: string, ctx: Context): Promise<AuthResult> {
	try {
		ctx.mustBeLoggedIn();
	} catch {
		return { allowed: false, canWrite: false };
	}

	// Read access to paper and paper existence
	const paper = await db.query.resolutionPaper.findFirst({
		where: {
			id: paperId,
			committee: isParticipantInConference(ctx)
		}
	});
	if (!paper) {
		return { allowed: false, canWrite: false };
	}

	// is team
	if (
		await db.query.resolutionPaper.findFirst({
			where: { id: paperId, committee: isTeamInConference(ctx) }
		})
	) {
		return { allowed: true, canWrite: true };
	}

	if (paper.status === 'WORKING_PAPER') {
		if (
			await db.query.paperEditor.findFirst({
				where: isPaperEditor(ctx, paperId)
			})
		)
			return { allowed: true, canWrite: true };
	}

	return { allowed: true, canWrite: false };
}

export const hocuspocus = new Hocuspocus<YjsConnectionContext>({
	debounce: PERSIST_DEBOUNCE_MS,

	extensions: [
		new Database({
			fetch: async ({ documentName: paperId }) => {
				const existing = await db.query.paperYjsDoc.findFirst({ where: { paperId } });
				if (!existing?.state || existing.state.byteLength === 0) {
					// No row yet — the doc starts empty and the first store will
					// insert. This is the expected path for a freshly-created paper.
					return null;
				}
				// Validate before handing the bytes to Hocuspocus: a decode failure
				// must surface as a distinct, non-retryable error to the client
				// instead of an opaque load failure.
				try {
					Y.applyUpdate(new Y.Doc(), existing.state);
				} catch (err) {
					console.error('[yjs] corrupt paper_yjs_doc.state — hard failing', {
						paperId,
						byteLength: existing.state.byteLength,
						err
					});
					throw new CorruptYjsStateError(paperId, err);
				}
				return existing.state;
			},
			store: async ({ documentName: paperId, state }) => {
				await db
					.insert(schema.paperYjsDoc)
					.values({ paperId, state })
					.onConflictDoUpdate({
						target: schema.paperYjsDoc.paperId,
						set: { state, updatedAt: new Date() }
					});
			}
		}),
		...(configPrivate.REDIS_URL
			? [
					new RedisExtension({
						// The extension bundles its own older ioredis whose types are
						// nominally incompatible with the project's; the runtime API
						// the extension uses is identical across both versions.
						createClient: () =>
							new Redis(configPrivate.REDIS_URL as string) as unknown as ReturnType<
								NonNullable<ConstructorParameters<typeof RedisExtension>[0]['createClient']>
							>
					})
				]
			: [])
	],

	// In-band token auth for native/Tauri clients that cannot send session
	// cookies. Web clients auth at upgrade time, so context.ctx is already set.
	onAuthenticate: async ({ token, context: connCtx }) => {
		if (connCtx.ctx) {
			return;
		}
		if (!token) {
			throw { code: 4401, reason: 'unauthorized' };
		}
		const ctx = await authenticateToken(token);
		if (!ctx) {
			throw { code: 4401, reason: 'unauthorized' };
		}
		connCtx.ctx = ctx;
	},

	// Runs once per document connection; throwing rejects the connection.
	onConnect: async ({ documentName: paperId, context, connectionConfig }) => {
		if (!context.ctx) {
			throw { code: 4401, reason: 'unauthorized' };
		}
		const auth = await authorize(paperId, context.ctx);
		if (!auth.allowed) {
			throw { code: 4403, reason: 'forbidden' };
		}
		connectionConfig.readOnly = !auth.canWrite;
	},

	// Periodically re-evaluate permissions so a paper transitioning out of
	// the editable window flips live sessions to read-only (or kicks them on
	// outright revocation) without waiting for a reconnect.
	// eslint-disable-next-line require-await
	connected: async ({
		documentName: paperId,
		context,
		connection
	}: connectedPayload<YjsConnectionContext>) => {
		if (!context.ctx) return;

		// Close the session when the OIDC access token expires. 4408 is not a
		// terminal code on the client, so browser clients reconnect with their
		// refreshed session; native clients must re-authenticate.
		const exp = (context.ctx.oidc?.accessToken as { exp?: number } | undefined)?.exp;
		if (exp) {
			const expiryTimer = setTimeout(
				() => {
					try {
						connection.webSocket.close(4408, 'Token expired');
					} catch {
						/* noop */
					}
				},
				Math.max(0, exp * 1000 - Date.now())
			);
			connection.onClose(() => clearTimeout(expiryTimer));
		}

		const reauthTimer = setInterval(async () => {
			if (!context.ctx) return;
			let next: AuthResult;
			try {
				next = await authorize(paperId, context.ctx);
			} catch (err) {
				console.error('[yjs] re-authorize failed', { paperId, err });
				return;
			}
			if (!next.allowed) {
				try {
					connection.webSocket.close(4403, 'Permission revoked');
				} catch {
					/* noop */
				}
				return;
			}
			connection.readOnly = !next.canWrite;
		}, REAUTH_INTERVAL_MS);
		connection.onClose(() => clearInterval(reauthTimer));
	}
});

/**
 * Run a server-side mutation against the paper's Y.Doc. The function
 * receives the live doc and may apply Y operations directly. The mutation
 * runs inside a Hocuspocus direct connection, so observers — including
 * connected websocket peers and other Node instances via Redis — see one
 * coherent update, and the doc is persisted on disconnect.
 */
export async function applyServerMutation<T>(paperId: string, fn: (doc: Y.Doc) => T): Promise<T> {
	const connection = await hocuspocus.openDirectConnection(paperId);
	try {
		let result!: T;
		await connection.transact((document: Document) => {
			result = fn(document);
		});
		return result;
	} finally {
		await connection.disconnect();
	}
}

/**
 * Read the current JSON projection of a paper's Y.Doc — for snapshots, PDF
 * export, etc. Loads the doc if it isn't already in memory.
 */
export async function readPaperJson(paperId: string): Promise<string> {
	const connection = await hocuspocus.openDirectConnection(paperId);
	try {
		const { yDocToJson } = await import('@deutschemodelunitednations/munify-resolution-editor/yjs');
		if (!connection.document) throw new Error(`yjs document ${paperId} not available`);
		return JSON.stringify(yDocToJson(connection.document));
	} finally {
		await connection.disconnect();
	}
}
