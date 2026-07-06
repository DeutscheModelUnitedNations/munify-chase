// make sure we register all handlers before generating the schema later
import '$api/handlers/register';

import { WebSocketServer, type WebSocket as WSWebSocket } from 'ws';
import type { Socket } from 'node:net';
import { useServer, type Extra } from 'graphql-ws/use/ws';
import type { Context as GraphqlWsContext } from 'graphql-ws';
import { createWs } from '$api/rumble';
import type { IncomingMessage } from 'node:http';
import dayjs from 'dayjs';
import { openYjsRoom } from './yjs/wss';
import { rememberWsContext } from './context';
import { authenticateToken, authenticateWsUpgrade } from './services/auth';

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
		onConnect: async (ctx: GraphqlWsContext<Record<string, string>, Extra>) => {
			const req = ctx.extra.request;
			const ws = ctx.extra.socket as unknown as WSWebSocket;

			// browsers auth via session cookie on the upgrade request; native
			// (Tauri) clients send a Bearer token in connectionParams instead
			const token = ctx.connectionParams?.Authorization;
			const authCtx =
				(await authenticateWsUpgrade(req)) ?? (token ? await authenticateToken(token) : undefined);
			if (authCtx) {
				rememberWsContext(req, authCtx);
			}
			scheduleExpiration(ws, (authCtx?.oidc?.accessToken as { exp?: number } | undefined)?.exp);
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
	} else if (url.pathname.startsWith('/api/docs')) {
		// The paper id travels in-band with every Hocuspocus message, so the URL
		// carries no room segment. If upgrade-time auth fails (native client
		// without a session cookie), the Hocuspocus onAuthenticate hook still
		// gets a chance to auth via the in-band Bearer token.
		yjsWSS.handleUpgrade(req, socket, head, (ws) => {
			openYjsRoom(ws, req, authenticateWsUpgrade(req));
		});
	}
};
