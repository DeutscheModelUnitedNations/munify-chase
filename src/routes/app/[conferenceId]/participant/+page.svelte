<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import CommitteeGrid, { type ConferenceData } from '$lib/components/CommitteeGrid.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import ParticipantIdentityCard from './ParticipantIdentityCard.svelte';

	const currentUser = await getCurrentUser();
	const [conferenceUser] =
		(await client.liveQuery.conferenceUsers({
			__args: {
				where: {
					conference: { id: page.params.conferenceId },
					user: { id: currentUser?.id ?? '' }
				}
			},
			id: true,
			conferenceUserType: true,
			committeeMember: {
				id: true,
				committeeId: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					type: true,
					faIcon: true
				}
			},
			conferenceMember: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					type: true,
					faIcon: true
				}
			}
		})) ?? [];

	const conference = await client.liveQuery.conference({
		__args: { id: page.params.conferenceId! },
		id: true,
		title: true,
		committees: {
			id: true,
			name: true,
			abbreviation: true,
			lastResolutionAdoptionDate: true,
			activeAgendaItem: {
				id: true,
				title: true
			},
			status: true,
			statusHeadline: true,
			statusUntil: true
		}
	});

	let role = $derived(conferenceUser?.conferenceUserType);
	let myCommitteeId = $derived(conferenceUser?.committeeMember?.committeeId);
	let representation = $derived(
		conferenceUser?.committeeMember?.representation ??
			conferenceUser?.conferenceMember?.representation
	);

	// Delegate with assigned committee: auto-redirect
	$effect(() => {
		if (role === 'DELEGATE' && myCommitteeId) {
			goto(
				resolve('/app/[conferenceId]/participant/[committeeId]', {
					conferenceId: page.params.conferenceId!,
					committeeId: myCommitteeId
				}),
				{ replaceState: true }
			);
		}
	});
</script>

<svelte:head>
	<title>{m.participantView()} - MUNify CHASE</title>
</svelte:head>

{#if role === 'DELEGATE' && !myCommitteeId}
	<!-- Waiting screen for unassigned delegates -->
	<div class="flex h-full w-full flex-col items-center justify-center gap-6 p-8">
		<i class="fa-duotone fa-hourglass-clock text-8xl opacity-50"></i>
		<h2 class="text-center text-3xl font-bold">{m.waitingForAssignment()}</h2>
		<p class="max-w-md text-center text-lg opacity-70">
			{m.waitingForAssignmentDescription()}
		</p>
		<a href={resolve('/app/(launcher)')} class="btn btn-ghost mt-4">
			<i class="fa-duotone fa-arrow-left mr-2"></i>
			{m.back()}
		</a>
	</div>
{:else if conference}
	<!-- NSA / Visitor: committee overview -->
	<div class="navbar bg-base-100 shadow-sm">
		<div class="flex-none">
			<a class="btn btn-ghost" href={resolve('/app/(launcher)')}>
				<i class="fa-duotone fa-arrow-left mr-2"></i>
				{m.back()}
			</a>
		</div>
		<h1 class="ml-4 flex-1 text-xl font-bold">{conference.title}</h1>
		<div class="flex-none">
			<ThemeSwitcher />
		</div>
	</div>

	<div class="p-4">
		<ParticipantIdentityCard {representation} />
	</div>

	<CommitteeGrid conference={conference as unknown as ConferenceData} environment="PARTICIPANT" />
{/if}
