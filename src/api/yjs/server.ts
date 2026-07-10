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
import { context, type Context } from '$api/context';
import {
	isParticipantInConference,
	isPaperEditor,
	isTeamInConference
} from '$api/services/authHelper';
import { nativeToRequestEvent } from '$api/services/auth';
import { OIDC } from '$api/services/OIDC';

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

async function authorizeConnection(
	paperId: string,
	ctx: Context,
	connectionConfig: { readOnly: boolean }
) {
	const auth = await authorize(paperId, ctx);
	if (!auth.allowed) {
		throw { code: 4403, reason: 'forbidden' };
	}
	connectionConfig.readOnly = !auth.canWrite;
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

	// Validate in-band Bearer tokens from native/Tauri clients that cannot set
	// HTTP headers at upgrade time. Runs before onConnect.
	onAuthenticate: async ({ token, context: connContext }) => {
		// Upgrade-time auth (session cookie or Authorization header) already
		// populated ctx — nothing to do here.
		if (connContext.ctx) return;

		if (!token) {
			throw { code: 4401, reason: 'unauthorized' };
		}

		// Reuse the same OIDC validation path as HTTP requests.
		const fakeReq = {
			headers: { authorization: `Bearer ${token}` },
			url: '/'
		} as Parameters<typeof nativeToRequestEvent>[0];
		let syntheticEvent = nativeToRequestEvent(fakeReq);
		try {
			await OIDC.handle({
				event: syntheticEvent,
				resolve: (event) => {
					syntheticEvent = event;
					return new Response();
				}
			});
			const ctx = context(syntheticEvent);
			ctx.mustBeLoggedIn();
			connContext.ctx = ctx;
		} catch (err) {
			console.error('[yjs] in-band authentication failed', err);
			throw { code: 4401, reason: 'unauthorized' };
		}
	},

	// onAuthenticate runs before onConnect, so ctx is always populated by here
	// (upgrade-time auth or in-band auth). openDirectConnection (used by
	// applyServerMutation/readPaperJson) skips both hooks entirely.
	// The throw below guards clients that somehow bypass onAuthenticate.
	onConnect: async ({ documentName: paperId, context, connectionConfig }) => {
		if (!context.ctx) {
			throw { code: 4401, reason: 'unauthorized' };
		}
		await authorizeConnection(paperId, context.ctx, connectionConfig);
	},

	// Periodically re-check both session liveness and paper permissions, so a
	// revoked/expired session or a paper transitioning out of the editable
	// window flips live sessions to read-only (or kicks them) without waiting
	// for a reconnect.
	// eslint-disable-next-line require-await
	connected: async ({
		documentName: paperId,
		context,
		connection
	}: connectedPayload<YjsConnectionContext>) => {
		if (!context.ctx) return;
		const ctx = context.ctx;

		const reauthTimer = setInterval(async () => {
			// 4408 isn't a terminal code on the client, so browser clients
			// reconnect with their refreshed session; native clients must
			// re-authenticate. A transient check failure fails open — only a
			// definitive "not live" result closes the connection.
			try {
				if (!(await ctx.isSessionLive())) {
					connection.webSocket.close(4408, 'Session expired');
					return;
				}
			} catch (err) {
				console.error('[yjs] session liveness check failed', { paperId, err });
				return;
			}

			let next: AuthResult;
			try {
				next = await authorize(paperId, ctx);
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
