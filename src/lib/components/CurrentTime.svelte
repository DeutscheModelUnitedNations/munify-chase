<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { getServerTime } from '$lib/state/serverTime.svelte';

	// Defaults to the browser/OS timezone (previous behavior) when unset —
	// only the kiosk currently passes an explicit one (its display's assigned
	// timezone, since it has no OS-level locale of its own to rely on).
	let { timezone }: { timezone?: string | null } = $props();

	// The value is free-text at the DB/GraphQL layer (the admin UI only ever
	// offers valid IANA names via a <select>, but that's not enforced
	// server-side) — an unrecognized string throws inside toLocaleTimeString
	// and would take the whole display down, so fall back to the
	// browser/OS default rather than trust it blindly.
	function isValidTimezone(tz: string): boolean {
		try {
			new Intl.DateTimeFormat('en-US', { timeZone: tz });
			return true;
		} catch {
			return false;
		}
	}

	let validTimezone = $derived(timezone && isValidTimezone(timezone) ? timezone : undefined);
</script>

<h2 class="mr-4 font-mono text-3xl font-bold">
	{getServerTime()
		.toDate()
		.toLocaleTimeString(getLocale(), {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			...(validTimezone ? { timeZone: validTimezone } : {})
		})}
</h2>
