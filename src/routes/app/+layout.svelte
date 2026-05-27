<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import { isTauri } from '$lib/platform';
	import { getCachedAccessToken } from '$lib/platform/oidc';

	let { children } = $props();

	if (browser) {
		if (isTauri()) {
			// If the user navigated directly to /app without a cached token, send
			// them back to the login page.
			if (!getCachedAccessToken()) {
				goto('/');
			} else {
				getCurrentUser().catch((e) => console.error('Failed to load user:', e));
			}
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
