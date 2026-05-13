<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import { getServerTime } from '$lib/state/serverTime.svelte';
</script>

<h2 class="mr-4 font-mono text-3xl font-bold">
	{getServerTime().toDate().toLocaleTimeString(getLocale(), {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})}
</h2>
