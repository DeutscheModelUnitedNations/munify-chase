import { configPrivate } from '$config/private';
import type { RequestEvent } from '@sveltejs/kit';
import { GraphQLError } from 'graphql';
import { hasSyntheticSvelteRequestEvent, SYNTHETIC_EVENT_FIELD } from './websocket';

export const oidcRoles = ['admin', 'member', 'service_user'] as const;

export function context(req: RequestEvent) {
	if (hasSyntheticSvelteRequestEvent(req as any)) {
		req = (req as any)[SYNTHETIC_EVENT_FIELD];
	}

	const OIDCRoleNames: (typeof oidcRoles)[number][] = [];
	if (configPrivate.OIDC_ROLE_CLAIM) {
		const rolesRaw =
			(req.locals.oidc?.accessToken as Record<string, unknown> | undefined)?.[
				configPrivate.OIDC_ROLE_CLAIM
			] ??
			(req.locals.oidc?.idToken as Record<string, unknown> | undefined)?.[
				configPrivate.OIDC_ROLE_CLAIM
			];
		if (rolesRaw) {
			// Support both Logto format (array of role objects/strings) and Zitadel format (object with role keys)
			const collected: string[] = [];
			if (Array.isArray(rolesRaw)) {
				for (const role of rolesRaw) {
					const name = typeof role === 'string' ? role : (role as { name?: string })?.name;
					if (name) collected.push(name);
				}
			} else if (typeof rolesRaw === 'object') {
				collected.push(...Object.keys(rolesRaw));
			}
			const validRoles = collected.filter((r): r is (typeof oidcRoles)[number] =>
				(oidcRoles as readonly string[]).includes(r)
			);
			OIDCRoleNames.push(...validRoles);
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
			return OIDCRoleNames.includes(role as (typeof oidcRoles)[number]);
		}
	};
}

export type Context = ReturnType<typeof context>;
