import { db, schema } from '#api/db/db';
import { eq } from 'drizzle-orm';
import { building, dev } from '$app/env';
import { OIDC_CLIENT_SECRET, OIDC_SCOPES } from '$app/env/private';
import {
	PUBLIC_DEFAULT_LOCALE,
	PUBLIC_OIDC_AUTHORITY,
	PUBLIC_OIDC_CLIENT_ID,
	PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE,
	PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE
} from '$app/env/public';
import { makeOIDC } from '@m1212e/sveltekit-oidc';
import { userRowOfClaims } from './oidcClaims';

export const OIDC = !building
	? await makeOIDC({
			development: dev,
			issuer: PUBLIC_OIDC_AUTHORITY,
			clientId: PUBLIC_OIDC_CLIENT_ID,
			clientSecret: OIDC_CLIENT_SECRET,
			scope: OIDC_SCOPES,
			loginCallbackRoute: PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE,
			logoutCallbackRoute: PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE,
			authenticatedRoutes: ['/app'],
			logoutPath: '',
			allowBearerToken: true,
			async userLoggedInSuccessfully({ user, accessTokenClaims, idTokenClaims }) {
				// `user` only carries the standard claims, Logto's `username` lives in the raw ones
				const { id, fields, fullName } = userRowOfClaims({
					claims: { ...accessTokenClaims, ...idTokenClaims, ...user },
					defaultLocale: PUBLIC_DEFAULT_LOCALE
				});
				await db
					.insert(schema.user)
					.values({ id, ...fields })
					.onConflictDoUpdate({ target: schema.user.id, set: fields });

				// Sync full name to cpnf user too
				if (fullName) {
					await db
						.update(schema.conferenceUser)
						.set({ name: fullName })
						.where(eq(schema.conferenceUser.userEmail, fields.email));
				}
			}
		})
	: ({} as Awaited<ReturnType<typeof makeOIDC>>);
