import { configPrivate } from '$config/private';
import type { RequestEvent } from '@sveltejs/kit';
import { GraphQLError } from 'graphql';

export const oidcRoles = ['admin', 'member', 'service_user'] as const;

export async function context(req: RequestEvent) {
	// if the currently handled request is from a ws connection
	// the actual underlying request might be nested in the extra property of the request event
	if ((req as any)?.extra?.request) {
		req = (req as any).extra.request as RequestEvent;
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
		if (rolesRaw && typeof rolesRaw === 'object') {
			const roleNames = Object.keys(rolesRaw);
			const validRoles = roleNames.filter((r): r is (typeof oidcRoles)[number] =>
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

export type Context = Awaited<ReturnType<typeof context>>;
