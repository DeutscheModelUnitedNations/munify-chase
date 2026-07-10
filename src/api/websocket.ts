// make sure we register all handlers before generating the schema later
import '$api/handlers/register';

import { WebSocketServer } from 'ws';
import type { Socket } from 'node:net';
import { useServer } from 'graphql-ws/use/ws';
import { createWs } from '$api/rumble';
import type { IncomingMessage } from 'node:http';
import { openYjsRoom } from './yjs/wss';
import { nativeToRequestEvent } from './services/auth';
import { OIDC } from './services/OIDC';
import { context, type Context } from './context';
import type { RequestEvent } from '../routes/api/pdf/$types';

const gqlWSS = new WebSocketServer({ noServer: true });
const yjsWSS = new WebSocketServer({ noServer: true });

createWs(useServer as unknown as (options: unknown, ws: typeof gqlWSS) => void, {}, gqlWSS);

const setHeaders = (headers: string[], req: IncomingMessage) => {
	const cookies = (req as any).syntheticSvelteRequestEvent as string[] | undefined;
	if (cookies) {
		for (const cookie of cookies) headers.push(`Set-Cookie: ${cookie}`);
	}
};
gqlWSS.on('headers', setHeaders);
yjsWSS.on('headers', setHeaders);

export const SYNTHETIC_EVENT_FIELD = '__syntheticSvelteRequestEvent';

export function hasSyntheticSvelteRequestEvent(req: IncomingMessage | RequestEvent): boolean {
	return SYNTHETIC_EVENT_FIELD in req;
}

(globalThis as Record<string, unknown>).__wssUpgrade = async (
	req: IncomingMessage,
	socket: Socket,
	head: Buffer
) => {
	const url = new URL(req.url ?? '/', 'http://localhost');
	const isGql = url.pathname === '/api/graphql';
	const isYjs = url.pathname.startsWith('/api/docs');

	let syntheticSvelteRequestEvent = nativeToRequestEvent(req);
	let ctx: Context;

	try {
		await OIDC.handle({
			event: syntheticSvelteRequestEvent,
			resolve: (event) => {
				syntheticSvelteRequestEvent = event;
				return new Response();
			}
		});
		ctx = context(syntheticSvelteRequestEvent);
		ctx.mustBeLoggedIn();
	} catch (err) {
		console.error('[wss] failed to validate websocket connection', err);
		socket.destroy();
		return;
	}
	(req as any)[SYNTHETIC_EVENT_FIELD] = syntheticSvelteRequestEvent;

	startWSValidityChecker(ctx, socket);

	if (isGql) {
		gqlWSS.handleUpgrade(req, socket, head, (ws) => {
			gqlWSS.emit('connection', ws, req);
		});
	} else if (isYjs) {
		// The paper id travels in-band with every Hocuspocus message, so the URL
		// carries no room segment. If upgrade-time auth fails (native client
		// without a session cookie), the Hocuspocus onAuthenticate hook still
		// gets a chance to auth via the in-band Bearer token.
		yjsWSS.handleUpgrade(req, socket, head, (ws) => {
			openYjsRoom(ws, req, Promise.resolve(ctx));
		});
	}
};

const SESSION_LIVENESS_CHECK_INTERVAL_MS = 5 * 60_000;

function startWSValidityChecker(ctx: Context, socket: Socket) {
	const checkSessionLive = ctx.oidc?.checkSessionLive;
	const rawAccessToken = ctx.oidc?.raw?.accessToken;
	const interval = setInterval(async () => {
		try {
			if (checkSessionLive) {
				// Cookie-based session: introspect the refresh token (RFC 7662,
				// read-only) — never consumes/rotates it.
				const result = await checkSessionLive();
				if (!result.active) {
					clearInterval(interval);
					socket.destroy();
				}
				return;
			}

			if (rawAccessToken) {
				// Native/bearer client: no refresh token to check, so fall back to
				// validating the access token itself the same way the regular
				// flow does (local JWT verify, then introspection fallback for
				// opaque tokens) — introspecting an access token is always
				// read-only regardless of provider, unlike a refresh grant.
				const stillValid = await OIDC.validateToken(rawAccessToken);
				if (!stillValid) {
					clearInterval(interval);
					socket.destroy();
				}
				return;
			}

			// Neither a refresh token nor a raw access token is available to check
			clearInterval(interval);
			socket.destroy();
		} catch (err) {
			console.error('[wss] failed to check websocket session liveness', err);
		}
	}, SESSION_LIVENESS_CHECK_INTERVAL_MS);
	socket.once('close', () => clearInterval(interval));
}
