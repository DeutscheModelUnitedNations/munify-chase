/**
 * Adapter between the app's `ws`-based upgrade handling and the Hocuspocus
 * instance in `server.ts`. Auth runs at upgrade time (cookie / Authorization
 * header) or, for native clients, via the in-band token in the Hocuspocus
 * onAuthenticate hook — so a failed upgrade auth does NOT close the socket.
 */

import type { IncomingMessage } from 'node:http';
import type { WebSocket } from 'ws';
import type { Context } from '$api/context';
import { hocuspocus } from './server';

/** Build the WHATWG Request Hocuspocus reads the URL and headers from. */
function buildRequest(req: IncomingMessage): Request {
	const url = new URL(req.url ?? '/', 'http://localhost');
	const headers = new Headers();
	for (const [key, value] of Object.entries(req.headers)) {
		if (typeof value === 'string') {
			headers.set(key, value);
		} else if (Array.isArray(value)) {
			headers.set(key, value.join(', '));
		}
	}
	return new Request(url, { headers });
}

/**
 * Hand a WebSocket over to Hocuspocus once `ctxPromise` resolves. Must be
 * called synchronously from the upgrade callback: `ws` does not queue
 * 'message' events, so early frames are buffered and replayed after auth.
 */
export function openYjsRoom(
	ws: WebSocket,
	req: IncomingMessage,
	ctxPromise: Promise<Context | undefined>
): void {
	const earlyMessages: Buffer[] = [];
	const earlyMessageHandler = (data: Buffer) => {
		earlyMessages.push(data);
	};
	ws.on('message', earlyMessageHandler);

	let earlyClosed = false;
	const earlyCloseHandler = () => {
		earlyClosed = true;
	};
	ws.on('close', earlyCloseHandler);
	ws.on('error', earlyCloseHandler);

	void (async () => {
		let ctx: Context | undefined;
		try {
			ctx = await ctxPromise;
		} catch (err) {
			console.error('[yjs] authentication failed during ws upgrade', err);
		}
		// Do NOT close here when ctx is undefined: native/Tauri clients that
		// cannot send session cookies will authenticate in-band via the
		// Hocuspocus onAuthenticate hook using a Bearer token.
		if (earlyClosed) return;

		// Unauthenticated connections need no extra deadline here: Hocuspocus
		// terminates any connection that has not authenticated within its
		// `timeout` (60s default).
		const clientConnection = hocuspocus.handleConnection(ws, buildRequest(req), { ctx });

		const toUint8 = (data: Buffer) => new Uint8Array(data.buffer, data.byteOffset, data.byteLength);

		// Swap in the real handlers and drain anything that arrived during auth.
		ws.off('message', earlyMessageHandler);
		ws.off('close', earlyCloseHandler);
		ws.off('error', earlyCloseHandler);
		ws.on('message', (data: Buffer) => {
			clientConnection.handleMessage(toUint8(data));
		});
		ws.on('close', (code: number, reason: Buffer) => {
			clientConnection.handleClose({ code, reason: reason.toString('utf8') } as CloseEvent);
		});
		ws.on('error', () => {
			clientConnection.handleClose();
		});
		for (const buffered of earlyMessages) {
			clientConnection.handleMessage(toUint8(buffered));
		}
		earlyMessages.length = 0;
	})();
}
