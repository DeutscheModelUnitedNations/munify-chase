/**
 * Bearer token validation for the Tauri client.
 * Validates an access token against the OIDC provider's userinfo endpoint
 * and populates event.locals.oidc in the same shape as the cookie-session flow.
 */
import type { Handle } from '@sveltejs/kit';
import { configPublic } from '$config/public';
import { building } from '$app/environment';

let discoveryCache: Record<string, unknown> | null = null;

async function fetchDiscovery(): Promise<Record<string, unknown>> {
	if (discoveryCache) return discoveryCache;
	const url = `${configPublic.PUBLIC_OIDC_AUTHORITY.replace(/\/$/, '')}/.well-known/openid-configuration`;
	const res = await fetch(url);
	if (!res.ok) throw new Error('Failed to fetch OIDC discovery document');
	discoveryCache = (await res.json()) as Record<string, unknown>;
	return discoveryCache;
}

/**
 * SvelteKit handle that validates `Authorization: Bearer <token>` requests
 * and populates `event.locals.oidc` with the resolved user info.
 * Runs after the main OIDC cookie-session handle so cookie sessions take precedence.
 */
export const bearerAuthHandle: Handle = async ({ event, resolve }) => {
	if (building) return resolve(event);

	// Cookie session already resolved — skip
	if (event.locals.oidc?.user) return resolve(event);

	const authHeader = event.request.headers.get('authorization');
	if (!authHeader?.startsWith('Bearer ')) return resolve(event);

	const accessToken = authHeader.slice(7);

	try {
		const discovery = await fetchDiscovery();
		const userinfoEndpoint = discovery['userinfo_endpoint'] as string;
		if (!userinfoEndpoint) return resolve(event);

		const res = await fetch(userinfoEndpoint, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		if (!res.ok) return resolve(event);

		const userInfo = (await res.json()) as Record<string, unknown>;
		if (!userInfo['sub']) return resolve(event);

		event.locals.oidc = {
			user: userInfo as NonNullable<App.Locals['oidc']>['user'],
			accessToken: undefined,
			idToken: undefined
		};
	} catch {
		// Invalid token — continue unauthenticated
	}

	return resolve(event);
};
