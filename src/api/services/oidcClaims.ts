/** What the identity provider says about a person, as the user row stores it. */
type NormalizedOIDCClaims = {
	sub: string;
	email?: string;
	locale?: string;
	preferred_username?: string;
	given_name?: string;
	family_name?: string;
};

function asString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

/**
 * Normalize OIDC claims from different providers into a consistent shape.
 * Logto uses `username` instead of `preferred_username` and `name` instead of `family_name`/`given_name`.
 */
function normalizeOIDCClaims(claims: Record<string, unknown>): NormalizedOIDCClaims {
	const sub = asString(claims.sub);
	if (!sub) {
		throw new Error('OIDC claim "sub" is missing or invalid');
	}
	const normalized: NormalizedOIDCClaims = {
		sub,
		email: asString(claims.email),
		locale: asString(claims.locale),
		preferred_username: asString(claims.preferred_username),
		given_name: asString(claims.given_name),
		family_name: asString(claims.family_name)
	};

	// Logto: username → preferred_username
	if (!normalized.preferred_username) {
		const username = asString(claims.username);
		if (username) normalized.preferred_username = username;
	}

	// Logto: name → family_name + given_name (split on last space)
	const name = asString(claims.name);
	if ((!normalized.family_name || !normalized.given_name) && name) {
		const parts = name.trim().split(/\s+/);
		if (parts.length >= 2) {
			normalized.given_name = parts.slice(0, -1).join(' ');
			normalized.family_name = parts[parts.length - 1];
		} else {
			normalized.given_name = name;
			normalized.family_name = name;
		}
	}

	return normalized;
}

/**
 * The user row a login writes (its id and the fields it refreshes), and the full name the person's conference users take over.
 * Throws when the provider sends no email, which every row needs.
 */
export function userRowOfClaims({
	claims,
	defaultLocale
}: {
	claims: Record<string, unknown>;
	defaultLocale: string;
}) {
	const normalized = normalizeOIDCClaims(claims);
	if (!normalized.email) {
		throw new Error('OIDC claim "email" is missing');
	}
	const fields = {
		locale: normalized.locale ?? defaultLocale,
		preferredUsername: normalized.preferred_username ?? normalized.email,
		email: normalized.email,
		familyName: normalized.family_name ?? '',
		givenName: normalized.given_name ?? ''
	};
	const fullName =
		[normalized.given_name, normalized.family_name].filter(Boolean).join(' ').trim() || null;
	return { id: normalized.sub, fields, fullName };
}
