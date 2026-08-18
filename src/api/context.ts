import { configPrivate } from '$config/private';
import type { RequestEvent } from '@sveltejs/kit';
import { GraphQLError } from 'graphql';
import {
	hasSyntheticSvelteRequestEvent,
	SYNTHETIC_EVENT_FIELD
} from './services/syntheticRequestEvent';
import { OIDC } from './services/OIDC';

// 'service_user' was the shared display-kiosk account's role; kiosk access
// is now determined by session type (isKioskSession), not a role — see
// kioskOIDC.ts and authHelper.ts's isDisplayKiosk().
export const oidcRoles = ['admin', 'member'] as const;

export function context(req: RequestEvent) {
	const source: unknown =
		(req as RequestEvent & { extra?: { request?: unknown } }).extra?.request ?? req;
	if (hasSyntheticSvelteRequestEvent(source as { extra?: unknown })) {
		req = (source as Record<string, unknown>)[SYNTHETIC_EVENT_FIELD] as RequestEvent;
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
		// True only when this request authenticated through the kiosk's device
		// flow (kioskOIDC.ts) — see isDisplayKiosk() in authHelper.ts.
		isKioskSession: req.locals.isKioskSession === true,
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
			if (!oidc) return false;

			if (oidc.checkSessionLive) {
				const result = await oidc.checkSessionLive();
				return result.active === true;
			}

			if (oidc.raw?.accessToken) {
				return Boolean(await OIDC.validateToken(oidc.raw.accessToken));
			}

			return false;
		}
	};
}

export type Context = ReturnType<typeof context>;
