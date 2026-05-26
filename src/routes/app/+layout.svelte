<script lang="ts">
	import { browser } from '$app/environment';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import { onMount } from 'svelte';

	let { children, data } = $props();

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

	onMount(() => {
		// Keep the OIDC access token fresh so the WebSocket connection (which holds
		// auth state from the cookie at connect time) can reconnect successfully after
		// the server closes it at token expiry. A normal HTTP request through the
		// SvelteKit handle hook is enough to trigger the OIDC token refresh.
		let timeout: ReturnType<typeof setTimeout>;

		async function doKeepalive() {
			try {
				const res = await fetch('/api/keepalive');
				const body: { exp: number | null } = await res.json();
				scheduleKeepalive(body.exp);
			} catch {
				// On failure retry in 60s
				timeout = setTimeout(doKeepalive, 60_000);
			}
		}

		function scheduleKeepalive(exp: number | null) {
			if (!exp) return;
			// Fire 90 seconds before the token expires so the fresh cookie is ready
			// when the server closes the WebSocket at the original expiry time
			const msUntilRefresh = exp * 1000 - Date.now() - 90_000;
			timeout = setTimeout(doKeepalive, Math.max(msUntilRefresh, 0));
		}

		scheduleKeepalive(data.tokenExp);

		return () => clearTimeout(timeout);
	});
</script>

{@render children()}
