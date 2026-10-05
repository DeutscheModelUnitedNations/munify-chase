import { getRequestEvent, query } from '$app/server';
import { detectPlatform } from '$lib/helpers/downloads';
import { peekLatestRelease } from './services/releases';

// Data for the landing page downloads section. Lives in src/api so the
// native-client fork drops it together with the rest of the server. Never waits
// for GitHub, the version shows up once the release cache is warm.
export const getDownloads = query(() => {
	const { request } = getRequestEvent();
	return {
		platform: detectPlatform(request.headers.get('user-agent')),
		version: peekLatestRelease()?.version ?? null
	};
});
