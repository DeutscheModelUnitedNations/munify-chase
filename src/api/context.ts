import { configPrivate } from '$config/private';
import type { RequestEvent } from '@sveltejs/kit';
import { GraphQLError } from 'graphql';

export const oidcRoles = ['admin', 'member', 'service_user'] as const;

// Contexts resolved during a WebSocket upgrade, keyed by the raw Node request
// that graphql-ws hands back in `extra` on every operation.
const wsContexts = new WeakMap<object, Context>();

export function rememberWsContext(request: object, ctx: Context) {
	wsContexts.set(request, ctx);
}

export function contextFromLocals(locals: RequestEvent['locals']) {
	const OIDCRoleNames: (typeof oidcRoles)[number][] = [];
	if (configPrivate.OIDC_ROLE_CLAIM) {
		const rolesRaw =
			(locals.oidc?.accessToken as Record<string, unknown> | undefined)?.[
				configPrivate.OIDC_ROLE_CLAIM
			] ??
			(locals.oidc?.idToken as Record<string, unknown> | undefined)?.[
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
		...locals,
		mustBeLoggedIn: () => {
			if (!locals.oidc?.user) {
				throw new GraphQLError('Must be logged in');
			}

			return locals.oidc.user;
		},
		hasRole(role: string) {
			return OIDCRoleNames.includes(role as (typeof oidcRoles)[number]);
		}
	};
}

export function context(req: RequestEvent) {
	// requests from a ws connection carry the raw upgrade request in `extra`
	const wsRequest = (req as RequestEvent & { extra?: { request?: object } }).extra?.request;
	if (wsRequest) {
		return wsContexts.get(wsRequest) ?? contextFromLocals({} as RequestEvent['locals']);
	}
	return contextFromLocals(req.locals);
}

export type Context = ReturnType<typeof contextFromLocals>;
