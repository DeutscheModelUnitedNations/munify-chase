<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { page } from '$app/state';
	import ConferenceMenu from '../ConferenceMenu.svelte';
	import { getCurrentUser } from '#lib/state/currentUser.svelte';
	import { loadConferenceViewer } from '#lib/state/conferenceViewer';
	import PersonalStatsSection from './PersonalStatsSection.svelte';
	import ConferenceStatsSection from './ConferenceStatsSection.svelte';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import DownloadPresenceData from '../attendance/DownloadPresenceData.svelte';

	const conferenceId = page.params.conferenceId!;
	const currentUser = await getCurrentUser();

	const { conferenceMeta, conferenceUsers, isGlobalAdmin } = await loadConferenceViewer(
		conferenceId,
		currentUser.id ?? ''
	);

	let role = $derived(conferenceUsers?.[0]?.conferenceUserType);
	let isAdmin = $derived(isGlobalAdmin || role === 'ADMIN');
	let isParticipant = $derived(role === 'DELEGATE' || role === 'NON_STATE_ACTOR');
	// Any conference member (including spectators) may view the stats page
	let canAccess = $derived(isGlobalAdmin || role !== undefined);

	let isTeam = $derived(isAdmin || role === 'TEAM');
</script>

<svelte:head>
	<title>{m.statistics()} - MUNify CHASE</title>
</svelte:head>

{#if canAccess}
	<div class="flex h-full w-full flex-col">
		<div class="navbar bg-base-100 shadow-sm">
			<h1 class="ml-4 flex-1 text-3xl font-bold">{m.statistics()}</h1>
			<div class="flex-none">
				<ConferenceMenu
					{role}
					{conferenceId}
					conferenceTitle={conferenceMeta?.title}
					committees={conferenceMeta?.committees}
					listCommittees={isTeam}
					isGlobalAdmin={!!isGlobalAdmin}
					user={currentUser}
				/>
			</div>
		</div>

		<div class="mx-auto flex w-full max-w-screen-xl flex-col gap-6 p-6">
			<!-- Delegator export — admin only, always at top -->
			{#if isAdmin}
				<BasicCard title={m.downloadPresenceData()}>
					<p class="text-base-content/70 mb-3 text-sm">
						{m.downloadPresenceDataDescription()}
					</p>
					<DownloadPresenceData
						{conferenceId}
						conferenceTitle={conferenceMeta?.title ?? undefined}
					/>
				</BasicCard>
				<div class="divider"></div>
			{/if}

			<!-- Personal stats — shown when the user is a delegate/NSA participant.
			     Keep mounted while role is still loading (undefined) to avoid
			     unmount/remount flicker when the conferenceUsers liveQuery resolves. -->
			{#if role === undefined || isParticipant}
				<PersonalStatsSection {conferenceId} />
				<div class="divider"></div>
			{/if}

			<!-- Conference-wide stats — visible to all members -->
			<ConferenceStatsSection {conferenceId} />
		</div>
	</div>
{:else}
	<div class="flex h-full w-full items-center justify-center p-6">
		<p class="text-base-content/60">{m.notAuthorized()}</p>
	</div>
{/if}
