import type { HttpServer, PluginOption } from 'vite';
import { WebSocketServer } from 'ws';

export const webSocketServer: PluginOption = {
	name: 'webSocketServer',
	configureServer: (server) => {
		const webSocketServer = new WebSocketServer({
			server: server.httpServer
		});

		webSocketServer.on('connection', (socket, request) => {
			socket.on('message', (data, isBinary) => {
				console.log(`Recieved ${data}`);
			});

			socket.send('test from server');
		});
	}
};
