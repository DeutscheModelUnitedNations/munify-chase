<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { latchWhileDisconnected } from '#lib/state/connection.svelte';
	import ParticipantIdentityCard from '../ParticipantIdentityCard.svelte';
	import RequestsCard from '#lib/components/requests/RequestsCard.svelte';
	import { isLocalConferenceActive } from '#lib/state/localDemo.svelte';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import { editableSpeakersListSelection } from '../../selections';
	import { loadParticipantUser, participantRepresentation } from '../participantUser';
	import ParticipantListCard from './ParticipantListCard.svelte';
	import CommitteeOverviewCards from './CommitteeOverviewCards.svelte';
	import ResolutionsLinkCard from './ResolutionsLinkCard.svelte';
	import WhiteboardCard from './WhiteboardCard.svelte';
	import ParticipantDeviceVote from './ParticipantDeviceVote.svelte';
	import {
		isParticipantRole,
		positionOnList,
		seesSpeakersLists,
		selfAddState,
		showsDeviceVote
	} from './participantCommittee';

	const conferenceUser = await loadParticipantUser(page.params.conferenceId);

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		name: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		showWhiteboard: true,
		whiteboardContent: true,
		allowDelegationsToAddThemselvesToSpeakersList: true,
		allowRequests: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		activeVotingSessionId: true,
		activeVotingSession: {
			id: true,
			mode: true,
			voteName: true,
			withAbstentions: true,
			deviceVotingStartedAt: true,
			deviceVotingWindowSeconds: true,
			votes: { id: true, committeeMemberId: true, vote: true }
		},
		activeAgendaItem: {
			id: true,
			title: true,
			speakersList: editableSpeakersListSelection
		}
	});

	const conferenceId = $derived(page.params.conferenceId!);
	const minAmendmentSponsors = $derived(Math.ceil((committee?.totalPresent ?? 0) * 0.1));

	let role = $derived(conferenceUser?.conferenceUserType);
	let isParticipant = $derived(isParticipantRole(role));
	const showsRequests = $derived(isParticipant && !!committee?.allowRequests);

	// Determine what member IDs we have for self-add detection
	let myCommitteeMemberId = $derived(conferenceUser?.committeeMemberId);
	let myConferenceMemberId = $derived(conferenceUser?.conferenceMemberId);
	let myPresent = $derived(conferenceUser?.committeeMember?.present ?? false);
	let representation = $derived(participantRepresentation(conferenceUser));

	// Freeze the last-known agenda item while the WS is confirmed disconnected, so a
	// transient network blip doesn't reset the active speaker's timer.
	const getActiveAgendaItem = latchWhileDisconnected(() => committee?.activeAgendaItem);
	const activeAgendaItem = $derived(getActiveAgendaItem());

	// Same freeze rationale as the agenda item: a real disconnect closes the vote via
	// completeVotingSession clearing activeVotingSessionId, not the WS blip itself.
	const getActiveVotingSession = latchWhileDisconnected(() => committee?.activeVotingSession);
	const activeVotingSession = $derived(getActiveVotingSession());
	const showDeviceVoteModal = $derived(
		showsDeviceVote({
			session: activeVotingSession,
			committeeMemberId: myCommitteeMemberId,
			present: myPresent
		})
	);
	const myVote = $derived(
		activeVotingSession?.votes.find((v) => v.committeeMemberId === myCommitteeMemberId)?.vote ??
			null
	);

	const speakersList = $derived(
		activeAgendaItem?.speakersList?.find((sl) => sl.type === 'SPEAKERS_LIST')
	);
	const commentList = $derived(
		activeAgendaItem?.speakersList?.find((sl) => sl.type === 'COMMENT_LIST')
	);

	// Self-add logic
	const canSelfAdd = $derived(
		committee?.allowDelegationsToAddThemselvesToSpeakersList && isParticipant
	);

	function findMyPositionOnList(list: typeof speakersList): number | null {
		return positionOnList({
			speakers: list?.speakers ?? [],
			committeeMemberId: myCommitteeMemberId,
			conferenceMemberId: myConferenceMemberId
		});
	}

	let myPositionOnSpeakers = $derived(findMyPositionOnList(speakersList));
	let myPositionOnComments = $derived(findMyPositionOnList(commentList));

	async function handleSelfAdd(listId: string) {
		await client.mutate.selfAddToSpeakersList({
			__args: { id: nanoid(), speakersListId: listId },
			id: true,
			position: true,
			speakersListId: true
		});
	}

	async function handleSelfRemove(listId: string) {
		await client.mutate.selfRemoveFromSpeakersList({
			__args: { speakersListId: listId },
			id: true,
			speakers: { id: true, position: true }
		});
	}

	const lists = $derived([
		{
			list: speakersList,
			label: m.speakersList,
			myPosition: myPositionOnSpeakers,
			key: 'speakers'
		},
		{ list: commentList, label: m.commentList, myPosition: myPositionOnComments, key: 'poi' }
	]);

	// The lists the caller sees, the first of both carrying the tour's anchors
	const shownLists = $derived(
		seesSpeakersLists(role)
			? lists.flatMap((entry, i) =>
					entry.list ? [{ ...entry, list: entry.list, tour: i === 0 }] : []
				)
			: []
	);

	/** What the caller can do about a list, null while they cannot add themselves at all. */
	function selfAddFor({
		list,
		myPosition
	}: {
		list: typeof speakersList;
		myPosition: number | null;
	}) {
		if (!list || !seesSpeakersLists(role) || !canSelfAdd) return null;
		return selfAddState({ myPosition, isClosed: list.isClosed, role, present: myPresent });
	}

	// The self-add buttons of both lists. Each command is visible exactly while its button is
	// rendered, so a closed list or a delegate who is not present gets no command.
	registerCommands(() =>
		lists.flatMap((entry) => {
			const keywords = entry.key === 'poi' ? ['POI'] : [];
			const shared = { context: entry.label, keywords, group: 'page' as const };
			return [
				{
					...shared,
					id: `participant.${entry.key}.add-me`,
					title: m.addMeToList,
					icon: 'plus',
					visible: () => selfAddFor(entry) === 'canAdd',
					run: () => handleSelfAdd(entry.list!.id)
				},
				{
					...shared,
					id: `participant.${entry.key}.remove-me`,
					title: m.removeFromList,
					icon: 'minus',
					visible: () => selfAddFor(entry) === 'onList',
					run: () => handleSelfRemove(entry.list!.id)
				}
			];
		})
	);
</script>

<svelte:head>
	<title>{committee?.name ?? m.committee()} - MUNify CHASE</title>
</svelte:head>

{#if committee}
	<!-- Mobile-first vertical card stack -->
	<div class="grid w-full grid-cols-1 md:grid-cols-2 gap-4 p-4">
		<!-- Identity Card -->
		<div class="md:col-span-2">
			<ParticipantIdentityCard {representation} />
		</div>

		<CommitteeOverviewCards
			{committee}
			agendaItemTitle={activeAgendaItem?.title}
			{minAmendmentSponsors}
		/>

		<!-- Speakers List Card -->
		{#each shownLists as entry (entry.key)}
			<ParticipantListCard
				list={entry.list}
				label={entry.label()}
				myPosition={entry.myPosition}
				selfAdd={selfAddFor(entry)}
				tour={entry.tour}
				onAdd={() => handleSelfAdd(entry.list.id)}
				onRemove={() => handleSelfRemove(entry.list.id)}
			/>
		{/each}

		<!-- Requests Card -->
		{#if showsRequests}
			<div class="grid" data-tour="committee.requests">
				<RequestsCard {conferenceId} committeeId={committee.id} isDelegate={role === 'DELEGATE'} />
			</div>
		{/if}

		<!-- Resolutions Card -->
		{#if !isLocalConferenceActive()}
			<ResolutionsLinkCard {conferenceId} committeeId={page.params.committeeId!} />
		{/if}

		<!-- Whiteboard Card -->
		{#if committee.showWhiteboard && committee.whiteboardContent}
			<WhiteboardCard data={committee.whiteboardContent} />
		{/if}
	</div>
{/if}

<ParticipantDeviceVote
	show={showDeviceVoteModal}
	session={activeVotingSession}
	{myVote}
	{myCommitteeMemberId}
/>
