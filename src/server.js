// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — imports ./index.js, the adapter-node build output
// adapter-node's own server handles listening, timeouts and graceful shutdown. This only adds
// the WebSocket upgrade for GraphQL subscriptions and Yjs (see src/api/websocket.ts).
// fallow-ignore-next-line unresolved-import -- written next to this file by the build
import { server } from './index.js';

server.on('upgrade', (req, socket, head) => {
	if (globalThis.__wssUpgrade) {
		globalThis.__wssUpgrade(req, socket, head);
	} else {
		console.warn('Received WebSocket upgrade request but no handler is set up');
		socket.destroy();
	}
});
