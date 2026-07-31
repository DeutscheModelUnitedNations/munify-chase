import { db, schema } from '$api/db/db';
import { eq } from 'drizzle-orm';
import { building, dev } from '$app/environment';
import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';
import { makeOIDC } from '@m1212e/sveltekit-oidc';

export type NormalizedOIDCClaims = {
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
export function normalizeOIDCClaims(claims: Record<string, unknown>): NormalizedOIDCClaims {
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

export const OIDC = !building
	? await makeOIDC({
			development: dev,
			oidcAuthority: configPublic.PUBLIC_OIDC_AUTHORITY,
			oidcClientId: configPublic.PUBLIC_OIDC_CLIENT_ID,
			oidcClientSecret: configPrivate.OIDC_CLIENT_SECRET,
			oidcScope: configPrivate.OIDC_SCOPES,
			loginCallbackRoute: configPublic.PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE,
			logoutCallbackRoute: configPublic.PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE,
			authenticatedRoutes: ['/app'],
			logoutPath: '',
			allowBearerToken: true,
			async userLoggedInSuccessfully({ user }) {
				const normalized = normalizeOIDCClaims(user);
				if (!normalized.email) {
					throw new Error('OIDC claim "email" is missing');
				}
				const preferredUsername = normalized.preferred_username ?? normalized.email;
				await db
					.insert(schema.user)
					.values({
						id: normalized.sub,
						locale: normalized.locale ?? configPublic.PUBLIC_DEFAULT_LOCALE,
						preferredUsername,
						email: normalized.email,
						familyName: normalized.family_name ?? '',
						givenName: normalized.given_name ?? ''
					})
					.onConflictDoUpdate({
						target: schema.user.id,
						set: {
							locale: normalized.locale ?? configPublic.PUBLIC_DEFAULT_LOCALE,
							preferredUsername,
							email: normalized.email,
							familyName: normalized.family_name ?? '',
							givenName: normalized.given_name ?? ''
						}
					});

				// Sync full name to cpnf user too
				const fullName =
					[normalized.given_name, normalized.family_name].filter(Boolean).join(' ').trim() || null;
				if (fullName) {
					await db
						.update(schema.conferenceUser)
						.set({ name: fullName })
						.where(eq(schema.conferenceUser.userEmail, normalized.email));
				}
			}
		})
	: ({} as Awaited<ReturnType<typeof makeOIDC>>);
