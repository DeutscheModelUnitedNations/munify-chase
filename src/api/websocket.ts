// make sure we register all handlers before generating the schema later
import '$api/handlers/register';

import { WebSocketServer, type WebSocket as WSWebSocket } from 'ws';
import type { Socket } from 'node:net';
import { useServer, type Extra } from 'graphql-ws/use/ws';
import type { Context } from 'graphql-ws';
import { createWs } from './rumble';
import type { IncomingMessage } from 'node:http';
import type { RequestEvent } from '@sveltejs/kit';
import { OIDC } from './services/OIDC';
import { parse as parseCookies } from 'cookie';
import dayjs from 'dayjs';
import { openYjsRoom } from './yjs/wss';
const gqlWSS = new WebSocketServer({ noServer: true });
const yjsWSS = new WebSocketServer({ noServer: true });
const otherWSS = new WebSocketServer({ noServer: true });

/**
 * This is a bit hacky, but we need to create a synthetic RequestEvent to pass to the OIDC handler
 * so that it can populate the locals with the authenticated user.
 * Since this only ever runs on upgrade requests, we can get away with a lot of the properties being empty or no-ops.
 */
function buildSyntheticEvent(req: IncomingMessage, authorizationHeader?: string): RequestEvent {
	// const host = req.headers.host ?? 'localhost';
	// const proto = req.headers['x-forwarded-proto'] ?? 'https';
	// TODO: align these with node adapter behavior
	const host = 'localhost';
	const proto = 'https';
	const url = new URL(req.url ?? '/', `${proto}://${host}`);
	const cookies = parseCookies(req.headers.cookie ?? '');
	const locals = {} as RequestEvent['locals'];

	const requestHeaders = new Headers();
	if (authorizationHeader) requestHeaders.set('authorization', authorizationHeader);

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

// rumble 0.18.1's createWs over-constrains the `implementation` generic so that
// graphql-ws's `useServer` (which keeps its own generic parameters) no longer
// satisfies it. Runtime is unaffected — strip the generics at the call boundary.
createWs(
	useServer as unknown as (options: unknown, ws: typeof gqlWSS) => void,
	{
		onConnect: async (ctx: Context<Record<string, string>, Extra>) => {
			const req = ctx.extra.request as RequestWithLocals;
			const ws = ctx.extra.socket as unknown as WSWebSocket;

			// Already authenticated at upgrade time (e.g. second connection_init on same socket).
			if ((req.locals as App.Locals)?.oidc) {
				scheduleExpiration(ws, (req.locals as App.Locals).oidc?.accessToken?.exp);
				return true;
			}

			// Tauri clients pass the Bearer token in header
			const params = ctx.connectionParams as Record<string, string> | null;
			const auth = params?.Authorization ?? params?.authorization;
			if (auth?.startsWith('Bearer ')) {
				const syntheticEvent = buildSyntheticEvent(req, auth);
				try {
					await OIDC.handle({
						event: syntheticEvent,
						resolve: async () => new Response()
					});
					req.locals = syntheticEvent.locals;
					const oidc = (req.locals as App.Locals)?.oidc;
					if (oidc) {
						scheduleExpiration(ws, oidc.accessToken?.exp);
						return true;
					}
					return false;
				} catch {
					return false;
				}
			}

			// Browser clients
			const syntheticEvent = buildSyntheticEvent(req);
			try {
				await OIDC.handle({
					event: syntheticEvent,
					resolve: async () => new Response()
				});
			} catch {
				console.error('Error during OIDC authentication for websocket connection');
				return false;
			}
			req.locals = syntheticEvent.locals;
			scheduleExpiration(ws, (syntheticEvent.locals as App.Locals).oidc?.accessToken?.exp);
			return true;
		}
	},
	gqlWSS
);

async function authenticateUpgrade(req: IncomingMessage): Promise<string | undefined> {
	const reqWithLocals = req as RequestWithLocals;
	if ((reqWithLocals.locals as App.Locals)?.oidc?.user) {
		return (reqWithLocals.locals as App.Locals).oidc?.user?.sub;
	}
	const syntheticEvent = buildSyntheticEvent(req);
	try {
		await OIDC.handle({
			event: syntheticEvent,
			resolve: async () => new Response()
		});
	} catch {
		return undefined;
	}
	reqWithLocals.locals = syntheticEvent.locals;
	return (reqWithLocals.locals as App.Locals)?.oidc?.user?.sub;
}

(globalThis as Record<string, unknown>).__wssUpgrade = (
	req: IncomingMessage,
	socket: Socket,
	head: Buffer
) => {
	const url = new URL(req.url ?? '/', 'http://localhost');
	switch (url.pathname) {
		case '/api/ws':
			otherWSS.handleUpgrade(req, socket, head, (ws) => {
				ws.emit('connection', ws, req);
				ws.send('unimplemented');
				ws.close();
			});
			break;
		case '/api/graphql':
			gqlWSS.handleUpgrade(req, socket, head, (ws) => {
				gqlWSS.emit('connection', ws, req);
			});
			break;
		case '/api/yjs': {
			const paperId = url.searchParams.get('room');
			if (!paperId) {
				socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
				socket.destroy();
				return;
			}
			yjsWSS.handleUpgrade(req, socket, head, async (ws) => {
				const userSub = await authenticateUpgrade(req);
				if (!userSub) {
					ws.close(4401, 'Unauthorized');
					return;
				}
				void openYjsRoom(ws, paperId, userSub);
			});
			break;
		}
		default:
			return;
	}
};

export const wss = otherWSS;
