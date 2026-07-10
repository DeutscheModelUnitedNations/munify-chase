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
			console.error('[yjs] context creation failed', err);
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
