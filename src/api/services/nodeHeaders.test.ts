import { describe, expect, test } from 'vitest';
import { requestOrigin, toHeaders } from './nodeHeaders';

describe('toHeaders', () => {
	test('copies single headers and joins repeated ones', () => {
		const headers = toHeaders({
			host: 'a.example',
			'set-cookie': ['a=1', 'b=2'],
			empty: undefined
		});
		expect(headers.get('host')).toBe('a.example');
		expect(headers.get('set-cookie')).toBe('a=1, b=2');
		expect(headers.has('empty')).toBe(false);
	});
});

describe('requestOrigin', () => {
	test('prefers the configured origin', () => {
		expect(requestOrigin({ headers: { host: 'a.example' }, origin: 'https://b.example' })).toBe(
			'https://b.example'
		);
	});

	test('reads the proxy headers, the first of repeated ones', () => {
		expect(
			requestOrigin({
				headers: {
					'x-forwarded-proto': 'http',
					'x-forwarded-host': ['c.example', 'd'],
					'x-port': '8080'
				},
				protocolHeader: 'X-Forwarded-Proto',
				hostHeader: 'X-Forwarded-Host',
				portHeader: 'X-Port'
			})
		).toBe('http://c.example:8080');
	});

	test('falls back to the host header, https and no port', () => {
		expect(requestOrigin({ headers: { host: 'a.example' }, hostHeader: 'x-forwarded-host' })).toBe(
			'https://a.example'
		);
		expect(requestOrigin({ headers: {} })).toBe('https://localhost');
	});
});
