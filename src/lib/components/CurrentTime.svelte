<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { getServerTime } from '$lib/state/serverTime.svelte';

	// Defaults to the browser/OS timezone (previous behavior) when unset —
	// only the kiosk currently passes an explicit one (its display's assigned
	// timezone, since it has no OS-level locale of its own to rely on).
	let { timezone }: { timezone?: string | null } = $props();
</script>

<h2 class="mr-4 font-mono text-3xl font-bold">
	{getServerTime()
		.toDate()
		.toLocaleTimeString(getLocale(), {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			...(timezone ? { timeZone: timezone } : {})
		})}
</h2>
