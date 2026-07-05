/**
 * Adapter between the app's `ws`-based WebSocket upgrade handling and the
 * Hocuspocus instance in `server.ts`.
 *
 * Authentication runs in two places:
 *   1. Upgrade time (cookie / Authorization header) — `authenticateUpgradeRequest`
 *      in wsAuth.ts builds a Context that is passed to `handleConnection`. This
 *      covers web-browser clients that already have a session cookie.
 *   2. Hocuspocus `onAuthenticate` hook — handles native/Tauri clients that
 *      cannot send session cookies cross-origin and instead pass a Bearer token
 *      via the Hocuspocus `auth` in-band message. The hook verifies the token
 *      and sets `context.ctx` before `onConnect` runs.
 *
 * When upgrade-time auth fails (native client), the connection is NOT closed
 * immediately — it is handed to Hocuspocus with `ctx: undefined` so that
 * `onAuthenticate` gets a chance to validate the in-band token.
 *
 * The document name arrives in-band with every protocol message (Hocuspocus
 * multiplexing), so the URL path carries no room segment.
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
 * Hand a WebSocket over to Hocuspocus once `ctxPromise` resolves. Hocuspocus
 * takes care of sync, awareness, read-only enforcement, persistence, and
 * multi-instance fanout from here on.
 *
 * Must be called synchronously from the upgrade callback: the client sends
 * its auth + sync-step-1 frames immediately on open, and `ws` does NOT queue
 * 'message' events received before a listener exists. We attach a buffering
 * listener right away and replay the buffer once authentication (which is
 * what `ctxPromise` awaits) has finished.
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
