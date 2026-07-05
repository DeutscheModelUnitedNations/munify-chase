/**
 * Shared WebSocket authentication helpers used by both the graphql-ws and
 * Hocuspocus (Yjs) upgrade paths.
 *
 * Both WebSocket servers need to:
 *   1. Build a synthetic SvelteKit RequestEvent from a raw Node IncomingMessage
 *   2. Run the OIDC handle hook to validate cookies / Bearer tokens
 *   3. Return a typed Context (or undefined on failure)
 *
 * For the graphql-ws path the Bearer token arrives in-band via connectionParams,
 * so the caller injects it before calling authenticateUpgradeRequest.
 * For the Hocuspocus path the token arrives via the Hocuspocus `auth` message;
 * contextFromBearerToken handles that case without needing a real IncomingMessage.
 */

import type { IncomingMessage } from 'node:http';
import type { RequestEvent } from '@sveltejs/kit';
import { OIDC } from './services/OIDC';
import { parse as parseCookies } from 'cookie';
import { context, type Context } from './context';

export type RequestWithLocals = IncomingMessage & { locals?: RequestEvent['locals'] };

export function buildSyntheticEvent(req: IncomingMessage): RequestEvent {
	// const host = req.headers.host ?? 'localhost';
	// const proto = req.headers['x-forwarded-proto'] ?? 'https';
	// TODO: align these with node adapter behavior
	const host = 'localhost';
	const proto = 'https';
	const url = new URL(req.url ?? '/', `${proto}://${host}`);
	const cookies = parseCookies(req.headers.cookie ?? '');
	const locals = {} as RequestEvent['locals'];

	const requestHeaders = new Headers();
	for (const [key, value] of Object.entries(req.headers)) {
		if (typeof value === 'string') {
			requestHeaders.set(key, value);
		} else if (Array.isArray(value)) {
			requestHeaders.set(key, value.join(', '));
		}
	}

	return {
		url,
		request: new Request(url.toString(), { headers: requestHeaders }),
		locals,
		cookies: {
			get: (name: string) => cookies[name],
			getAll: () => Object.entries(cookies).map(([name, value]) => ({ name, value, path: '/' })),
			set: () => {},
			delete: () => {},
			serialize: () => ''
		},
		params: {},
		route: { id: null },
		platform: undefined,
		fetch: globalThis.fetch,
		setHeaders: () => {},
		depends: () => {},
		untrack: <T>(fn: () => T) => fn(),
		isDataRequest: false,
		isSubRequest: false
	} as unknown as RequestEvent;
}

/**
 * Authenticate a WebSocket upgrade request. Runs the OIDC handle hook against
 * a synthetic RequestEvent built from the raw Node IncomingMessage and returns
 * the event (with `locals.oidc` populated) on success, or `undefined` on failure.
 *
 * Caches the result on `req.locals` so it is safe to call multiple times on the
 * same request without redundant OIDC round-trips (the graphql-ws path calls
 * this from `onConnect`, which fires once per connection).
 */
export async function authenticateUpgradeRequest(
	req: RequestWithLocals
): Promise<RequestEvent | undefined> {
	if ((req.locals as App.Locals)?.oidc) return req.locals as unknown as RequestEvent;

	const syntheticEvent = buildSyntheticEvent(req);
	try {
		await OIDC.handle({
			event: syntheticEvent,
			// eslint-disable-next-line require-await
			resolve: async () => new Response()
		});
	} catch {
		return undefined;
	}
	req.locals = syntheticEvent.locals;
	return syntheticEvent as RequestEvent;
}

/**
 * Build a Context from a raw Bearer token string.
 * Used in the Hocuspocus `onAuthenticate` hook when upgrade-time auth is not
 * available (native/Tauri clients that cannot send session cookies cross-origin).
 */
export async function contextFromBearerToken(token: string): Promise<Context | undefined> {
	const fakeReq: RequestWithLocals = {
		headers: { authorization: `Bearer ${token}` },
		url: '/'
	} as unknown as RequestWithLocals;
	const event = await authenticateUpgradeRequest(fakeReq);
	if (!(event?.locals as App.Locals | undefined)?.oidc?.user) return undefined;
	return context(event as unknown as RequestEvent);
}
