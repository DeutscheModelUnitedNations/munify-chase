// make sure we register all handlers before generating the schema later
import '$api/handlers/register';

import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';
import type { Socket } from 'node:net';
import { useServer } from 'graphql-ws/use/ws';
import { createWs } from '$api/rumble';
import type { IncomingMessage } from 'node:http';
import { openYjsRoom } from './yjs/wss';
import { nativeToRequestEvent } from './services/auth';
import { OIDC } from './services/OIDC';
import { kioskOIDCHandle } from './services/kioskOIDC';
import { context, type Context } from './context';

const gqlWSS = new WebSocketServer({ noServer: true });
const yjsWSS = new WebSocketServer({ noServer: true });

export {
	SYNTHETIC_EVENT_FIELD,
	hasSyntheticSvelteRequestEvent
} from './services/syntheticRequestEvent';
import { SYNTHETIC_EVENT_FIELD } from './services/syntheticRequestEvent';

// Stash the raw TCP socket on the upgrade IncomingMessage so the graphql-ws
// onConnect handler can reach it for deferred (connection_init) auth.
const UPGRADE_SOCKET_FIELD = '__upgradeSocket';

createWs(
	useServer as unknown as (options: unknown, ws: typeof gqlWSS) => void,
	{
		onConnect: async (wsCtx: {
			connectionParams?: unknown;
			extra: { socket: WebSocket; request: IncomingMessage };
		}) => {
			const req = wsCtx.extra.request;
			// Upgrade-time auth (cookie / Authorization header) already stored the
			// synthetic event on the IncomingMessage — nothing more to do.
			if ((req as unknown as Record<string, unknown>)[SYNTHETIC_EVENT_FIELD]) return;

			// Clients that cannot set HTTP headers (e.g. native/Tauri) send their
			// token as connectionParams.Authorization in the connection_init message.
			const params = wsCtx.connectionParams as Record<string, unknown> | undefined;
			const authHeader =
				typeof params?.Authorization === 'string'
					? params.Authorization
					: typeof params?.authorization === 'string'
						? params.authorization
						: undefined;

			if (!authHeader?.startsWith('Bearer ')) {
				return false;
			}

			// Inject the Bearer token into a synthetic request event and run OIDC.
			const fakeReq = Object.create(req) as IncomingMessage;
			fakeReq.headers = { ...req.headers, authorization: authHeader };
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
				(req as unknown as Record<string, unknown>)[SYNTHETIC_EVENT_FIELD] = syntheticEvent;
				const socket = (req as unknown as Record<string, unknown>)[UPGRADE_SOCKET_FIELD] as Socket;
				startWSValidityChecker(ctx, socket);
			} catch (err) {
				console.error('[wss] failed to validate connection_init Bearer token', err);
				return false;
			}
		}
	},
	gqlWSS
);

const setHeaders = (headers: string[], req: IncomingMessage) => {
	const cookies = (req as unknown as Record<string, unknown>)[SYNTHETIC_EVENT_FIELD] as
		{ headers?: { 'set-cookie'?: string[] } } | undefined;
	if (cookies?.headers?.['set-cookie']) {
		for (const cookie of cookies.headers['set-cookie']) headers.push(`Set-Cookie: ${cookie}`);
	}
};
gqlWSS.on('headers', setHeaders);
yjsWSS.on('headers', setHeaders);

(globalThis as Record<string, unknown>).__wssUpgrade = async (
	req: IncomingMessage,
	socket: Socket,
	head: Buffer
) => {
	const url = new URL(req.url ?? '/', 'http://localhost');
	const isGql = url.pathname === '/api/graphql';
	const isYjs = url.pathname.startsWith('/api/docs');

	// Store the raw socket early so the graphql-ws onConnect handler can reach
	// it when deferred (connection_init) authentication is needed.
	if (isGql) (req as unknown as Record<string, unknown>)[UPGRADE_SOCKET_FIELD] = socket;

	let syntheticSvelteRequestEvent = nativeToRequestEvent(req);
	let ctx: Context | undefined;

	try {
		await OIDC.handle({
			event: syntheticSvelteRequestEvent,
			resolve: (event) => {
				syntheticSvelteRequestEvent = event;
				return new Response();
			}
		});
		// kioskOIDCHandle has to run here too, unconditionally, same as it does
		// after OIDC.handle in hooks.server.ts's `handle` sequence for normal
		// HTTP requests — see the doc comment on it in kioskOIDC.ts for why it
		// can't be skipped just because OIDC.handle above already populated
		// `locals.oidc` (it can, and does, even for kiosk device-flow cookies,
		// via its introspection fallback — that alone isn't enough to set
		// isKioskSession). This upgrade path calls OIDC.handle directly
		// instead of going through that `handle` sequence, so it has to run
		// the kiosk check itself too, or every kiosk GraphQL subscription (the
		// entire live-update mechanism /kiosk relies on) would authenticate as
		// the underlying person's normal, non-read-only session instead.
		await kioskOIDCHandle({
			event: syntheticSvelteRequestEvent,
			resolve: (event) => {
				syntheticSvelteRequestEvent = event;
				return new Response();
			}
		});
		const authedCtx = context(syntheticSvelteRequestEvent);
		authedCtx.mustBeLoggedIn();
		ctx = authedCtx;
		(req as unknown as Record<string, unknown>)[SYNTHETIC_EVENT_FIELD] =
			syntheticSvelteRequestEvent;
		startWSValidityChecker(ctx, socket);
	} catch (err) {
		if (!isGql && !isYjs) {
			console.error('[wss] failed to validate websocket connection', err);
			socket.destroy();
			return;
		}
		// isGql: allow through — graphql-ws onConnect validates connectionParams
		//        (Bearer token in the connection_init message).
		// isYjs: allow through — Hocuspocus onAuthenticate validates the in-band
		//        Bearer token sent by the client after the upgrade.
	}

	if (isGql) {
		gqlWSS.handleUpgrade(req, socket, head, (ws) => {
			gqlWSS.emit('connection', ws, req);
		});
	} else if (isYjs) {
		// ctx may be undefined here when upgrade-time auth found no credentials;
		// openYjsRoom accepts undefined and Hocuspocus's onAuthenticate hook will
		// validate the in-band Bearer token before allowing document access.
		yjsWSS.handleUpgrade(req, socket, head, (ws) => {
			openYjsRoom(ws, req, Promise.resolve(ctx));
		});
	}
};

const SESSION_LIVENESS_CHECK_INTERVAL_MS = 5 * 60_000;

function startWSValidityChecker(ctx: Context, socket: Socket) {
	const interval = setInterval(async () => {
		try {
			if (!(await ctx.isSessionLive())) {
				clearInterval(interval);
				socket.destroy();
			}
		} catch (err) {
			// A transient failure (e.g. the introspection call itself erroring
			// out) fails open — only a definitive "not live" result disconnects.
			console.error('[wss] failed to check websocket session liveness', err);
		}
	}, SESSION_LIVENESS_CHECK_INTERVAL_MS);
	socket.once('close', () => clearInterval(interval));
}
