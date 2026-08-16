import { building } from '$app/environment';
import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';
import type { Handle } from '@sveltejs/kit';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { normalizeOIDCClaims, upsertUserFromClaims } from './OIDC';

/**
 * Fallback token verification for identities @m1212e/sveltekit-oidc's primary
 * `OIDC.handle` doesn't recognize — namely the Pi display kiosk, which signs
 * in through its own separate Logto Application (see pi-display/README.md)
 * via the Device Authorization Grant. Its tokens carry cookie names/shapes
 * identical to a normal session (bridged in by /api/kiosk/session), but an
 * `aud` claim that will never match PUBLIC_OIDC_CLIENT_ID — the library
 * hardcodes a single trusted audience, so those tokens fail its verification
 * and it leaves `locals.oidc` unset for unprotected routes like /kiosk and
 * /api/graphql. This re-attempts verification against OIDC_KIOSK_TRUSTED_AUDIENCES
 * (the display app's client id, and/or a Logto default API resource
 * identifier).
 *
 * Any staff member can sign a Pi into this application with their own
 * credentials — there's no separate shared "display" account. What matters
 * for authorization is not *who* authenticated but *how*: successfully
 * verifying here (as opposed to through the primary OIDC.handle) is proof
 * the request went through the device flow, so `locals.isKioskSession` is
 * set unconditionally on success, regardless of whose identity it is. See
 * authHelper.ts's `isDisplayKiosk()`, the sole consumer of that flag — it
 * forces every ability check for a device-flow session down the same
 * kiosk-scoped, read-only path a real staff member's normal role would
 * otherwise unlock, so a Pi stolen from a venue (see the physical-access
 * note in pi-display/README.md) can never be used for more than a kiosk
 * could already do, no matter how privileged the person who provisioned it.
 * This only ever narrows access relative to a normal session — it can't
 * grant anything a plain login wouldn't — so it stays safe even if a
 * deployment's Logto tenant is misconfigured to also allow this application
 * to authenticate through some other, non-device flow.
 *
 * Cookie names ('auth_oidc_*') mirror @m1212e/sveltekit-oidc's default
 * prefix — see the same duplication note in api/kiosk/session/+server.ts.
 * They aren't part of that package's public exports, so we can't import them.
 */
const COOKIE_PREFIX = 'auth_oidc_';

const trustedAudiences = configPrivate.OIDC_KIOSK_TRUSTED_AUDIENCES.split(',')
	.map((a) => a.trim())
	.filter(Boolean);

let jwksAndIssuer: Promise<{
	jwks: ReturnType<typeof createRemoteJWKSet>;
	issuer: string;
}> | null = null;

function getJwksAndIssuer() {
	if (!jwksAndIssuer) {
		jwksAndIssuer = (async () => {
			const res = await fetch(configPublic.PUBLIC_OIDC_AUTHORITY, {
				signal: AbortSignal.timeout(5000)
			});
			const meta = (await res.json()) as { jwks_uri: string; issuer: string };
			return {
				jwks: createRemoteJWKSet(new URL(meta.jwks_uri)),
				issuer: meta.issuer
			};
		})().catch((e) => {
			// Don't let a single slow/unreachable discovery call permanently wedge
			// every future request behind a cached rejected promise — let the next
			// request try again.
			jwksAndIssuer = null;
			throw e;
		});
	}
	return jwksAndIssuer;
}

async function verify(
	token: string,
	issuer: string,
	jwks: ReturnType<typeof createRemoteJWKSet>
): Promise<JWTPayload | undefined> {
	try {
		const { payload } = await jwtVerify(token, jwks, { issuer, audience: trustedAudiences });
		return payload;
	} catch {
		return undefined;
	}
}

export const kioskOIDCHandle: Handle = async ({ event, resolve }) => {
	if (building || event.locals.oidc || trustedAudiences.length === 0) {
		return resolve(event);
	}

	const accessToken = event.cookies.get(`${COOKIE_PREFIX}access_token`);
	const idToken = event.cookies.get(`${COOKIE_PREFIX}id_token`);
	if (!accessToken) {
		return resolve(event);
	}

	try {
		const { jwks, issuer } = await getJwksAndIssuer();
		const [accessPayload, idPayload] = await Promise.all([
			verify(accessToken, issuer, jwks),
			idToken ? verify(idToken, issuer, jwks) : Promise.resolve(undefined)
		]);

		if (accessPayload || idPayload) {
			const normalized = normalizeOIDCClaims({ ...accessPayload, ...idPayload });
			event.locals.oidc = {
				user: normalized,
				accessToken: accessPayload,
				idToken: idPayload,
				// The kiosk bridge (/api/kiosk/session) never sets a refresh-token
				// cookie — the Pi helper stays the sole owner of it — so there's
				// nothing to surface here.
				refreshToken: undefined,
				raw: { accessToken, idToken }
			};
			event.locals.isKioskSession = true;

			// Mirrors the primary login path's userLoggedInSuccessfully — a
			// device-flow identity needs the same `user` row (conferenceUser/
			// ability lookups key off it) even if this staff member has never
			// opened the normal browser app before. Best-effort: a transient
			// DB hiccup here shouldn't take down kiosk auth, it would just mean
			// this identity's own conference memberships aren't resolvable
			// until the next successful refresh.
			try {
				await upsertUserFromClaims(normalized);
			} catch (e) {
				console.error('kioskOIDC: failed to upsert user for device-flow identity', e);
			}
		}
	} catch {
		// Fallback verification failed — fall through and let the request
		// proceed unauthenticated, same as the primary OIDC.handle would.
	}

	return resolve(event);
};
