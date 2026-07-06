import type { IncomingMessage } from 'node:http';
import type { RequestEvent } from '@sveltejs/kit';
import { parse as parseCookies } from 'cookie';
import { configPrivate } from '$config/private';
import { OIDC } from './OIDC';
import { contextFromLocals, type Context } from '$api/context';

type AuthSource = Pick<IncomingMessage, 'headers' | 'url'>;

// Minimal stand-in RequestEvent so the OIDC handle hook can run outside the
// SvelteKit request pipeline (WebSocket upgrades, in-band tokens).
function headerValue(headers: AuthSource['headers'], name: string | undefined): string | undefined {
	if (!name) return undefined;
	const value = headers[name.toLowerCase()];
	return Array.isArray(value) ? value[0] : value;
}

// Mirrors the node adapter's origin resolution: forwarded headers are only
// trusted when ORIGIN / PROTOCOL_HEADER / HOST_HEADER / PORT_HEADER are set.
function requestOrigin(source: AuthSource): string {
	if (configPrivate.ORIGIN) return configPrivate.ORIGIN;
	const proto = headerValue(source.headers, configPrivate.PROTOCOL_HEADER) ?? 'https';
	const host =
		headerValue(source.headers, configPrivate.HOST_HEADER) ??
		headerValue(source.headers, 'host') ??
		'localhost';
	const port = headerValue(source.headers, configPrivate.PORT_HEADER);
	return `${proto}://${host}${port ? `:${port}` : ''}`;
}

function buildSyntheticEvent(source: AuthSource): RequestEvent {
	const url = new URL(source.url ?? '/', requestOrigin(source));
	const cookies = parseCookies(source.headers.cookie ?? '');

	const headers = new Headers();
	for (const [key, value] of Object.entries(source.headers)) {
		if (typeof value === 'string') {
			headers.set(key, value);
		} else if (Array.isArray(value)) {
			headers.set(key, value.join(', '));
		}
	}

	return {
		url,
		request: new Request(url.toString(), { headers }),
		locals: {} as RequestEvent['locals'],
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

// Returns a Context only when the OIDC hook resolved an actual user —
// a merely "not rejected" request does not count as authenticated.
async function authenticate(source: AuthSource): Promise<Context | undefined> {
	const event = buildSyntheticEvent(source);
	try {
		await OIDC.handle({
			event,
			// eslint-disable-next-line require-await
			resolve: async () => new Response()
		});
	} catch {
		return undefined;
	}
	if (!event.locals.oidc?.user) return undefined;
	return contextFromLocals(event.locals);
}

// Cookie or Authorization-header auth on a WebSocket upgrade request.
export function authenticateWsUpgrade(req: IncomingMessage): Promise<Context | undefined> {
	return authenticate(req);
}

// Auth from a token sent in-band (graphql-ws connectionParams or the
// Hocuspocus auth message). Accepts values with or without a "Bearer " prefix.
export function authenticateToken(token: string): Promise<Context | undefined> {
	const value = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
	return authenticate({ headers: { authorization: value }, url: '/' });
}
