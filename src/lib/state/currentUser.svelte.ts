import { client, type UserClaims } from '$lib/api/rumbleClient/client';
import { urqlClient } from '$lib/api/client';
import { isLocalConferenceActive, LOCAL_DEMO_GUEST_CLAIMS } from '$lib/state/localDemo.svelte';

let user = $state<UserClaims>();

export async function getCurrentUser() {
	// Checked unconditionally, ahead of the cache: `user` is a module-level singleton, so
	// caching either identity would leak across a same-tab transition between the offline
	// conference and a real one (no full page reload to reset this module's state).
	if (isLocalConferenceActive()) {
		return LOCAL_DEMO_GUEST_CLAIMS;
	}

	if (!user) {
		const result = await client.query.currentUserClaims({
			id: true,
			givenName: true,
			familyName: true,
			email: true,
			preferredUsername: true,
			locale: true
		});

		user = result;
	}
	return user;
}

/**
 * Whether the current user is a global admin. The offline demo's guest acts as one there
 * without asking. Real conferences always ask the server: the cache is shared with the demo
 * tab (IndexedDB and cross-tab sync), so a cached answer could be the demo's. When offline,
 * graphcache's offline exchange still falls back to the last cached answer.
 */
export async function getIsGlobalAdmin(): Promise<boolean> {
	if (isLocalConferenceActive()) return true;
	const result = await urqlClient
		.query('{ isGlobalAdmin }', {}, { requestPolicy: 'network-only' })
		.toPromise();
	return result.data?.isGlobalAdmin === true;
}
