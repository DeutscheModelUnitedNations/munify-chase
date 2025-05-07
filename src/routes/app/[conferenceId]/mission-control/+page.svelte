<script lang="ts">
	import type { PageData } from './$houdini';
	import CommitteeGrid from '$lib/components/CommitteeGrid.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';

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
		<NavbarBurgerMenu
			items={[
				{
					faIcon: 'fa-home',
					title: m.home(),
					href: '..'
				}
			]}
		/>
	</div>
</div>

{#if conference}
	<CommitteeGrid {conference} environment="TEAM" />
{/if}
