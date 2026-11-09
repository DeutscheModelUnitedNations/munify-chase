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
import { REDIS_URL } from '$app/env/private';
import type { Context } from '#api/context';
import {
	isParticipantInConference,
	isPaperEditor,
	isTeamInConference
} from '#api/services/authHelper';
import { authenticatedEvent } from '#api/services/auth';
import { READ_ONLY_DOWNGRADE_STATELESS_MESSAGE } from '#lib/api/yjs/statelessMessages';
import { detachFromDelegator } from '#api/services/link/detach';
import { logger } from '#lib/logger';

/** The Yjs backend's lines, under `name: yjs` */
export const yjsLogger = logger.child({ name: 'yjs' });

const PERSIST_DEBOUNCE_MS = 1500;

// How often each open session re-runs its permission check, so status changes
// and revocations take effect without a reconnect.
const REAUTH_INTERVAL_MS = 30_000;

// `ctx` is undefined when upgrade-time auth failed (native client without a
// session cookie); onAuthenticate resolves it from the in-band Bearer token.
export interface YjsConnectionContext {
	ctx: Context | undefined;
}

class CorruptYjsStateError extends Error {
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

const denied = (): AuthResult => ({ allowed: false, canWrite: false });

function isLoggedIn(ctx: Context) {
	try {
		ctx.mustBeLoggedIn();
		return true;
	} catch {
		return false;
	}
}

async function authorize(paperId: string, ctx: Context): Promise<AuthResult> {
	if (!isLoggedIn(ctx)) return denied();

	// Read access to paper and paper existence
	const paper = await db.query.resolutionPaper.findFirst({
		where: {
			id: paperId,
			committee: isParticipantInConference(ctx)
		}
	});
	if (!paper) return denied();

	return { allowed: true, canWrite: await canWritePaper({ paperId, ctx, status: paper.status }) };
}

/** The team writes, a paper's editors while it is a working paper. */
async function canWritePaper({
	paperId,
	ctx,
	status
}: {
	paperId: string;
	ctx: Context;
	status: string;
}): Promise<boolean> {
	const asTeam = await db.query.resolutionPaper.findFirst({
		where: { id: paperId, committee: isTeamInConference(ctx) }
	});
	if (asTeam) return true;
	if (status !== 'WORKING_PAPER') return false;
	return !!(await db.query.paperEditor.findFirst({ where: isPaperEditor(ctx, paperId) }));
}

/**
 * The stored state Hocuspocus starts the doc from: none yet for a freshly created paper (the first
 * store inserts it). Validated before handing the bytes over: a decode failure must surface as a
 * distinct, non-retryable error to the client instead of an opaque load failure.
 */
function storedState({
	paperId,
	state
}: {
	paperId: string;
	state: Uint8Array | undefined;
}): Uint8Array | null {
	if (!state || state.byteLength === 0) return null;
	try {
		Y.applyUpdate(new Y.Doc(), state);
	} catch (err) {
		yjsLogger.error('Corrupt paper_yjs_doc.state, failing hard', {
			paperId,
			byteLength: state.byteLength,
			err
		});
		throw new CorruptYjsStateError(paperId, err);
	}
	return state;
}

type YjsConnection = connectedPayload<YjsConnectionContext>['connection'];

/**
 * Whether the session is still live. 4408 isn't a terminal code on the client, so browser clients
 * reconnect with their refreshed session; native clients must re-authenticate. A transient check
 * failure fails open: only a definitive "not live" result closes the connection.
 */
async function sessionStillLive({
	paperId,
	ctx,
	connection
}: {
	paperId: string;
	ctx: Context;
	connection: YjsConnection;
}): Promise<boolean> {
	let live: boolean;
	try {
		live = await ctx.isSessionLive();
	} catch (err) {
		yjsLogger.error('Checking the session liveness failed', { paperId, err });
		return false;
	}
	if (!live) connection.webSocket.close(4408, 'Session expired');
	return live;
}

/** The connection's permissions now, closing it when they are gone; undefined when unknown. */
async function permissionsStillHeld({
	paperId,
	ctx,
	connection
}: {
	paperId: string;
	ctx: Context;
	connection: YjsConnection;
}): Promise<AuthResult | undefined> {
	let next: AuthResult;
	try {
		next = await authorize(paperId, ctx);
	} catch (err) {
		yjsLogger.error('Re-authorizing failed', { paperId, err });
		return undefined;
	}
	if (next.allowed) return next;
	try {
		connection.webSocket.close(4403, 'Permission revoked');
	} catch {
		/* noop */
	}
	return undefined;
}

/**
 * Write access lost but read access remains: unlike a full revocation, don't drop the connection
 * (the user should keep seeing live updates). The client can't observe `connection.readOnly`
 * flipping on an open socket by itself, so tell it explicitly: it reloads to pick up the new state
 * consistently across the whole page, not just the doc.
 */
function applyWriteAccess({
	paperId,
	connection,
	canWrite
}: {
	paperId: string;
	connection: YjsConnection;
	canWrite: boolean;
}) {
	if (!connection.readOnly && !canWrite) {
		try {
			connection.sendStateless(READ_ONLY_DOWNGRADE_STATELESS_MESSAGE);
		} catch (err) {
			yjsLogger.error('Notifying the client of the read-only downgrade failed', { paperId, err });
		}
	}
	connection.readOnly = !canWrite;
}

async function recheckConnection(args: {
	paperId: string;
	ctx: Context;
	connection: YjsConnection;
}) {
	if (!(await sessionStillLive(args))) return;
	const next = await permissionsStillHeld(args);
	if (next) applyWriteAccess({ ...args, canWrite: next.canWrite });
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
				return storedState({ paperId, state: existing?.state });
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
		...(REDIS_URL
			? [
					new RedisExtension({
						// The extension bundles its own older ioredis whose types are
						// nominally incompatible with the project's; the runtime API
						// the extension uses is identical across both versions.
						createClient: () =>
							// protocol: 2 — see the matching comment in rumble.ts; keeps ioredis v6 on
							// the RESP2 wire format the extension's bundled (older) ioredis expects.
							new Redis(REDIS_URL as string, {
								protocol: 2
							}) as unknown as ReturnType<
								NonNullable<ConstructorParameters<typeof RedisExtension>[0]['createClient']>
							>
					})
				]
			: [])
	],

	// Validate in-band Bearer tokens from native/Tauri clients that cannot set
	// HTTP headers at upgrade time. In Hocuspocus v4.x this runs AFTER onConnect,
	// so for native clients (ctx undefined in onConnect) this hook also handles
	// the paper authorization that onConnect skipped.
	onAuthenticate: async ({
		token,
		documentName: paperId,
		context: connContext,
		connectionConfig
	}) => {
		// Upgrade-time auth (session cookie) already populated ctx and onConnect
		// already authorized the paper — nothing more to do here.
		if (connContext.ctx) return;

		if (!token) {
			throw { code: 4401, reason: 'unauthorized' };
		}

		// Reuse the same OIDC validation path as HTTP requests.
		try {
			const { ctx } = await authenticatedEvent({
				headers: { authorization: `Bearer ${token}` },
				url: '/'
			});
			connContext.ctx = ctx;
		} catch (err) {
			yjsLogger.error('In-band authentication failed', err);
			throw { code: 4401, reason: 'unauthorized' };
		}

		// onConnect ran before us and skipped authorization because ctx was null.
		// Now that ctx is set, authorize the paper access.
		await authorizeConnection(paperId, connContext.ctx, connectionConfig);
	},

	// A draft taken over from DELEGATOR becomes CHASE's own on the first edit somebody makes; the
	// link's own text updates come through a direct connection, which carries no session.
	onChange: async ({ documentName: paperId, context }) => {
		if (context?.ctx) await detachFromDelegator(paperId);
	},

	// In Hocuspocus v4.x onConnect runs BEFORE onAuthenticate. For web clients
	// (session-cookie upgrade), ctx is already set here and we authorize now.
	// For native/Tauri clients (no cookie at upgrade time), ctx is undefined
	// here — we return and let onAuthenticate do both auth and authz below.
	onConnect: async ({ documentName: paperId, context, connectionConfig }) => {
		if (!context.ctx) {
			// Native client: defer to onAuthenticate (in-band Bearer token flow).
			return;
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

		const reauthTimer = setInterval(
			() => void recheckConnection({ paperId, ctx, connection }),
			REAUTH_INTERVAL_MS
		);
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
