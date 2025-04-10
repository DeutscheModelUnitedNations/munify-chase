import { db, schema } from '$api/db/db';
import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';
import { makeOIDC } from '@m1212e/sveltekit-oidc';

export const OIDC = await makeOIDC({
	oidcAuthority: configPublic.PUBLIC_OIDC_AUTHORITY,
	oidcClientId: configPublic.PUBLIC_OIDC_CLIENT_ID,
	secret: configPrivate.OIDC_CLIENT_SECRET,
	authenticatedRoutes: ['/app'],
	async userLoggedInSuccessfully(user) {
		await db
			.insert(schema.user)
			.values({
				id: user.sub,
				locale: user.locale ?? configPublic.PUBLIC_DEFAULT_LOCALE,
				preferredUsername: user.preferred_username,
				email: user.email,
				familyName: user.family_name,
				givenName: user.given_name,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.onConflictDoUpdate({
				target: schema.user.id,
				set: {
					locale: user.locale ?? configPublic.PUBLIC_DEFAULT_LOCALE,
					preferredUsername: user.preferred_username,
					email: user.email,
					familyName: user.family_name,
					givenName: user.given_name,
					updatedAt: new Date()
				}
			});
	}
});
