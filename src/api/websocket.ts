// make sure we register all handlers before generating the schema later
import '$api/handlers/register';

import { WebSocketServer, type WebSocket as WSWebSocket } from 'ws';
import type { Socket } from 'node:net';
import { useServer, type Extra } from 'graphql-ws/use/ws';
import type { Context } from 'graphql-ws';
import { createWs } from '$api/rumble';
import type { IncomingMessage } from 'node:http';
import dayjs from 'dayjs';
import { openYjsRoom } from './yjs/wss';
import { context } from './context';
import { authenticateUpgradeRequest, type RequestWithLocals } from './wsAuth';

const gqlWSS = new WebSocketServer({ noServer: true });
const yjsWSS = new WebSocketServer({ noServer: true });

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

			const event = await authenticateUpgradeRequest(req);
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
		// in the Hocuspocus onConnect hook. If upgrade-time auth fails (native
		// client with no session cookie), the connection is not immediately closed
		// — the Hocuspocus onAuthenticate hook handles Bearer token auth in-band.
		yjsWSS.handleUpgrade(req, socket, head, (ws) => {
			openYjsRoom(
				ws,
				req,
				(async () => {
					const event = await authenticateUpgradeRequest(req);
					if (!event) return undefined;
					return context(event as unknown as import('@sveltejs/kit').RequestEvent);
				})()
			);
		});
	}
};
