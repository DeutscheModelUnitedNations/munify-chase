import { configPrivate } from '$config/private';
import { type LatestRelease, pickInstallers, RELEASES_API_URL } from '$lib/helpers/downloads';

// GitHub allows 60 unauthenticated API requests per hour and IP, so the latest
// release is cached in memory and revalidated with its ETag (a 304 does not
// count against the limit).
const TTL_MS = 15 * 60_000;
// Installers are attached a few minutes after a release is published, check
// again sooner while they are missing or GitHub was unreachable.
const RETRY_MS = 2 * 60_000;
const TIMEOUT_MS = 5_000;

interface GitHubRelease {
	tag_name: string;
	assets: { name: string; browser_download_url: string; size: number }[];
}

interface CacheEntry {
	release: LatestRelease | null;
	etag?: string;
	expiresAt: number;
}

export function createReleaseCache({
	fetch = globalThis.fetch,
	now = Date.now,
	token
}: {
	fetch?: typeof globalThis.fetch;
	now?: () => number;
	token?: string;
} = {}) {
	let entry: CacheEntry | undefined;
	let pending: Promise<LatestRelease | null> | undefined;

	async function request(): Promise<CacheEntry> {
		const res = await fetch(RELEASES_API_URL, {
			headers: requestHeaders(token, entry?.etag),
			signal: AbortSignal.timeout(TIMEOUT_MS)
		});
		if (res.status === 304 && entry) return { ...entry, expiresAt: now() + ttlFor(entry.release) };
		if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

		const release = toLatestRelease((await res.json()) as GitHubRelease);
		const etag = res.headers.get('etag') ?? undefined;
		return { release, etag, expiresAt: now() + ttlFor(release) };
	}

	async function refresh(): Promise<LatestRelease | null> {
		try {
			entry = await request();
		} catch (e) {
			console.warn('Could not fetch the latest release from GitHub:', e);
			// Keep serving the last known release, it is still downloadable
			entry = { release: entry?.release ?? null, etag: entry?.etag, expiresAt: now() + RETRY_MS };
		}
		return entry.release;
	}

	/** Never rejects, resolves to null when no release could be loaded yet. */
	return function getLatestRelease(): Promise<LatestRelease | null> {
		if (entry && entry.expiresAt > now()) return Promise.resolve(entry.release);
		pending ??= refresh().finally(() => (pending = undefined));
		return pending;
	};
}

function requestHeaders(token?: string, etag?: string) {
	const headers: Record<string, string> = {
		accept: 'application/vnd.github+json',
		// Required by the GitHub API
		'user-agent': 'munify-chase',
		'x-github-api-version': '2022-11-28'
	};
	if (token) headers.authorization = `Bearer ${token}`;
	if (etag) headers['if-none-match'] = etag;
	return headers;
}

const toLatestRelease = (data: GitHubRelease): LatestRelease => ({
	version: data.tag_name.replace(/^v/, ''),
	assets: pickInstallers(data.assets)
});

const ttlFor = (release: LatestRelease | null) =>
	release && Object.keys(release.assets).length > 0 ? TTL_MS : RETRY_MS;

let instance: (() => Promise<LatestRelease | null>) | undefined;

export const getLatestRelease = () =>
	(instance ??= createReleaseCache({ token: configPrivate.GITHUB_TOKEN }))();
