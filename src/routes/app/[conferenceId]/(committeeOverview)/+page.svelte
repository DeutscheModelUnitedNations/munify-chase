<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { client } from '$lib/api/rumbleClient/client';
	import CommitteeGrid, { type ConferenceData } from '$lib/components/CommitteeGrid.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const conference = await client.liveQuery.conference({
		__args: { id: page.params.conferenceId! },
		id: true,
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
			statusUntil: true
		}
	});
</script>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class=" ml-4 flex-1 text-3xl font-bold">{m.committeeOverview()}</h1>
	<div class="flex-none">
		<CurrentTime />
	</div>
	<div class="flex-none">
		<ThemeSwitcher />
		<a
			class="btn btn-ghost btn-square"
			href={resolve('/app/(launcher)')}
			aria-label="Go back to app"
		>
			<i class="fa-duotone fa-home"></i>
		</a>
	</div>
</div>

{#if conference}
	<CommitteeGrid conference={conference as unknown as ConferenceData} />
{/if}
