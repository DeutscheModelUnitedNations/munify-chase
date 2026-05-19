/**
 * Platform-aware OIDC authentication.
 *
 * Web: delegates to the SvelteKit server's OIDC handle hook (cookie-session).
 * Tauri: PKCE authorization code flow via the system browser + deep-link callback.
 */

import { isTauri } from './index';

const STORAGE_KEY = 'chase_oidc_tokens';

type TokenSet = {
	access_token: string;
	refresh_token?: string;
	expires_at: number;
};

// In-memory token cache (populated from storage on init)
let tokenSet: TokenSet | null = null;

function loadFromStorage(): TokenSet | null {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		return JSON.parse(raw) as TokenSet;
	} catch {
		return null;
	}
}

function saveToStorage(tokens: TokenSet) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function clearTokens() {
	tokenSet = null;
	localStorage.removeItem(STORAGE_KEY);
}

/** Returns a valid (non-expired) access token if one is cached, else null. */
export function getCachedAccessToken(): string | null {
	if (!isTauri()) return null;
	if (!tokenSet) tokenSet = loadFromStorage();
	if (!tokenSet) return null;
	// Give a 60-second buffer before expiry
	if (Date.now() / 1000 >= tokenSet.expires_at - 60) {
		return null;
	}
	return tokenSet.access_token;
}

/** Store a fresh token set (called after a successful code exchange). */
export function storeTokens(tokens: {
	access_token: string;
	refresh_token?: string;
	expires_in: number;
}) {
	tokenSet = {
		access_token: tokens.access_token,
		refresh_token: tokens.refresh_token,
		expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in
	};
	saveToStorage(tokenSet);
}

// ── PKCE utilities ──────────────────────────────────────────────────────────

async function generateCodeVerifier(): Promise<string> {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
	const encoded = new TextEncoder().encode(verifier);
	const digest = await crypto.subtle.digest('SHA-256', encoded);
	return btoa(String.fromCharCode(...new Uint8Array(digest)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

// ── Endpoint derivation ──────────────────────────────────────────────────────

/**
 * Derives OIDC endpoints from the discovery URL without fetching it.
 * Avoids cross-origin fetch from the Tauri WebView (WebKitGTK enforces CORS
 * and the OIDC server may not allow the tauri:// origin).
 *
 * Assumes standard path layout: the discovery URL ends with
 * /.well-known/openid-configuration and the auth/token endpoints are
 * siblings at /auth and /token respectively (Logto, Keycloak, Auth0, etc.).
 */
function deriveOidcEndpoints(discoveryUrl: string) {
	const base = discoveryUrl.replace(/\/\.well-known\/openid-configuration$/, '');
	return {
		authorizationEndpoint: `${base}/auth`,
		tokenEndpoint: `${base}/token`
	};
}

// ── Authorization flow ───────────────────────────────────────────────────────

const PENDING_PKCE_KEY = 'chase_pkce_pending';

type PendingPKCE = {
	codeVerifier: string;
	state: string;
	authorityUrl: string;
	clientId: string;
};

/**
 * Starts the Tauri OIDC flow:
 * 1. Generate PKCE code verifier + challenge
 * 2. Build the authorization URL
 * 3. Open it in the system browser
 * 4. Save the pending PKCE state so the deep-link handler can complete the exchange
 */
export async function startTauriOidcFlow(authorityUrl: string, clientId: string): Promise<void> {
	const { openUrl } = await import('@tauri-apps/plugin-opener');

	const codeVerifier = await generateCodeVerifier();
	const codeChallenge = await generateCodeChallenge(codeVerifier);
	const state = crypto.randomUUID();

	const { authorizationEndpoint } = deriveOidcEndpoints(authorityUrl);

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: clientId,
		redirect_uri: 'munify-chase://oidc-callback',
		scope: 'openid email profile offline_access',
		state,
		code_challenge: codeChallenge,
		code_challenge_method: 'S256'
	});

	const pending: PendingPKCE = { codeVerifier, state, authorityUrl, clientId };
	sessionStorage.setItem(PENDING_PKCE_KEY, JSON.stringify(pending));

	await openUrl(`${authorizationEndpoint}?${params.toString()}`);
}

/**
 * Complete the PKCE exchange after the deep-link fires.
 * Call this from the deep-link event handler with the full callback URL.
 */
export async function completeTauriOidcFlow(callbackUrl: string): Promise<boolean> {
	const pendingRaw = sessionStorage.getItem(PENDING_PKCE_KEY);
	if (!pendingRaw) return false;

	const pending: PendingPKCE = JSON.parse(pendingRaw);
	sessionStorage.removeItem(PENDING_PKCE_KEY);

	const url = new URL(callbackUrl);
	const code = url.searchParams.get('code');
	const returnedState = url.searchParams.get('state');

	if (!code || returnedState !== pending.state) return false;

	const { tokenEndpoint } = deriveOidcEndpoints(pending.authorityUrl);

	const body = new URLSearchParams({
		grant_type: 'authorization_code',
		client_id: pending.clientId,
		redirect_uri: 'munify-chase://oidc-callback',
		code,
		code_verifier: pending.codeVerifier
	});

	const response = await fetch(tokenEndpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: body.toString()
	});

	if (!response.ok) return false;

	const tokens = await response.json();
	storeTokens({
		access_token: tokens.access_token,
		refresh_token: tokens.refresh_token,
		expires_in: tokens.expires_in ?? 3600
	});

	return true;
}
