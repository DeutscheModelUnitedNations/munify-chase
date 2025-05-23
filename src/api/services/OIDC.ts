import { db, schema } from '$api/db/db';
import { building, dev } from '$app/environment';
import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';
import { makeOIDC } from '@m1212e/sveltekit-oidc';

export const OIDC = !building
	? await makeOIDC({
			development: dev,
			oidcAuthority: configPublic.PUBLIC_OIDC_AUTHORITY,
			oidcClientId: configPublic.PUBLIC_OIDC_CLIENT_ID,
			oidcClientSecret: configPrivate.OIDC_CLIENT_SECRET,
			loginCallbackRoute: configPublic.PUBLIC_OIDC_LOGIN_CALLBACK_ROUTE,
			logoutCallbackRoute: configPublic.PUBLIC_OIDC_LOGOUT_CALLBACK_ROUTE,
			secret: configPrivate.SECRET,
			authenticatedRoutes: ['/app'],
			logoutPath: '',
			async userLoggedInSuccessfully({ user }) {
				await db
					.insert(schema.user)
					.values({
						id: user.sub,
						locale: user.locale ?? configPublic.PUBLIC_DEFAULT_LOCALE,
						preferredUsername: user.preferred_username!,
						email: user.email!,
						familyName: user.family_name!,
						givenName: user.given_name!
					})
					.onConflictDoUpdate({
						target: schema.user.id,
						set: {
							locale: user.locale ?? configPublic.PUBLIC_DEFAULT_LOCALE,
							preferredUsername: user.preferred_username!,
							email: user.email!,
							familyName: user.family_name!,
							givenName: user.given_name!
						}
					});
			}
		})
	: ({} as Awaited<ReturnType<typeof makeOIDC>>);
