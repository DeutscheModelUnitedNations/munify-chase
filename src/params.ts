import { defineParams } from '@sveltejs/kit/params';
// SvelteKit loads this file in Node during the build, where `#lib/*` only resolves with
// the extension (Node does not try the fallbacks in package.json).
import { isDownloadPlatform } from '#lib/helpers/downloads.ts';

export const params = defineParams({
	downloadPlatform: (param) => (isDownloadPlatform(param) ? param : undefined)
});
