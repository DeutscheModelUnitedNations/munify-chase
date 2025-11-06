<script lang="ts">
import { getLocale } from "$lib/paraglide/runtime";
import { serverTime } from "$lib/state/serverTime.svelte";
</script>

<h2 class="mr-4 font-mono text-3xl font-bold">
	{$serverTime.toDate().toLocaleTimeString(getLocale(), {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})}
</h2>
