import { client, type UserClaims } from '$lib/api/rumbleClient/client';
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
