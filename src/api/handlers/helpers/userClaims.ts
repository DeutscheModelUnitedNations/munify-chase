/** The signed-in person's identity claims, with missing ones as null. */
export function userClaims(user: {
	sub: string;
	given_name?: string | null;
	family_name?: string | null;
	email?: string | null;
	preferred_username?: string | null;
	locale?: string | null;
}) {
	return {
		id: user.sub,
		givenName: user.given_name ?? null,
		familyName: user.family_name ?? null,
		email: user.email ?? null,
		preferredUsername: user.preferred_username ?? null,
		locale: user.locale ?? null
	};
}
