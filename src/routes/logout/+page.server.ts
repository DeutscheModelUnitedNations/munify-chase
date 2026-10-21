import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { OIDC } from '#api/services/OIDC';
import { PUBLIC_OIDC_AUTHORITY } from '$app/env/public';
import { CLEAR_OFFLINE_CACHE_COOKIE } from '#lib/helpers/clearOfflineCacheMarker';

export const load: PageServerLoad = async ({ url, cookies }) => {
	// Picked up by the client on its next start, see clearOfflineCacheMarker.ts
	cookies.set(CLEAR_OFFLINE_CACHE_COOKIE, '1', {
		path: '/',
		httpOnly: false,
		sameSite: 'lax'
	});
	// The provider's end-session endpoint lives on its own origin
	redirect(308, await OIDC.getLogoutUrl(url), {
		external: [new URL(PUBLIC_OIDC_AUTHORITY).origin]
	});
};
