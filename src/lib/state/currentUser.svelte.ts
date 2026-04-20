import { client, type UserClaims } from '$lib/api/rumbleClient/client';

let user = $state<UserClaims>();

export async function getCurrentUser() {
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
