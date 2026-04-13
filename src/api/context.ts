import { configPrivate } from '$config/private';
import type { RequestEvent } from '@sveltejs/kit';
import { GraphQLError } from 'graphql';

export const oidcRoles = ['admin', 'member', 'service_user'] as const;

export async function context(req: RequestEvent) {
	const OIDCRoleNames: (typeof oidcRoles)[number][] = [];
	if (configPrivate.OIDC_ROLE_CLAIM) {
		const rolesRaw =
			(req.locals.oidc?.accessToken ?? ({} as any))[configPrivate.OIDC_ROLE_CLAIM] ??
			(req.locals.oidc?.idToken ?? ({} as any))[configPrivate.OIDC_ROLE_CLAIM];
		if (rolesRaw) {
			// Support both Logto format (array of role objects/strings) and Zitadel format (object with role keys)
			if (Array.isArray(rolesRaw)) {
				for (const role of rolesRaw) {
					const name = typeof role === 'string' ? role : role?.name;
					if (name) OIDCRoleNames.push(name as any);
				}
			} else if (typeof rolesRaw === 'object') {
				OIDCRoleNames.push(...(Object.keys(rolesRaw) as any));
			}
		}
	}

	return {
		...req.locals,
		mustBeLoggedIn: () => {
			if (!req.locals.oidc?.user) {
				throw new GraphQLError('Must be logged in');
			}

			return req.locals.oidc.user;
		},
		hasRole(role: string) {
			return OIDCRoleNames.includes(role as any);
		}
	};
}

export type Context = Awaited<ReturnType<typeof context>>;
