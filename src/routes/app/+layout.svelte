<script lang="ts">
	import { browser } from '$app/environment';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import { isTauri } from '$lib/platform';
	import {
		startTauriOidcFlow,
		completeTauriOidcFlow,
		getCachedAccessToken
	} from '$lib/platform/oidc';
	import { PUBLIC_OIDC_AUTHORITY, PUBLIC_OIDC_CLIENT_ID } from '$env/static/public';

	let { children } = $props();

	if (browser) {
		if (isTauri()) {
			// Register deep-link handler so the OIDC callback coming back from the
			// system browser completes the PKCE exchange and reloads the user.
			(async () => {
				try {
					const { onOpenUrl } = await import('@tauri-apps/plugin-deep-link');
					try {
						await onOpenUrl(async (urls) => {
							const callbackUrl = urls.find((u) => u.startsWith('munify-chase://oidc-callback'));
							if (!callbackUrl) return;
							const ok = await completeTauriOidcFlow(callbackUrl);
							if (ok) window.location.reload();
						});
					} catch (e) {
						console.error('deep-link registration failed:', e);
					}

					// If no cached token is available, start the OIDC flow immediately.
					if (!getCachedAccessToken()) {
						await startTauriOidcFlow(PUBLIC_OIDC_AUTHORITY, PUBLIC_OIDC_CLIENT_ID);
					} else {
						try {
							await getCurrentUser();
						} catch {
							// Token expired — re-authenticate.
							await startTauriOidcFlow(PUBLIC_OIDC_AUTHORITY, PUBLIC_OIDC_CLIENT_ID);
						}
					}
				} catch (e) {
					console.error('Tauri OIDC init failed:', e);
				}
			})();
		} else {
			// Web mode: on client-side SPA navigation into /app the server's OIDC
			// handle hook never runs, so an unauthenticated visitor would see a
			// broken page. Probe the session and force a full navigation on failure
			// so the server hook can start the OIDC flow.
			(async () => {
				try {
					await getCurrentUser();
				} catch {
					window.location.assign(window.location.pathname + window.location.search);
				}
			})();
		}
	}
</script>

{@render children()}
