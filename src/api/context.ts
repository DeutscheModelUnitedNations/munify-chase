import { OIDC_ROLE_CLAIM } from '$app/env/private';
import type { RequestEvent } from '@sveltejs/kit';
import { GraphQLError } from 'graphql';
import {
	hasSyntheticSvelteRequestEvent,
	SYNTHETIC_EVENT_FIELD
} from './services/syntheticRequestEvent';
import { OidcProviderUnavailableError } from '@m1212e/oidc';
import { OIDC } from './services/OIDC';
import { LINK_TOKEN_HEADER } from './services/link/linkAuth';
import { LINK_ROLE, rolesOfClaim, type OidcRole } from './services/oidcRoles';

export { oidcRoles } from './services/oidcRoles';

export function context(req: RequestEvent) {
	const source: unknown =
		(req as RequestEvent & { extra?: { request?: unknown } }).extra?.request ?? req;
	if (hasSyntheticSvelteRequestEvent(source as { extra?: unknown })) {
		req = (source as Record<string, unknown>)[SYNTHETIC_EVENT_FIELD] as RequestEvent;
	}

	// the link role comes from the linked DELEGATOR's token (`linkHandle`, `websocket.ts`), never
	// from a session
	const OIDCRoleNames: OidcRole[] = [
		...(OIDC_ROLE_CLAIM
			? rolesOfClaim(
					(req.locals.oidc?.accessTokenClaims as Record<string, unknown> | undefined)?.[
						OIDC_ROLE_CLAIM
					] ??
						(req.locals.oidc?.idTokenClaims as Record<string, unknown> | undefined)?.[
							OIDC_ROLE_CLAIM
						]
				)
			: []
		).filter((role) => role !== LINK_ROLE),
		...(req.locals.linkCaller ? [LINK_ROLE] : [])
	];

	// A synthetic WebSocket event carries the token as a header too (`websocket.ts`).
	const linkToken = req.request?.headers.get(LINK_TOKEN_HEADER);

	return {
		...req.locals,
		/**
		 * Whether the request carries a link token. Such a request has no session, and the rules that
		 * need one grant it nothing instead of failing the whole query (`sessionUserId`).
		 */
		linkRequest: !!linkToken,
		mustBeLoggedIn: () => {
			if (!req.locals.oidc?.user) {
				throw new GraphQLError('Must be logged in');
			}

			return req.locals.oidc.user;
		},
		hasRole(role: OidcRole) {
			return OIDCRoleNames.includes(role);
		},
		isSessionLive: async (): Promise<boolean> => {
			const oidc = req.locals.oidc;
			const accessToken = oidc?.tokens.accessToken;
			if (!oidc || !accessToken) return false;

			try {
				await OIDC.core.processTokens({ access_token: accessToken, subject: oidc.user.sub });
				return true;
			} catch (error) {
				// An unreachable provider says nothing about the session, callers fail open on throws
				if (error instanceof OidcProviderUnavailableError) throw error;
				return false;
			}
		}
	};
}

export type Context = ReturnType<typeof context>;
