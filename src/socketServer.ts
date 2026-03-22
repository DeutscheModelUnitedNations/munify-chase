// @ts-expect-error will be available in build context
import { server } from './index.js';
import { WebSocketServer } from 'ws';

server.server.on('upgrade', (req, socket, head) => {
	if (req.url === '/your-websocket-route') {
		// Handle your WebSocket upgrade here, for example with `ws` package:
		// wss.handleUpgrade(req, socket, head, (ws) => {
		// 	wss.emit('connection', ws, req);
		// });
	} else {
		socket.destroy();
	}
});
