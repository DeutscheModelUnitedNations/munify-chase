<script lang="ts">
	import CommitteeGrid, { type ConferenceData } from '$lib/components/CommitteeGrid.svelte';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import { client } from '$lib/api/rumbleClient/client';

	let { data } = $props();

	const conference = await client.liveQuery.conference({
		__args: { id: data.conferenceId },
		id: true,
		title: true,
		committees: {
			id: true,
			name: true,
			abbreviation: true,
			activeAgendaItem: {
				id: true,
				title: true
			},
			status: true,
			statusHeadline: true,
			statusUntil: true,
			stateOfDebate: true,
			lastResolutionAdoptionDate: true
		}
	});
</script>

<svelte:head>
	<title>{conference?.title ?? 'MUNify CHASE'}</title>
</svelte:head>

<div class="bg-base-200 flex h-screen w-screen flex-col overflow-hidden">
	<div class="navbar bg-base-100 shadow-sm">
		<h1 class="ml-4 flex-1 text-3xl font-bold">{conference?.title ?? ''}</h1>
		<div class="flex-none">
			<CurrentTime />
		</div>
	</div>

	{#if conference}
		<div class="min-h-0 flex-1 overflow-auto">
			<CommitteeGrid
				conference={conference as unknown as ConferenceData}
				environment="DISPLAY"
				showStateOfDebate={data.showStateOfDebate}
			/>
		</div>
	{:else}
		<div class="flex flex-1 items-center justify-center">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{/if}
</div>
