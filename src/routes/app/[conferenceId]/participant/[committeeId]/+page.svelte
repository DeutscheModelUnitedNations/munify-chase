<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { getCurrentUser } from '#lib/state/currentUser.svelte';
	import { latchWhileDisconnected } from '#lib/state/connection.svelte';
	import IconInfoBox from '#lib/components/IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '#lib/utils/committeeStatus';
	import WhiteboardViewer from '#lib/components/whiteboard/WhiteboardViewer.svelte';
	import Majorities from '#lib/components/Majorities.svelte';
	import ParticipantIdentityCard from '../ParticipantIdentityCard.svelte';
	import DeviceVoteModal from '#lib/components/voting/DeviceVoteModal.svelte';
	import RequestsCard from '#lib/components/requests/RequestsCard.svelte';
	import { isLocalConferenceActive } from '#lib/state/localDemo.svelte';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import { editableSpeakersListSelection, participantSelection } from '../../selections';
	import ParticipantListCard from './ParticipantListCard.svelte';
	import {
		isParticipantRole,
		positionOnList,
		seesSpeakersLists,
		selfAddState,
		showsDeviceVote
	} from './participantCommittee';

	const currentUser = await getCurrentUser();
	const [conferenceUser] =
		(await client.liveQuery.conferenceUsers({
			__args: {
				where: {
					conference: { id: { eq: page.params.conferenceId } },
					user: { id: { eq: currentUser?.id ?? '' } }
				}
			},
			...participantSelection
		})) ?? [];

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

	const minAmendmentSponsors = $derived(Math.ceil((committee?.totalPresent ?? 0) * 0.1));

	let role = $derived(conferenceUser?.conferenceUserType);
	let isParticipant = $derived(isParticipantRole(role));

	// Determine what member IDs we have for self-add detection
	let myCommitteeMemberId = $derived(conferenceUser?.committeeMemberId);
	let myConferenceMemberId = $derived(conferenceUser?.conferenceMemberId);
	let myPresent = $derived(conferenceUser?.committeeMember?.present ?? false);
	let representation = $derived(
		conferenceUser?.committeeMember?.representation ??
			conferenceUser?.conferenceMember?.representation
	);

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
		{ list: speakersList, label: m.speakersList, myPosition: myPositionOnSpeakers, key: 'speakers' },
		{ list: commentList, label: m.commentList, myPosition: myPositionOnComments, key: 'poi' }
	]);

	/** What the caller can do about a list, null while they cannot add themselves at all. */
	function selfAddFor({ list, myPosition }: { list: typeof speakersList; myPosition: number | null }) {
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

		<!-- Committee Status Card -->
		<div class="card bg-base-100 shadow-sm" data-tour="committee.status">
			<div class="card-body gap-2 p-4">
				<IconInfoBox text={activeAgendaItem?.title ?? '—'} icon="lectern" />
				<IconInfoBox
					text={getCommitteeStatusText(committee.status)}
					icon={getCommitteeStatusIcon(committee.status)}
					committeeStatus={committee.status}
					until={new Date(committee.statusUntil)}
				/>
				{#if committee.statusHeadline}
					<div class="text-sm opacity-70">{committee.statusHeadline}</div>
				{/if}
			</div>
		</div>
		<div class="card bg-base-100 shadow-sm" data-tour="committee.majorities">
			<div class="card-body gap-2 p-4">
				<h2 class="card-title text-lg">{m.majorities()}</h2>
				<Majorities
					totalPresent={committee.totalPresent}
					simpleMajority={committee.simpleMajority}
					twoThirdsMajority={committee.twoThirdsMajority}
					{minAmendmentSponsors}
				/>
			</div>
		</div>

		<!-- Speakers List Card -->
		{#if seesSpeakersLists(role)}
			{#each lists as entry, i (entry.key)}
				{#if entry.list}
					{@const list = entry.list}
					<ParticipantListCard
						{list}
						label={entry.label()}
						myPosition={entry.myPosition}
						selfAdd={selfAddFor(entry)}
						tour={i === 0}
						onAdd={() => handleSelfAdd(list.id)}
						onRemove={() => handleSelfRemove(list.id)}
					/>
				{/if}
			{/each}
		{/if}

		<!-- Requests Card -->
		{#if isParticipant && committee.allowRequests}
			<div class="grid" data-tour="committee.requests">
				<RequestsCard
					conferenceId={page.params.conferenceId!}
					committeeId={committee.id}
					isDelegate={role === 'DELEGATE'}
				/>
			</div>
		{/if}

		<!-- Resolutions Card -->
		{#if !isLocalConferenceActive()}
			<a
				data-tour="committee.resolutions"
				class="card bg-base-100 shadow-sm transition hover:shadow-md"
				href={resolve('/app/[conferenceId]/participant/[committeeId]/papers', {
					conferenceId: page.params.conferenceId!,
					committeeId: page.params.committeeId!
				})}
			>
				<div class="card-body flex-row items-center gap-3 p-4">
					<i aria-hidden="true" class="ph-duotone ph-file-text text-2xl"></i>
					<div class="flex-1">
						<h2 class="card-title text-lg">{m.resolutions()}</h2>
						<p class="text-base-content/60 text-sm">{m.resolutionsCardHint()}</p>
					</div>
					<i aria-hidden="true" class="ph-fill ph-caret-right opacity-50"></i>
				</div>
			</a>
		{/if}

		<!-- Whiteboard Card -->
		{#if committee.showWhiteboard && committee.whiteboardContent}
			<div class="card bg-base-100 shadow-sm" data-tour="committee.whiteboard">
				<div class="card-body p-4">
					<h2 class="card-title text-lg">{m.whiteboard()}</h2>
					<WhiteboardViewer data={committee.whiteboardContent} />
				</div>
			</div>
		{/if}
	</div>
{/if}

{#if showDeviceVoteModal && activeVotingSession?.deviceVotingStartedAt && activeVotingSession?.deviceVotingWindowSeconds && myCommitteeMemberId}
	<DeviceVoteModal
		active={showDeviceVoteModal}
		sessionId={activeVotingSession.id}
		voteName={activeVotingSession.voteName}
		withAbstentions={activeVotingSession.withAbstentions}
		deviceVotingStartedAt={activeVotingSession.deviceVotingStartedAt}
		deviceVotingWindowSeconds={activeVotingSession.deviceVotingWindowSeconds}
		{myVote}
		{myCommitteeMemberId}
	/>
{/if}
