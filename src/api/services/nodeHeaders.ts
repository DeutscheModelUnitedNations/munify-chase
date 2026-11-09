import type { IncomingMessage } from 'node:http';

type NodeHeaders = IncomingMessage['headers'];

/** A Node request header's (first) value; no header name, no value. */
function headerValue({
	headers,
	name
}: {
	headers: NodeHeaders;
	name: string | undefined;
}): string | undefined {
	if (!name) return undefined;
	const value = headers[name.toLowerCase()];
	return Array.isArray(value) ? value[0] : value;
}

/** A Node request's headers as WHATWG `Headers`, repeated ones joined. */
export function toHeaders(source: NodeHeaders): Headers {
	const headers = new Headers();
	for (const [key, value] of Object.entries(source)) {
		if (typeof value === 'string') {
			headers.set(key, value);
		} else if (Array.isArray(value)) {
			headers.set(key, value.join(', '));
		}
	}
	return headers;
}

/**
 * The origin a request reached us under: `ORIGIN` when set, else the headers adapter-node reads it
 * from behind a proxy (`PROTOCOL_HEADER`, `HOST_HEADER`, `PORT_HEADER`).
 */
export function requestOrigin({
	headers,
	origin,
	protocolHeader,
	hostHeader,
	portHeader
}: {
	headers: NodeHeaders;
	origin?: string;
	protocolHeader?: string;
	hostHeader?: string;
	portHeader?: string;
}): string {
	if (origin) return origin;
	const proto = headerValue({ headers, name: protocolHeader }) ?? 'https';
	const host =
		headerValue({ headers, name: hostHeader }) ??
		headerValue({ headers, name: 'host' }) ??
		'localhost';
	const port = headerValue({ headers, name: portHeader });
	return `${proto}://${host}${port ? `:${port}` : ''}`;
}
