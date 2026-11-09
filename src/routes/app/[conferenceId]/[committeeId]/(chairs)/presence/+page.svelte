<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import PresenceActions from './PresenceActions.svelte';
	import Flag from '#lib/components/Flag.svelte';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '#lib/utils/toast';
	import { sortTranslatedCountries } from '#lib/utils/nationTranslationHelper.svelte';
	import ChairRollCall from '#lib/components/rollCall/ChairRollCall.svelte';
	import { isDelegationMember, isUNMember } from '#lib/helpers/distinguishConferenceMembers';
	import NsaAttendanceCard from './NsaAttendanceCard.svelte';
	import { isLocalConferenceActive } from '#lib/state/localDemo.svelte';
	import ChairPage from '../ChairPage.svelte';
	import RollCallCard from './RollCallCard.svelte';
	import DelegationPresenceRow from './DelegationPresenceRow.svelte';

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		stateOfDebate: true,
		activeAgendaItem: { id: true, title: true },
		// Active-roll-call status now lives on the committee as a single FK; pull
		// it alongside the rest so a single liveQuery powers the Start/Resume
		// button and the modal's `externalActiveSessionId` prop.
		activeRollCallSession: {
			id: true,
			currentMemberIndex: true,
			// Needed so updates.completeRollCallSession can resolve which committee to
			// clear when the close replays cross-tab / offline (no subscription).
			committeeId: true
		},
		members: {
			id: true,
			present: true,
			representation: {
				id: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				regionalGroup: true,
				type: true,
				icon: true
			}
		},
		conference: {
			id: true,
			uniqueConferenceMembers: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					type: true,
					icon: true
				}
			}
		}
	});

	let countries = $derived(
		committee?.members
			.filter(isDelegationMember)
			.sort((a, b) => sortTranslatedCountries(a.representation, b.representation)) ?? []
	);

	let un = $derived(
		committee?.conference?.uniqueConferenceMembers
			?.filter(isUNMember)
			?.sort((a, b) => (a.representation.name ?? '').localeCompare(b.representation.name ?? '')) ??
			[]
	);

	let activeSession = $derived(committee?.activeRollCallSession ?? null);

	const pastSessions = await client.liveQuery.rollCallSessions({
		__args: {
			where: { committeeId: { eq: page.params.committeeId! }, completedAt: { isNull: false } },
			orderBy: { createdAt: 'desc' }
		},
		id: true,
		currentMemberIndex: true,
		createdAt: true,
		completedAt: true,
		startedBy: {
			name: true,
			userEmail: true
		},
		presenceEvents: {
			id: true,
			present: true
		}
	});

	let rollCallActive = $state(false);

	function openRollCall() {
		rollCallActive = true;
	}

	registerCommands(() => [
		{
			id: 'presence.roll-call',
			title: activeSession ? m.resumeRollCall : m.rollCall,
			group: 'page',
			icon: activeSession ? 'arrow-clockwise' : 'user-focus',
			visible: () => !!committee,
			run: openRollCall
		}
	]);

	const setPresence = (tab: boolean, id: string) => {
		toast.promise(
			client.mutate.setPresenceForCommitteeMembers({
				__args: { ids: [id], present: tab },
				id: true,
				present: true
			}),
			promiseToastStrings(m.presence(), 'update')
		);
	};
</script>

<ChairPage {committee}>
	{#snippet sidebar(committee)}
		<RollCallCard {activeSession} total={countries.length} {pastSessions} onOpen={openRollCall} />
		<BasicCard data-tour="presence.bulk-actions">
			<PresenceActions memberIds={committee.members.map((x) => x.id)} />
		</BasicCard>
	{/snippet}
	{#snippet children(committee)}
		{#if !isLocalConferenceActive()}
			<NsaAttendanceCard conferenceId={committee.conference!.id} committeeId={committee.id} />
		{/if}
		<BasicCard title={m.delegations()}>
			{#each countries as member, index (member.id)}
				<DelegationPresenceRow
					{member}
					first={index === 0}
					onPresenceChange={(tab) => {
						setPresence(tab, member.id);
					}}
				/>
			{/each}
		</BasicCard>
		<BasicCard title={m.unActors()} data-tour="presence.un-actors">
			{#each un as member (member.id)}
				<div
					class="hover:bg-base-200 card flex w-full flex-row items-center gap-4 p-2 transition-all duration-300"
				>
					<Flag representation={member.representation} size="sm" />
					<h3 class="flex-1 text-lg">
						{member.representation?.name || m.unknown()}
					</h3>
				</div>
			{/each}
		</BasicCard>
	{/snippet}
</ChairPage>

<ChairRollCall
	bind:active={rollCallActive}
	members={countries}
	committeeId={page.params.committeeId!}
	externalActiveSessionId={activeSession?.id ?? null}
/>
