/**
 * Platform-aware OIDC authentication.
 *
 * Web: delegates to the SvelteKit server's OIDC handle hook (cookie-session).
 * Tauri: PKCE authorization code flow via oidc-client-ts UserManager + system browser.
 *        tauri-plugin-single-instance (deep-link feature) ensures the OS
 *        delivers the munify-chase:// callback to the already-running instance
 *        via onOpenUrl instead of spawning a new process.
 */

import { UserManager, OidcClient, WebStorageStateStore, User } from 'oidc-client-ts';
import { configPublic } from '$lib/config/public';

const REDIRECT_URI = 'munify-chase://oidc-callback';

let _manager: UserManager | null = null;

// Synchronous in-memory cache — kept in sync via UserManager events so that
// getCachedAccessToken() can be called synchronously from urql callbacks.
let _currentUser: User | null = null;

// Pre-populate the cache synchronously from localStorage before any component
// code runs, so the first getCachedAccessToken() call on page load returns the
// right value without waiting for the async getUser() promise to resolve.
if (typeof window !== 'undefined') {
	const base = configPublic.PUBLIC_OIDC_AUTHORITY.replace(
		/\/\.well-known\/openid-configuration$/,
		''
	);
	const key = `oidc.user:${base}:${configPublic.PUBLIC_OIDC_CLIENT_ID}`;
	const raw = localStorage.getItem(key);
	if (raw) {
		try {
			_currentUser = User.fromStorageString(raw);
		} catch {
			_currentUser = null;
		}
	}
}

function getUserManager(): UserManager {
	if (!_manager) {
		const base = configPublic.PUBLIC_OIDC_AUTHORITY.replace(
			/\/\.well-known\/openid-configuration$/,
			''
		);
		_manager = new UserManager({
			authority: base,
			client_id: configPublic.PUBLIC_OIDC_CLIENT_ID,
			redirect_uri: REDIRECT_URI,
			scope: 'openid email profile offline_access',
			userStore: new WebStorageStateStore({ store: window.localStorage }),
			stateStore: new WebStorageStateStore({ store: window.localStorage })
		});

		_manager.events.addUserLoaded((u) => {
			_currentUser = u;
		});
		_manager.events.addUserUnloaded(() => {
			_currentUser = null;
		});
		_manager.events.addAccessTokenExpired(() => {
			_currentUser = null;
		});
	}
	return _manager;
}

/** Returns a valid (non-expired) access token if one is cached, else null. */
export function getCachedAccessToken(): string | null {
	if (!_currentUser || _currentUser.expired) return null;
	return _currentUser.access_token;
}

/** Clears the stored session (logout). */
export function clearTokens(): void {
	_currentUser = null;
	void getUserManager().removeUser();
}

/**
 * Starts the PKCE login flow in Tauri:
 * 1. Use OidcClient.createSigninRequest() to build the authorization URL and
 *    store PKCE state in localStorage (window.location.assign is readonly in
 *    WebKit so UserManager.signinRedirect() cannot be used here).
 * 2. Open the authorization URL in the system browser.
 * 3. Wait for the deep-link callback via onOpenUrl.
 * 4. Call UserManager.signinRedirectCallback(url) — finds the PKCE state from
 *    the shared localStorage, exchanges the code for tokens, and stores the
 *    User object.
 */
export async function tauriLogin(signal?: AbortSignal): Promise<void> {
	const { openUrl } = await import('@tauri-apps/plugin-opener');
	const { onOpenUrl } = await import('@tauri-apps/plugin-deep-link');

	const manager = getUserManager();

	// window.location.assign is readonly in WebKit so UserManager.signinRedirect()
	// cannot be intercepted. Instead, use OidcClient (the lower-level class) just
	// to build the authorization URL — it generates PKCE params and stores them in
	// stateStore without navigating. Both OidcClient and UserManager use the same
	// stateStore key format, so signinRedirectCallback() below finds the state.
	const client = new OidcClient(manager.settings);
	const req = await client.createSigninRequest({});
	const authUrl = req.url;

	return new Promise<void>((resolve, reject) => {
		let done = false;
		let unlistener: (() => void) | undefined;

		signal?.addEventListener('abort', () => {
			unlistener?.();
			reject(new DOMException('Login cancelled', 'AbortError'));
		});

		async function handleCallbackUrl(url: string) {
			if (done) return;
			if (!url.startsWith('munify-chase://oidc-callback')) return;
			done = true;
			unlistener?.();
			try {
				await manager.signinRedirectCallback(url);
				resolve();
			} catch (e) {
				reject(e);
			}
		}

		onOpenUrl((urls) => {
			const url = urls.find((u) => u.startsWith('munify-chase://oidc-callback'));
			if (url) handleCallbackUrl(url);
		})
			.then((fn) => {
				unlistener = fn;
				return openUrl(authUrl!);
			})
			.catch(reject);
	});
}
