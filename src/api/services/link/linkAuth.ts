import { createRemoteJWKSet, jwtVerify } from 'jose';
import { z } from 'zod';
import {
	LINK_REMOTE_RESOURCE,
	LINK_REMOTE_URL,
	LINK_RESOURCE,
	OIDC_M2M_CLIENT_ID,
	OIDC_M2M_CLIENT_SECRET,
	OIDC_ROLE_CLAIM
} from '$app/env/private';
import { knownRoles, LINK_ROLE, REMOTE_LINK_ROLE, rolesOfClaim } from '#api/services/oidcRoles';
import { PUBLIC_OIDC_AUTHORITY } from '$app/env/public';
import { logger } from '#lib/logger';

/**
 * How the linked instances know each other (`docs/plans/delegator-link.md`): through the OIDC provider
 * both already trust. Each asks it for an access token for the other's API resource with its
 * machine-to-machine client (`OIDC_M2M_CLIENT_ID`, the client credentials grant: Logto allows it
 * only for M2M apps, never for the app people sign in with) and sends that along. A request is the
 * other instance's when its token is for this instance's resource (`LINK_RESOURCE`) and grants the
 * link role (`delegator` here, `chase` in DELEGATOR) the way a person's token grants `admin`:
 * through the role claim (`OIDC_ROLE_CLAIM`), or as a scope, which is how Logto hands an M2M app
 * the permissions of its roles. Nothing about the link is stored or paired:
 * it is configuration only. A copy of DELEGATOR's `src/api/handlers/chaseLink/linkAuth.ts`; change
 * both together.
 */

/** The header the token travels in. Not `Authorization`: the session library takes bearer tokens. */
export const LINK_TOKEN_HEADER = 'x-munify-link-token';

/** Renewed this long before it expires, so no call goes out with a token about to lapse. */
const RENEW_BEFORE_MS = 60_000;
const REQUEST_TIMEOUT_MS = 10_000;

const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]']);

/** https, or http on this machine (development): the link's tokens never travel unencrypted. */
export function isSafeRemoteUrl(value: string) {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' || (url.protocol === 'http:' && LOOPBACK.has(url.hostname));
	} catch {
		return false;
	}
}

/** The link's configuration, or undefined while it is not (completely) set. */
export function linkConfig() {
	const values = {
		LINK_REMOTE_URL,
		LINK_REMOTE_RESOURCE,
		LINK_RESOURCE,
		OIDC_M2M_CLIENT_ID,
		OIDC_M2M_CLIENT_SECRET
	};
	const missing = Object.entries(values).flatMap(([name, value]) => (value ? [] : [name]));
	if (!LINK_REMOTE_URL && !LINK_REMOTE_RESOURCE) return undefined;
	if (missing.length > 0) {
		logger.warn('The link is only partly configured, so it is off', { missing });
		return undefined;
	}
	if (!isSafeRemoteUrl(LINK_REMOTE_URL ?? '')) {
		logger.warn('LINK_REMOTE_URL has to use https (http only on this machine), so the link is off');
		return undefined;
	}
	return {
		remoteUrl: new URL(LINK_REMOTE_URL ?? '').origin,
		remoteResource: LINK_REMOTE_RESOURCE ?? '',
		resource: LINK_RESOURCE ?? '',
		clientId: OIDC_M2M_CLIENT_ID ?? '',
		clientSecret: OIDC_M2M_CLIENT_SECRET ?? ''
	};
}

export type LinkConfig = NonNullable<ReturnType<typeof linkConfig>>;

const discoverySchema = z.object({
	issuer: z.string(),
	jwks_uri: z.string().url(),
	token_endpoint: z.string().url()
});

/** The provider's discovery document: `PUBLIC_OIDC_AUTHORITY` is the issuer or the document. */
function discoveryUrl(authority: string) {
	const url = new URL(authority);
	if (url.href.includes('/.well-known/')) return url;
	url.pathname = `${url.pathname.replace(/\/+$/, '')}/.well-known/openid-configuration`;
	return url;
}

type Provider = z.infer<typeof discoverySchema> & { keys: ReturnType<typeof createRemoteJWKSet> };

let provider: Promise<Provider> | undefined;

/** Fetched once, and again after a failure. */
function oidcProvider() {
	provider ??= (async () => {
		const response = await fetch(discoveryUrl(PUBLIC_OIDC_AUTHORITY), {
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
		});
		if (!response.ok) throw new Error(`OIDC discovery answered ${response.status}`);
		const discovery = discoverySchema.parse(await response.json());
		return { ...discovery, keys: createRemoteJWKSet(new URL(discovery.jwks_uri)) };
	})();
	provider.catch(() => {
		provider = undefined;
	});
	return provider;
}

const tokenResponseSchema = z.object({
	access_token: z.string(),
	expires_in: z.number().optional()
});

let outbound: Promise<{ token: string; renewAt: number }> | undefined;

/** An access token for the other instance's API, kept until shortly before it expires. */
export async function linkAccessToken(config: LinkConfig) {
	const current = await outbound?.catch(() => undefined);
	if (current && Date.now() < current.renewAt) return current.token;

	outbound = (async () => {
		const { token_endpoint } = await oidcProvider();
		const response = await fetch(token_endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${btoa(`${config.clientId}:${config.clientSecret}`)}`
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				resource: config.remoteResource,
				// the role the other instance knows this one by, as Logto grants an M2M app's permissions
				scope: REMOTE_LINK_ROLE
			}),
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
		});
		if (!response.ok) {
			throw new Error(
				`The link's token request failed: ${response.status} ${(await response.text()).slice(0, 500)}`
			);
		}
		const { access_token, expires_in = 300 } = tokenResponseSchema.parse(await response.json());
		return {
			token: access_token,
			renewAt: Date.now() + Math.max(expires_in * 1000 - RENEW_BEFORE_MS, 0)
		};
	})();
	return (await outbound).token;
}

/** The app roles a token grants: those its role claim names, and those it holds as scopes. */
export function rolesOfToken(payload: Record<string, unknown>) {
	const claimed = OIDC_ROLE_CLAIM ? rolesOfClaim(payload[OIDC_ROLE_CLAIM]) : [];
	const scopes = typeof payload.scope === 'string' ? knownRoles(payload.scope.split(' ')) : [];
	return [...new Set([...claimed, ...scopes])];
}

/**
 * Whether a token is a machine's own (the client credentials grant), not a person's: Logto then
 * names the client as the subject. A person's token for this API must never pass for the other
 * instance, whatever role or permission that person was given.
 */
export function isMachineToken(payload: Record<string, unknown>) {
	return typeof payload.client_id === 'string' && payload.sub === payload.client_id;
}

/**
 * Whether `token` is the other instance calling: signed by the provider, unexpired, for this
 * instance's API, and granting the link role. Never throws: a token that does not pass is nobody.
 */
export async function isRemoteInstanceToken({
	token,
	config
}: {
	token: string;
	config: LinkConfig;
}) {
	try {
		const { issuer, keys } = await oidcProvider();
		const { payload } = await jwtVerify(token, keys, { issuer, audience: config.resource });
		const machine = isMachineToken(payload);
		const roles = rolesOfToken(payload);
		if (machine && roles.includes(LINK_ROLE)) return true;
		// what was missing, never the token: so a link that does not connect says why
		logger.warn('A link token was refused', {
			reason: machine ? 'it grants no link role' : 'it is not a machine token',
			scope: typeof payload.scope === 'string' ? payload.scope : null,
			roles,
			hasClientId: typeof payload.client_id === 'string',
			subjectIsClient: payload.sub === payload.client_id
		});
		return false;
	} catch (error) {
		logger.warn('A link token was refused', {
			reason: String(error),
			expectedAudience: config.resource
		});
		return false;
	}
}
