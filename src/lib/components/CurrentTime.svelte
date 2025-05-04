<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';

	let currentTime = $state(new Date());

	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<h2 class="mr-4 font-mono text-3xl font-bold">
	{currentTime.toLocaleTimeString(getLocale(), {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	})}
</h2>
