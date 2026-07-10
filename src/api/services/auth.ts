import type { IncomingMessage } from 'node:http';
import type { RequestEvent } from '@sveltejs/kit';
import { parse as parseCookies, serialize as serializeCookie, type SerializeOptions } from 'cookie';
import { configPrivate } from '$config/private';

function headerValue(
	headers: IncomingMessage['headers'],
	name: string | undefined
): string | undefined {
	if (!name) return undefined;
	const value = headers[name.toLowerCase()];
	return Array.isArray(value) ? value[0] : value;
}

function getRequestOrigin(headers: IncomingMessage['headers']): string {
	if (configPrivate.ORIGIN) return configPrivate.ORIGIN;
	const proto = headerValue(headers, configPrivate.PROTOCOL_HEADER) ?? 'https';
	const host =
		headerValue(headers, configPrivate.HOST_HEADER) ?? headerValue(headers, 'host') ?? 'localhost';
	const port = headerValue(headers, configPrivate.PORT_HEADER);
	return `${proto}://${host}${port ? `:${port}` : ''}`;
}

export function nativeToRequestEvent(
	source: Pick<IncomingMessage, 'headers' | 'url'>,
	{ setHeaders }: { setHeaders?: (headers: Record<string, string>) => void } = {}
): RequestEvent {
	const url = new URL(source.url ?? '/', getRequestOrigin(source.headers));
	const jar = parseCookies(source.headers.cookie ?? '');

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
			set: (name: string, value: string, opts: SerializeOptions) => {
				jar[name] = value;
			},
			delete: (name: string, opts: SerializeOptions) => {
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
