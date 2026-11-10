// make sure we register all handlers before generating the schema later
import '#api/handlers/register';

import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';
import type { Socket } from 'node:net';
import { useServer } from 'graphql-ws/use/ws';
import { createWs } from '#api/rumble';
import type { IncomingMessage } from 'node:http';
import { openYjsRoom } from './yjs/wss';
import { authenticatedEvent, nativeToRequestEvent } from './services/auth';
import type { Context } from './context';
import { isLinkCall } from './services/link/linkCaller';
import { LINK_TOKEN_HEADER } from './services/link/linkAuth';
import { logger } from '#lib/logger';

const wsLogger = logger.child({ name: 'wss' });

const gqlWSS = new WebSocketServer({ noServer: true });
const yjsWSS = new WebSocketServer({ noServer: true });

import { SYNTHETIC_EVENT_FIELD } from './services/syntheticRequestEvent';

// Stash the raw TCP socket on the upgrade IncomingMessage so the graphql-ws
// onConnect handler can reach it for deferred (connection_init) auth.
const UPGRADE_SOCKET_FIELD = '__upgradeSocket';

type UpgradeRequest = IncomingMessage & Record<string, unknown>;

/** Answers false to refuse the connection, nothing to accept it. */
type Verdict = false | undefined;

createWs(
	useServer as unknown as (options: unknown, ws: typeof gqlWSS) => void,
	{
		onConnect: (wsCtx: {
			connectionParams?: unknown;
			extra: { socket: WebSocket; request: IncomingMessage };
		}): Promise<Verdict> => {
			const req = wsCtx.extra.request as UpgradeRequest;
			// Upgrade-time auth (cookie / Authorization header) already stored the
			// synthetic event on the IncomingMessage — nothing more to do.
			if (req[SYNTHETIC_EVENT_FIELD]) return Promise.resolve(undefined);

			const params = (wsCtx.connectionParams ?? {}) as Record<string, unknown>;

			// The linked DELEGATOR's link worker sends its link token instead of a session.
			const linkToken = params[LINK_TOKEN_HEADER];
			if (typeof linkToken === 'string') return acceptLinkToken(req, linkToken);

			// Clients that cannot set HTTP headers (e.g. native/Tauri) send their
			// token as connectionParams.Authorization in the connection_init message.
			return acceptBearerToken(req, bearerParam(params));
		}
	},
	gqlWSS
);

async function acceptLinkToken(req: UpgradeRequest, linkToken: string): Promise<Verdict> {
	if (!(await isLinkCall(linkToken))) return false;
	const linkReq = Object.create(req) as IncomingMessage;
	linkReq.headers = { ...req.headers, [LINK_TOKEN_HEADER]: linkToken };
	const linkEvent = nativeToRequestEvent(linkReq);
	// checked once, here: the token may expire while the connection stays open
	linkEvent.locals.linkCaller = true;
	req[SYNTHETIC_EVENT_FIELD] = linkEvent;
}

/** The `Bearer …` value of the connection params' (first string) Authorization entry. */
function bearerParam(params: Record<string, unknown>): string | undefined {
	const value = [params.Authorization, params.authorization].find((v) => typeof v === 'string');
	return typeof value === 'string' && value.startsWith('Bearer ') ? value : undefined;
}

async function acceptBearerToken(
	req: UpgradeRequest,
	authHeader: string | undefined
): Promise<Verdict> {
	if (!authHeader) return false;

	// Inject the Bearer token into a synthetic request event and run OIDC.
	const fakeReq = Object.create(req) as IncomingMessage;
	fakeReq.headers = { ...req.headers, authorization: authHeader };
	try {
		const { event, ctx } = await authenticatedEvent(fakeReq);
		req[SYNTHETIC_EVENT_FIELD] = event;
		startWSValidityChecker(ctx, req[UPGRADE_SOCKET_FIELD] as Socket);
	} catch (err) {
		wsLogger.error('Validating the connection_init Bearer token failed', err);
		return false;
	}
}

const setHeaders = (headers: string[], req: IncomingMessage) => {
	const cookies = (req as unknown as Record<string, unknown>)[SYNTHETIC_EVENT_FIELD] as
		{ headers?: { 'set-cookie'?: string[] } } | undefined;
	if (cookies?.headers?.['set-cookie']) {
		for (const cookie of cookies.headers['set-cookie']) headers.push(`Set-Cookie: ${cookie}`);
	}
};
gqlWSS.on('headers', setHeaders);
yjsWSS.on('headers', setHeaders);

/** Which of our WebSocket endpoints an upgrade is for, if any. */
function upgradeEndpoint(url: string | undefined): 'graphql' | 'yjs' | undefined {
	const { pathname } = new URL(url ?? '/', 'http://localhost');
	if (pathname === '/api/graphql') return 'graphql';
	return pathname.startsWith('/api/docs') ? 'yjs' : undefined;
}

/**
 * The upgrade's session, from its cookie or Authorization header. Without one, both endpoints
 * still let the upgrade through: graphql-ws's onConnect validates connectionParams (a Bearer token
 * in the connection_init message), Hocuspocus's onAuthenticate the in-band Bearer token the
 * client sends after the upgrade.
 */
async function upgradeContext(req: UpgradeRequest, socket: Socket): Promise<Context | undefined> {
	try {
		const { event, ctx } = await authenticatedEvent(req);
		req[SYNTHETIC_EVENT_FIELD] = event;
		startWSValidityChecker(ctx, socket);
		return ctx;
	} catch {
		return undefined;
	}
}

(globalThis as Record<string, unknown>).__wssUpgrade = async (
	req: UpgradeRequest,
	socket: Socket,
	head: Buffer
) => {
	const endpoint = upgradeEndpoint(req.url);

	// In dev, vite.config.ts's wsPlugin forwards EVERY upgrade on this HTTP server here —
	// including Vite's own unrelated HMR websocket, which shares the same server/port.
	// Leave anything that isn't one of our own endpoints alone entirely: falling through
	// to the auth check below would (for an unauthenticated dev session) throw and
	// `socket.destroy()` a connection that Vite's own listener may have already upgraded,
	// racing it into a permanent connect/disconnect loop.
	if (!endpoint) return;

	// Store the raw socket early so the graphql-ws onConnect handler can reach
	// it when deferred (connection_init) authentication is needed.
	if (endpoint === 'graphql') req[UPGRADE_SOCKET_FIELD] = socket;

	const ctx = await upgradeContext(req, socket);

	if (endpoint === 'graphql') {
		gqlWSS.handleUpgrade(req, socket, head, (ws) => {
			gqlWSS.emit('connection', ws, req);
		});
	} else {
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
			wsLogger.error('Checking the session liveness failed', err);
		}
	}, SESSION_LIVENESS_CHECK_INTERVAL_MS);
	socket.once('close', () => clearInterval(interval));
}
