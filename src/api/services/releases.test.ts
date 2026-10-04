import { describe, expect, it, vi } from 'vitest';

vi.mock('$config/private', () => ({ configPrivate: {} }));

const { createReleaseCache } = await import('./releases');

const MINUTE = 60_000;

const release = (tag: string, names: string[]) => ({
	tag_name: tag,
	assets: names.map((name) => ({ name, browser_download_url: `https://gh/${name}`, size: 1 }))
});

const json = (body: unknown, etag = '"a"') =>
	new Response(JSON.stringify(body), { status: 200, headers: { etag } });

function setup(...responses: (Response | Error)[]) {
	let time = 0;
	const fetch = vi.fn(() => {
		const next = responses.shift() ?? new Error('no more responses');
		return next instanceof Error ? Promise.reject(next) : Promise.resolve(next);
	});
	vi.spyOn(console, 'warn').mockImplementation(() => {});
	const get = createReleaseCache({ fetch: fetch as typeof globalThis.fetch, now: () => time });
	return { get, fetch, advance: (ms: number) => (time += ms) };
}

describe('createReleaseCache', () => {
	it('parses the release and caches it', async () => {
		const { get, fetch } = setup(json(release('v3.1.1', ['chase_3.1.1_x64-setup.exe'])));
		const latest = await get();
		expect(latest).toEqual({
			version: '3.1.1',
			assets: { windows: { url: 'https://gh/chase_3.1.1_x64-setup.exe', size: 1 } }
		});
		expect(await get()).toBe(latest);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it('shares one request between concurrent callers', async () => {
		const { get, fetch } = setup(json(release('v1.0.0', ['a.dmg'])));
		await Promise.all([get(), get(), get()]);
		expect(fetch).toHaveBeenCalledTimes(1);
	});

	it('revalidates with the ETag after the TTL', async () => {
		const { get, fetch, advance } = setup(
			json(release('v1.0.0', ['a.dmg'])),
			new Response(null, { status: 304 })
		);
		const first = await get();
		advance(16 * MINUTE);
		expect(await get()).toBe(first);
		expect(fetch).toHaveBeenLastCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: expect.objectContaining({ 'if-none-match': '"a"' })
			})
		);
	});

	it('checks again soon while a release has no installers yet', async () => {
		const { get, fetch, advance } = setup(
			json(release('v2.0.0', ['latest.json'])),
			json(release('v2.0.0', ['b.dmg']), '"b"')
		);
		expect((await get())?.assets).toEqual({});
		advance(3 * MINUTE);
		expect((await get())?.assets).toHaveProperty('macos');
		expect(fetch).toHaveBeenCalledTimes(2);
	});

	it('keeps the last release when GitHub fails and never rejects', async () => {
		const { get, advance } = setup(
			json(release('v1.0.0', ['a.dmg'])),
			new Response('rate limited', { status: 403 }),
			new Error('network down')
		);
		const first = await get();
		advance(16 * MINUTE);
		expect(await get()).toEqual(first);
		advance(3 * MINUTE);
		expect(await get()).toEqual(first);
	});

	it('resolves to null when nothing was ever loaded', async () => {
		const { get } = setup(new Error('network down'));
		expect(await get()).toBeNull();
	});
});
