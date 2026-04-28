// @eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck — imports ./env.js and ./handler.js which are adapter-node build outputs
import { createServer } from 'node:http';
import polka from 'polka';
import { env, timeout_env } from './env.js';

const port = parseInt(env('PORT', '3000'));
const host = env('HOST', '0.0.0.0');

const httpServer = createServer();

const { handler } = await import('./handler.js');

const keepAlive = timeout_env('KEEP_ALIVE_TIMEOUT');
if (keepAlive !== undefined) httpServer.keepAliveTimeout = keepAlive * 1000;
const headersTimeout = timeout_env('HEADERS_TIMEOUT');
if (headersTimeout !== undefined) httpServer.headersTimeout = headersTimeout * 1000;

httpServer.on('upgrade', (req, socket, head) => {
	if (globalThis.__wssUpgrade) {
		globalThis.__wssUpgrade(req, socket, head);
	} else {
		console.warn('Received WebSocket upgrade request but no handler is set up');
		socket.destroy();
	}
});

polka({ server: httpServer })
	.use(handler)
	.listen({ host, port }, () => {
		console.log(`Listening on http://${host}:${port}`);
	});
