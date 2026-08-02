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
	} catch {
		// Fallback verification failed — fall through and let the request
		// proceed unauthenticated, same as the primary OIDC.handle would.
	}

	return resolve(event);
};
