import { client, type UserClaims } from '$lib/api/rumbleClient/client';
import { isLocalConferenceActive, LOCAL_DEMO_GUEST_CLAIMS } from '$lib/state/localDemo.svelte';

let user = $state<UserClaims>();

export async function getCurrentUser() {
	if (!user) {
		if (isLocalConferenceActive()) {
			user = LOCAL_DEMO_GUEST_CLAIMS;
			return user;
		}

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
