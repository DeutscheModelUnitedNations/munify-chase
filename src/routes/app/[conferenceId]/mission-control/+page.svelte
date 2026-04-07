<script lang="ts">
	import CommitteeGrid from '$lib/components/CommitteeGrid.svelte';
	import CurrentTime from '$lib/components/CurrentTime.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import NavbarBurgerMenu from '$lib/components/NavbarBurgerMenu.svelte';
	import DownloadPresenceData from './DownloadPresenceData.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';

	let { data }: { data: { user: { sub: string } } } = $props();

	const conference = await client.liveQuery.conference({
		__args: { id: page.params.conferenceId! },
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

	const conferenceUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: page.params.conferenceId },
				user: { id: data.user.sub }
			}
		},
		id: true,
		conferenceUserType: true
	});

	let currentUserRole = $derived(conferenceUsers?.[0]);
	let isAdmin = $derived(currentUserRole?.conferenceUserType === 'ADMIN');

	const baseMenuItems = [
		{
			faIcon: 'fa-home',
			title: m.home(),
			href: '..'
		}
	];

	let menubarItems = $derived(
		isAdmin
			? [
					...baseMenuItems,
					{
						faIcon: 'fa-gear',
						title: m.configuration(),
						href: 'mission-control/config'
					}
				]
			: baseMenuItems
	);
</script>

<svelte:head>
	<title>{m.missionControl()} - MUNify CHASE</title>
</svelte:head>

<div class="navbar bg-base-100 shadow-sm">
	<h1 class=" ml-4 flex-1 text-3xl font-bold">{m.missionControl()}</h1>
	<div class="flex-none">
		<CurrentTime />
	</div>
	<div class="flex-none">
		<NavbarBurgerMenu items={menubarItems}>
			{#snippet CustomListItems()}
				<DownloadPresenceData conferenceTitle={conference?.title} conferenceId={conference?.id} />
			{/snippet}
		</NavbarBurgerMenu>
	</div>
</div>

{#if conference}
	<CommitteeGrid conference={conference as any} environment="TEAM" />
{/if}
