<script lang="ts">
	import type { PageData } from './$houdini';
	import CommitteeGrid from '$lib/components/CommitteeGrid.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.MissionControlQuery);
	let conference = $derived($query.data?.findFirstConference);
</script>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class=" ml-4 flex-1 text-3xl font-bold">{m.missionControl()}</h1>
	<div class="flex-none">
		<CurrentTime />
	</div>
	<div class="flex-none">
		<ThemeSwitcher />
		<a class="btn btn-ghost btn-square" href="/app" aria-label="Go back to app">
			<i class="fa-duotone fa-home"></i>
		</a>
	</div>
</div>

{#if conference}
	<CommitteeGrid {conference} environment="TEAM" />
{/if}
