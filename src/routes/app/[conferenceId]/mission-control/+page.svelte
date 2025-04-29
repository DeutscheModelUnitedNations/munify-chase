<script lang="ts">
	import type { PageData } from './$houdini';
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import CommitteeGrid from '$lib/components/CommitteeGrid.svelte';

	let { data }: { data: PageData } = $props();

	let currentTime = $state(new Date());

	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date();
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<div class="h-screen w-full">
	<div class="navbar bg-base-200 relative shadow-sm">
		<h1 class=" ml-4 flex-1 text-3xl font-bold">Mission Control</h1>
		<div class="flex-none">
			<h2 class="mr-4 font-mono text-3xl font-bold">
				{currentTime.toLocaleTimeString(getLocale(), {
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false
				})}
			</h2>
		</div>
		<div class="flex-none">
			<a class="btn btn-ghost btn-square" href="/app" aria-label="Go back to app">
				<i class="fa-duotone fa-home"></i>
			</a>
		</div>
	</div>

	<CommitteeGrid />
</div>
