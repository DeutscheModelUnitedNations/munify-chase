<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { client } from '$lib/api/rumbleClient/client';
	import { getCurrentUser } from '$lib/state/currentUser.svelte';
	import IconInfoBox from '$lib/components/IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import CurrentSpeaker from '$lib/components/speakersList/CurrentSpeaker.svelte';
	import PresentationSpeakersQueue from '$lib/components/speakersList/PresentationSpeakersQueue.svelte';
	import WhiteboardViewer from '$lib/components/whiteboard/WhiteboardViewer.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import ParticipantIdentityCard from '../ParticipantIdentityCard.svelte';

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
			committeeMemberId: true,
			conferenceMemberId: true,
			committeeMember: {
				id: true,
				present: true,
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
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		paperSupportThreshold: true,
		activeAgendaItem: {
			id: true,
			title: true,
			speakersList: {
				id: true,
				type: true,
				isClosed: true,
				speakingTime: true,
				startTimestamp: true,
				timeLeft: true,
				speakers: {
					id: true,
					position: true,
					overwriteName: true,
					committeeMember: {
						id: true,
						representation: {
							id: true,
							name: true,
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
							alpha3Code: true,
							type: true,
							faIcon: true
						}
					}
				}
			}
		}
	});

	let role = $derived(conferenceUser?.conferenceUserType);
	let isParticipant = $derived(role === 'DELEGATE' || role === 'NON_STATE_ACTOR');

	// Determine what member IDs we have for self-add detection
	let myCommitteeMemberId = $derived(conferenceUser?.committeeMemberId);
	let myConferenceMemberId = $derived(conferenceUser?.conferenceMemberId);
	let myPresent = $derived(conferenceUser?.committeeMember?.present ?? false);
	let representation = $derived(
		conferenceUser?.committeeMember?.representation ??
			conferenceUser?.conferenceMember?.representation
	);

	const speakersList = $derived(
		committee?.activeAgendaItem?.speakersList?.find((sl) => sl.type === 'SPEAKERS_LIST')
	);
	const commentList = $derived(
		committee?.activeAgendaItem?.speakersList?.find((sl) => sl.type === 'COMMENT_LIST')
	);

	// Self-add logic
	const canSelfAdd = $derived(
		committee?.allowDelegationsToAddThemselvesToSpeakersList && isParticipant
	);

	function findMyPositionOnList(list: typeof speakersList): number | null {
		if (!list?.speakers) return null;
		const speaker = list.speakers.find(
			(s) =>
				(myCommitteeMemberId && s.committeeMember?.id === myCommitteeMemberId) ||
				(myConferenceMemberId && s.conferenceMember?.id === myConferenceMemberId)
		);
		return speaker ? speaker.position : null;
	}

	let myPositionOnSpeakers = $derived(findMyPositionOnList(speakersList));
	let myPositionOnComments = $derived(findMyPositionOnList(commentList));

	async function handleSelfAdd(listId: string) {
		await client.mutate.selfAddToSpeakersList({
			__args: { speakersListId: listId },
			id: true,
			position: true
		});
	}

	async function handleSelfRemove(listId: string) {
		await client.mutate.selfRemoveFromSpeakersList({
			__args: { speakersListId: listId },
			id: true
		});
	}
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
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body gap-2 p-4">
				<IconInfoBox text={committee.activeAgendaItem?.title ?? '—'} faIcon="podium" />
				<IconInfoBox
					text={getCommitteeStatusText(committee.status)}
					faIcon={getCommitteeStatusIcon(committee.status)}
					committeeStatus={committee.status}
					until={new Date(committee.statusUntil)}
				/>
				{#if committee.statusHeadline}
					<div class="text-sm opacity-70">{committee.statusHeadline}</div>
				{/if}
			</div>
		</div>
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body gap-2 p-4">
				<h2 class="card-title text-lg">{m.majorities()}</h2>
				<Majorities
					totalPresent={committee.totalPresent}
					simpleMajority={committee.simpleMajority}
					twoThirdsMajority={committee.twoThirdsMajority}
					paperSupportThreshold={committee.paperSupportThreshold}
				/>
			</div>
		</div>

		<!-- Speakers List Card -->
		{#if isParticipant || role === 'SPECTATOR'}
			{#each [{ list: speakersList, label: m.speakersList(), myPosition: myPositionOnSpeakers }, { list: commentList, label: m.commentList(), myPosition: myPositionOnComments }] as { list, label, myPosition }}
				{#if list}
					<div class="card bg-base-100 shadow-sm">
						<div class="card-body gap-3 p-4">
							<h2 class="card-title text-lg">{label}</h2>

							<CurrentSpeaker speakersList={list} />

							<PresentationSpeakersQueue rawSpeakers={list.speakers} closed={list.isClosed} />

							<!-- Self-add/remove button -->
							{#if canSelfAdd}
								{#if myPosition !== null}
									<!-- Already on list -->
									<div class="flex w-full flex-col gap-2">
										{#if myPosition === 0}
											<span class="badge badge-success w-full">
												{m.youreUp()}
											</span>
										{:else}
											<span class="badge badge-primary w-full">
												{m.onListPosition({ position: String(myPosition) })}
											</span>
										{/if}
										<button
											class="btn btn-outline btn-error btn-sm w-full"
											onclick={() => handleSelfRemove(list.id)}
										>
											<i class="fas fa-minus mr-1"></i>
											{m.removeFromList()}
										</button>
									</div>
								{:else if list.isClosed}
									<div class="text-sm opacity-50">
										<i class="fas fa-lock mr-1"></i>
										{m.listClosedCannotAdd()}
									</div>
								{:else if role === 'DELEGATE' && !myPresent}
									<div class="text-sm opacity-50">
										<i class="fas fa-exclamation-triangle mr-1"></i>
										{m.notPresentCannotAdd()}
									</div>
								{:else}
									<button class="btn btn-primary btn-sm" onclick={() => handleSelfAdd(list.id)}>
										<i class="fas fa-plus mr-1"></i>
										{m.addMeToList()}
									</button>
								{/if}
							{/if}
						</div>
					</div>
				{/if}
			{/each}
		{/if}

		<!-- Whiteboard Card -->
		{#if committee.showWhiteboard && committee.whiteboardContent}
			<div class="card bg-base-100 shadow-sm">
				<div class="card-body p-4">
					<h2 class="card-title text-lg">{m.whiteboard()}</h2>
					<WhiteboardViewer data={committee.whiteboardContent} />
				</div>
			</div>
		{/if}
	</div>
{/if}
