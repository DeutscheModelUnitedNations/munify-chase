// make sure we register all handlers before generating the schema later
import '$api/handlers/register';

import { WebSocketServer, type WebSocket as WSWebSocket } from 'ws';
import type { Socket } from 'node:net';
import { useServer, type Extra } from 'graphql-ws/use/ws';
import type { Context } from 'graphql-ws';
import { createWs } from '$api/rumble';
import type { IncomingMessage } from 'node:http';
import type { RequestEvent } from '@sveltejs/kit';
import { OIDC } from './services/OIDC';
import { parse as parseCookies } from 'cookie';
import dayjs from 'dayjs';
import { openYjsRoom } from './yjs/wss';
import { context } from './context';

const gqlWSS = new WebSocketServer({ noServer: true });
const yjsWSS = new WebSocketServer({ noServer: true });

/**
 * This is a bit hacky, but we need to create a synthetic RequestEvent to pass to the OIDC handler
 * so that it can populate the locals with the authenticated user.
 * Since this only ever runs on upgrade requests, we can get away with a lot of the properties being empty or no-ops.
 */
function buildSyntheticEvent(req: IncomingMessage): RequestEvent {
	// const host = req.headers.host ?? 'localhost';
	// const proto = req.headers['x-forwarded-proto'] ?? 'https';
	// TODO: align these with node adapter behavior
	const host = 'localhost';
	const proto = 'https';
	const url = new URL(req.url ?? '/', `${proto}://${host}`);
	const cookies = parseCookies(req.headers.cookie ?? '');
	const locals = {} as RequestEvent['locals'];

	const requestHeaders = new Headers();
	for (const [key, value] of Object.entries(req.headers)) {
		if (typeof value === 'string') {
			requestHeaders.set(key, value);
		} else if (Array.isArray(value)) {
			requestHeaders.set(key, value.join(', '));
		}
	}

	return {
		url,
		request: new Request(url.toString(), { headers: requestHeaders }),
		locals,
		cookies: {
			get: (name: string) => cookies[name],
			getAll: () => Object.entries(cookies).map(([name, value]) => ({ name, value, path: '/' })),
			set: () => {},
			delete: () => {},
			serialize: () => ''
		},
		params: {},
		route: { id: null },
		platform: undefined,
		fetch: globalThis.fetch,
		setHeaders: () => {},
		depends: () => {},
		untrack: <T>(fn: () => T) => fn(),
		isDataRequest: false,
		isSubRequest: false
	} as unknown as RequestEvent;
}

type LocalsBag = RequestEvent['locals'];
type RequestWithLocals = IncomingMessage & { locals?: LocalsBag };

function scheduleExpiration(ws: WSWebSocket, exp: number | undefined) {
	const expirationTimestamp = exp ? dayjs.unix(exp) : dayjs().add(300, 'seconds');
	const timeout = setTimeout(
		() => {
			ws.close();
		},
		expirationTimestamp.diff(dayjs(), 'milliseconds')
	);
	ws.addEventListener('close', () => {
		clearTimeout(timeout);
	});
}

async function authenticateWsRequest(req: RequestWithLocals) {
	// has this req already been authenticated by a previous handler in the upgrade chain? If so, skip redundant work.
	if ((req.locals as App.Locals)?.oidc) return req.locals as App.Locals;

	const syntheticEvent = buildSyntheticEvent(req);
	try {
		await OIDC.handle({
			event: syntheticEvent,
			// eslint-disable-next-line require-await
			resolve: async () => new Response()
		});
	} catch {
		return undefined;
	}
	req.locals = syntheticEvent.locals;
	return syntheticEvent as RequestEvent;
}

createWs(
	useServer as unknown as (options: unknown, ws: typeof gqlWSS) => void,
	{
		onConnect: async (ctx: Context<Record<string, string>, Extra>) => {
			const req = ctx.extra.request as RequestWithLocals;
			const ws = ctx.extra.socket as unknown as WSWebSocket;

			// Native clients (Tauri) send the Bearer token in graphql-ws connectionParams
			// rather than as an HTTP Authorization header on the WS upgrade request (which
			// is what web clients do via cookies). Inject the token into the Node
			// IncomingMessage headers before the OIDC handler runs so both auth paths work.
			const bearerFromParams = ctx.connectionParams?.Authorization;
			if (bearerFromParams && !req.headers.authorization) {
				(req.headers as Record<string, string>).authorization = bearerFromParams;
			}

			const event = await authenticateWsRequest(req);
			scheduleExpiration(
				ws,
				(event as unknown as { locals?: { oidc?: { accessToken?: { exp?: number } } } } | undefined)
					?.locals?.oidc?.accessToken?.exp
			);
			return true;
		}
	},
	gqlWSS
);

(globalThis as Record<string, unknown>).__wssUpgrade = (
	req: IncomingMessage,
	socket: Socket,
	head: Buffer
) => {
	const url = new URL(req.url ?? '/', 'http://localhost');
	if (url.pathname === '/api/graphql') {
		gqlWSS.handleUpgrade(req, socket, head, (ws) => {
			gqlWSS.emit('connection', ws, req);
		});
	} else if (url.pathname.startsWith('/api/yjs')) {
		// The paper id travels in-band with every Hocuspocus protocol message,
		// so the URL carries no room segment. Authorization per paper happens
		// in the Hocuspocus onConnect hook.
		yjsWSS.handleUpgrade(req, socket, head, (ws) => {
			// openYjsRoom attaches its message buffer synchronously; authentication
			// resolves inside it via this promise.
			openYjsRoom(
				ws,
				req,
				(async () => {
					const event = await authenticateWsRequest(req);
					return await context(event as unknown as RequestEvent);
				})()
			);
		});
	}
};
