import { WebSocketServer, type WebSocket } from 'ws';
import type { IncomingMessage } from 'node:http';
// import { GET } from '../routes/api/graphql/+server';
import { useServer } from 'graphql-ws/use/ws';
import { buildSchema } from './rumble';

// make sure we register all handlers before generating the schema later
import '$api/handlers/register';
import { context } from './context';
import type { Socket } from 'node:net';

const gqlWSS = new WebSocketServer({ noServer: true });
const otherWSS = new WebSocketServer({ noServer: true });

useServer({ schema: buildSchema(), context }, gqlWSS);

// write an upgrade handler so we can control what happens with an upgrade request to our wss server
(globalThis as any).__wssUpgrade = (req: IncomingMessage, socket: Socket, head: Buffer) => {
	switch (req.url) {
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
		default:
			// socket.destroy();
			return;
	}
};

export const wss = otherWSS;
