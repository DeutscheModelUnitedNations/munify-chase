<script lang="ts">
	import { browser } from '$app/environment';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';

	let { children } = $props();

	// On client-side SPA navigation into /app the server's OIDC handle hook never
	// runs, so an unauthenticated visitor would just see a broken page. Probe the
	// session by requesting the current user, on failure, force a full document
	// navigation to the same URL so the server hook can start the OIDC flow
	if (browser) {
		(async () => {
			try {
				await getCurrentUser();
			} catch {
				window.location.assign(window.location.pathname + window.location.search);
			}
		})();
	}

	// Token freshness for the WebSocket is handled in $lib/api/client.ts: a
	// request to /api/keepalive runs through the OIDC handle hook (refreshing
	// the session cookie if needed) before every WS (re)connect attempt.
</script>

{@render children()}
