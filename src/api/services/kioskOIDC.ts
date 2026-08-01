import { building } from '$app/environment';
import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';
import type { Handle } from '@sveltejs/kit';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { normalizeOIDCClaims } from './OIDC';

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
 * identifier) so ctx.hasRole() has something to read.
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
	label: string,
	token: string,
	issuer: string,
	jwks: ReturnType<typeof createRemoteJWKSet>
): Promise<JWTPayload | undefined> {
	try {
		const { payload } = await jwtVerify(token, jwks, { issuer, audience: trustedAudiences });
		// TEMPORARY DEBUG — remove once the kiosk role-claim issue is resolved.
		console.log(`[kioskOIDC] ${label} verified ok, aud=${JSON.stringify(payload.aud)}`);
		return payload;
	} catch (e) {
		// TEMPORARY DEBUG — remove once the kiosk role-claim issue is resolved.
		console.log(`[kioskOIDC] ${label} verify failed:`, e instanceof Error ? e.message : e);
		return undefined;
	}
}

export const kioskOIDCHandle: Handle = async ({ event, resolve }) => {
	// TEMPORARY DEBUG — remove once the kiosk role-claim issue is resolved.
	if (!building) {
		const claim = configPrivate.OIDC_ROLE_CLAIM ?? '';
		const existingAccessToken = event.locals.oidc?.accessToken as
			Record<string, unknown> | undefined;
		const existingIdToken = event.locals.oidc?.idToken as Record<string, unknown> | undefined;
		console.log(
			`[kioskOIDC] ${event.url.pathname}: building=${building} hasLocalsOidc=${!!event.locals.oidc}` +
				(event.locals.oidc
					? ` existingUser=${JSON.stringify(event.locals.oidc.user)}` +
						` existingAccessTokenAud=${JSON.stringify(existingAccessToken?.aud)}` +
						` existingIdTokenAud=${JSON.stringify(existingIdToken?.aud)}` +
						` existingRolesClaim=${JSON.stringify(existingAccessToken?.[claim] ?? existingIdToken?.[claim])}`
					: '') +
				` trustedAudiences=${JSON.stringify(trustedAudiences)}` +
				` refreshTokenCookie=${!!event.cookies.get('auth_oidc_refresh_token')}`
		);
	}

	if (building || event.locals.oidc || trustedAudiences.length === 0) {
		return resolve(event);
	}

	const accessToken = event.cookies.get(`${COOKIE_PREFIX}access_token`);
	const idToken = event.cookies.get(`${COOKIE_PREFIX}id_token`);
	// TEMPORARY DEBUG — remove once the kiosk role-claim issue is resolved.
	console.log(
		`[kioskOIDC] ${event.url.pathname}: accessToken cookie=${!!accessToken} idToken cookie=${!!idToken} trustedAudiences=${JSON.stringify(trustedAudiences)}`
	);
	if (!accessToken) {
		return resolve(event);
	}

	try {
		const { jwks, issuer } = await getJwksAndIssuer();
		const [accessPayload, idPayload] = await Promise.all([
			verify('accessToken', accessToken, issuer, jwks),
			idToken ? verify('idToken', idToken, issuer, jwks) : Promise.resolve(undefined)
		]);

		if (accessPayload || idPayload) {
			event.locals.oidc = {
				user: normalizeOIDCClaims({ ...accessPayload, ...idPayload }),
				accessToken: accessPayload,
				idToken: idPayload,
				// The kiosk bridge (/api/kiosk/session) never sets a refresh-token
				// cookie — the Pi helper stays the sole owner of it — so there's
				// nothing to surface here.
				refreshToken: undefined,
				raw: { accessToken, idToken }
			};
		}
		// TEMPORARY DEBUG — remove once the kiosk role-claim issue is resolved.
		console.log(
			`[kioskOIDC] resolved roles claim (${configPrivate.OIDC_ROLE_CLAIM}):`,
			JSON.stringify(
				(accessPayload?.[configPrivate.OIDC_ROLE_CLAIM ?? ''] ??
					idPayload?.[configPrivate.OIDC_ROLE_CLAIM ?? '']) as unknown
			)
		);
	} catch (e) {
		// TEMPORARY DEBUG — remove once the kiosk role-claim issue is resolved.
		console.log('[kioskOIDC] unexpected error:', e instanceof Error ? e.message : e);
	}

	return resolve(event);
};
