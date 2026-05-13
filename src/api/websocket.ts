// make sure we register all handlers before generating the schema later
import '$api/handlers/register';

import { WebSocketServer, type WebSocket as WSWebSocket } from 'ws';
import type { Socket } from 'node:net';
import { useServer } from 'graphql-ws/use/ws';
import { createWs } from './rumble';
import type { IncomingMessage } from 'node:http';
import type { RequestEvent } from '@sveltejs/kit';
import { OIDC } from './services/OIDC';
import { parse as parseCookies } from 'cookie';
import dayjs from 'dayjs';

const gqlWSS = new WebSocketServer({ noServer: true });
const otherWSS = new WebSocketServer({ noServer: true });

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
	const locals = {} as App.Locals;

	return {
		url,
		request: new Request(url.toString()),
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

async function authenticateWebSocketRequest(req: IncomingMessage) {
	const syntheticEvent = buildSyntheticEvent(req);

	await OIDC.handle({
		event: syntheticEvent,
		resolve: async () => new Response()
	});

	return syntheticEvent.locals;
}

createWs(useServer, {}, gqlWSS);

async function attachLocals(req: IncomingMessage, ws: WSWebSocket) {
	const locals = await authenticateWebSocketRequest(req);
	(req as any).locals = locals;

	const exp = locals.oidc?.accessToken?.exp;
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

(globalThis as any).__wssUpgrade = (req: IncomingMessage, socket: Socket, head: Buffer) => {
	switch (req.url) {
		case '/api/ws':
			otherWSS.handleUpgrade(req, socket, head, (ws) => {
				attachLocals(req, ws).then(() => {
					ws.emit('connection', ws, req);
					ws.send('unimplemented');
					ws.close();
				});
			});
			break;
		case '/api/graphql':
			gqlWSS.handleUpgrade(req, socket, head, (ws) => {
				attachLocals(req, ws).then(() => {
					gqlWSS.emit('connection', ws, req);
				});
			});
			break;
		default:
			return;
	}
};

export const wss = otherWSS;
