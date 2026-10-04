import { getLatestRelease } from '$api/services/releases';
import { isDownloadPlatform, RELEASES_PAGE_URL } from '$lib/helpers/downloads';
import type { RequestHandler } from './$types';

// Stable link to the newest installer, e.g. /download/windows. The file itself
// is served by GitHub. Falls back to the release page while the installers of
// a fresh release are still building or GitHub cannot be reached.
export const GET: RequestHandler = async ({ params }) => {
	const release = await getLatestRelease();
	const asset = isDownloadPlatform(params.platform) ? release?.assets[params.platform] : undefined;
	return new Response(null, {
		status: 302,
		// The target changes with every release
		headers: { location: asset?.url ?? RELEASES_PAGE_URL, 'cache-control': 'no-store' }
	});
};
