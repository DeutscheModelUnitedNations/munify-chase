import type { IncomingMessage } from 'node:http';
import type { RequestEvent } from '@sveltejs/kit';
import { parseCookie as parseCookies, type SerializeOptions } from 'cookie';
import { HOST_HEADER, ORIGIN, PORT_HEADER, PROTOCOL_HEADER } from '$app/env/private';
import { requestOrigin, toHeaders } from './nodeHeaders';
import { OIDC } from './OIDC';
import { context } from '#api/context';

function getRequestOrigin(headers: IncomingMessage['headers']): string {
	return requestOrigin({
		headers,
		origin: ORIGIN,
		protocolHeader: PROTOCOL_HEADER,
		hostHeader: HOST_HEADER,
		portHeader: PORT_HEADER
	});
}

export function nativeToRequestEvent(
	source: Pick<IncomingMessage, 'headers' | 'url'>,
	{ setHeaders }: { setHeaders?: (headers: Record<string, string>) => void } = {}
): RequestEvent {
	const url = new URL(source.url ?? '/', getRequestOrigin(source.headers));
	const jar = parseCookies(source.headers.cookie ?? '');

	return {
		url,
		request: new Request(url.toString(), { headers: toHeaders(source.headers) }),
		locals: {} as RequestEvent['locals'],
		cookies: {
			get: (name: string) => {
				const value = jar[name];
				return value;
			},
			getAll: () => {
				const all = Object.entries(jar)
					.filter((entry): entry is [string, string] => entry[1] !== undefined)
					.map(([name, value]) => ({ name, value, path: '/' }));
				return all;
			},
			set: (name: string, value: string, _opts: SerializeOptions) => {
				jar[name] = value;
			},
			delete: (name: string, _opts: SerializeOptions) => {
				delete jar[name];
			},
			serialize: () => ''
		},
		params: {},
		route: { id: null },
		platform: undefined,
		fetch: globalThis.fetch,
		setHeaders: (h: Record<string, string>) => setHeaders?.(h),
		depends: () => {},
		untrack: <T>(fn: () => T) => fn(),
		isDataRequest: false,
		isSubRequest: false
	} as unknown as RequestEvent;
}

/**
 * Runs the session handling SvelteKit requests get on a request that did not come through
 * SvelteKit (a WebSocket upgrade, a token sent in band), and answers its event and context.
 * Throws when it carries no valid session.
 */
export async function authenticatedEvent(source: Pick<IncomingMessage, 'headers' | 'url'>) {
	let event = nativeToRequestEvent(source);
	await OIDC.handle({
		event,
		resolve: (resolved) => {
			event = resolved;
			return Promise.resolve(new Response());
		}
	});
	const ctx = context(event);
	ctx.mustBeLoggedIn();
	return { event, ctx };
}
