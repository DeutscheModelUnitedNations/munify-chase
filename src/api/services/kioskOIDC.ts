import { building } from '$app/environment';
import { configPrivate } from '$config/private';
import { configPublic } from '$config/public';
import type { Handle } from '@sveltejs/kit';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { normalizeOIDCClaims, upsertUserFromClaims } from './OIDC';

/**
 * Independently re-verifies every request's tokens against
 * OIDC_KIOSK_TRUSTED_AUDIENCES (the Pi display kiosk's own separate Logto
 * Application — see pi-display/README.md — which any staff member can sign
 * into via the Device Authorization Grant with their own credentials, no
 * shared "display" account). On success, `locals.isKioskSession` is set —
 * see authHelper.ts's `isDisplayKiosk()`, the sole consumer of that flag: it
 * forces every ability check for a device-flow session down the same
 * kiosk-scoped, read-only path the underlying person's real role would
 * otherwise unlock, so a Pi stolen from a venue (see the physical-access
 * note in pi-display/README.md) can never be used for more than a kiosk
 * could already do, no matter how privileged whoever provisioned it is.
 *
 * This MUST run unconditionally, never only as a fallback for when the
 * primary `OIDC.handle` fails to recognize a token — it doesn't reliably
 * fail. `OIDC.handle`'s own token validation (in @m1212e/sveltekit-oidc)
 * first tries local JWT verification against PUBLIC_OIDC_CLIENT_ID, but on
 * failure falls back to RFC 7662 token introspection against the OIDC
 * provider, which only confirms the token is *active* — it doesn't check
 * audience at all (reported upstream). A kiosk token is a genuinely valid,
 * active token (just issued to a different Application), so on providers
 * that support introspection (Logto does) `OIDC.handle` ends up accepting
 * it anyway and populating `locals.oidc` with the underlying person's real
 * identity and roles — silently bypassing kiosk detection entirely if this
 * only ran when `locals.oidc` was still unset. Kiosk detection is treated
 * as a security boundary CHASE owns, not something to leave resting on an
 * unstated, third-party-controlled invariant ("the primary handler always
 * fails for kiosk tokens") that a future dependency update could silently
 * break again: running unconditionally and treating a successful
 * kiosk-audience verification as authoritative regardless of what
 * `OIDC.handle` already decided means this holds even if that upstream
 * fallback's behavior changes. Only ever narrows access relative to a
 * normal session (can't grant anything a plain login wouldn't), so it stays
 * safe even where it turns out to be redundant.
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
	// Deliberately NOT gated on `event.locals.oidc` already being set — see
	// the doc comment above. This has to run regardless of what OIDC.handle
	// decided, and a successful kiosk-audience verification here overrides
	// whatever it set, since that's the more precise, freshly-verified claim
	// set for exactly this token.
	if (building || trustedAudiences.length === 0) {
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
		// Not a kiosk-audience token (or discovery/verification genuinely
		// failed) — leave whatever OIDC.handle already decided (if anything)
		// untouched and fall through.
	}

	return resolve(event);
};
