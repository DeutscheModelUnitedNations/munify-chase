import { OIDC_ROLE_CLAIM } from '$app/env/private';
import type { RequestEvent } from '@sveltejs/kit';
import { GraphQLError } from 'graphql';
import {
	hasSyntheticSvelteRequestEvent,
	SYNTHETIC_EVENT_FIELD
} from './services/syntheticRequestEvent';
import { OidcProviderUnavailableError } from '@m1212e/oidc';
import { OIDC } from './services/OIDC';
import { findLinkCaller, type LinkCaller } from './services/link/linkCaller';
import { LINK_TOKEN_HEADER } from './services/link/linkTokens';

export const oidcRoles = ['admin', 'member', 'service_user'] as const;

export function context(req: RequestEvent) {
	const source: unknown =
		(req as RequestEvent & { extra?: { request?: unknown } }).extra?.request ?? req;
	if (hasSyntheticSvelteRequestEvent(source as { extra?: unknown })) {
		req = (source as Record<string, unknown>)[SYNTHETIC_EVENT_FIELD] as RequestEvent;
	}

	const OIDCRoleNames: (typeof oidcRoles)[number][] = [];
	if (OIDC_ROLE_CLAIM) {
		const rolesRaw =
			(req.locals.oidc?.accessTokenClaims as Record<string, unknown> | undefined)?.[
				OIDC_ROLE_CLAIM
			] ??
			(req.locals.oidc?.idTokenClaims as Record<string, unknown> | undefined)?.[OIDC_ROLE_CLAIM];
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

	// A synthetic WebSocket event carries the token as a header too (`websocket.ts`).
	const linkToken = req.request?.headers.get(LINK_TOKEN_HEADER);
	let linkCaller: Promise<LinkCaller | undefined> | undefined;

	return {
		...req.locals,
		/** The linked DELEGATOR instance, when it is the one calling (`docs/plans/delegator-link.md`). */
		linkCaller: () => (linkCaller ??= findLinkCaller(linkToken)),
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
		hasRole(role: string) {
			return OIDCRoleNames.includes(role as (typeof oidcRoles)[number]);
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
