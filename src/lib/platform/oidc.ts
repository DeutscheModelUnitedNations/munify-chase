/**
 * Platform-aware OIDC authentication.
 *
 * Web: delegates to the SvelteKit server's OIDC handle hook (cookie-session).
 * Tauri: PKCE authorization code flow via oidc-client-ts + system browser.
 *        tauri-plugin-single-instance ensures the deep-link callback is routed
 *        to the already-running instance instead of spawning a new process.
 */

import { OidcClient, WebStorageStateStore } from 'oidc-client-ts';
import { configPublic } from '$lib/config/public';

const STORAGE_KEY = 'chase_oidc_tokens';
const REDIRECT_URI = 'munify-chase://oidc-callback';

type TokenSet = {
	access_token: string;
	refresh_token?: string;
	expires_at: number;
};

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
	if (!tokenSet) tokenSet = loadFromStorage();
	if (!tokenSet) return null;
	if (Date.now() / 1000 >= tokenSet.expires_at - 60) return null;
	return tokenSet.access_token;
}

function storeTokens(tokens: { access_token: string; refresh_token?: string; expires_in: number }) {
	tokenSet = {
		access_token: tokens.access_token,
		refresh_token: tokens.refresh_token,
		expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in
	};
	saveToStorage(tokenSet);
}

function buildOidcClient(): OidcClient {
	const base = configPublic.PUBLIC_OIDC_AUTHORITY.replace(
		/\/\.well-known\/openid-configuration$/,
		''
	);
	return new OidcClient({
		authority: base,
		client_id: configPublic.PUBLIC_OIDC_CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		scope: 'openid email profile offline_access',
		// Store PKCE state in localStorage so it survives across the single-instance
		// forwarding of the deep-link callback into the already-running process.
		stateStore: new WebStorageStateStore({ store: window.localStorage }),
		// Explicit metadata avoids a CORS-blocked discovery fetch in WebKitGTK.
		metadata: {
			issuer: base,
			authorization_endpoint: `${base}/auth`,
			token_endpoint: `${base}/token`,
			end_session_endpoint: `${base}/session/end`,
			jwks_uri: `${base}/jwks`
		}
	});
}

/**
 * Starts the PKCE login flow in Tauri:
 * 1. Build the authorization URL via oidc-client-ts (generates verifier, challenge, state)
 * 2. Open it in the system browser
 * 3. Wait for the deep-link callback (routed to this instance by tauri-plugin-single-instance)
 * 4. Exchange the code for tokens via oidc-client-ts
 */
export async function tauriLogin(signal?: AbortSignal): Promise<void> {
	const { openUrl } = await import('@tauri-apps/plugin-opener');
	const { onOpenUrl } = await import('@tauri-apps/plugin-deep-link');
	const { listen } = await import('@tauri-apps/api/event');

	const client = buildOidcClient();
	const req = await client.createSigninRequest({});

	return new Promise<void>((resolve, reject) => {
		let done = false;
		const unlisteners: Array<() => void> = [];

		function cleanup() {
			unlisteners.forEach((fn) => fn());
		}

		signal?.addEventListener('abort', () => {
			cleanup();
			reject(new DOMException('Login cancelled', 'AbortError'));
		});

		async function handleCallbackUrl(url: string) {
			if (done) return;
			if (!url.startsWith('munify-chase://oidc-callback')) return;
			done = true;
			cleanup();
			try {
				const response = await client.processSigninResponse(url);
				storeTokens({
					access_token: response.access_token,
					refresh_token: response.refresh_token,
					expires_in: response.expires_in ?? 3600
				});
				resolve();
			} catch (e) {
				reject(e);
			}
		}

		// Fallback path: Rust single-instance callback emits 'deep-link-callback'.
		// Register this first since it's a plain Tauri event and resolves immediately.
		const p2 = listen<string[]>('deep-link-callback', (event) => {
			const url = event.payload.find((u) => u.startsWith('munify-chase://oidc-callback'));
			if (url) handleCallbackUrl(url);
		})
			.then((fn) => {
				unlisteners.push(fn);
			})
			.catch(reject);

		// Open the browser once the reliable fallback listener is registered. We don't
		// gate this on onOpenUrl below, whose promise can be slow to resolve on some
		// platforms — the 'deep-link-callback' event is enough to receive the callback.
		p2.then(() => openUrl(req.url).catch(reject));

		// Primary path: deep-link plugin's onOpenUrl — register concurrently but don't block.
		onOpenUrl((urls) => {
			const url = urls.find((u) => u.startsWith('munify-chase://oidc-callback'));
			if (url) handleCallbackUrl(url);
		})
			.then((fn) => {
				unlisteners.push(fn);
			})
			.catch(() => {
				// onOpenUrl failing is non-fatal; the 'deep-link-callback' path covers it.
			});
	});
}
