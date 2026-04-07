<script lang="ts">
	import DevPlaceholder from '$lib/components/DevPlaceholder.svelte';
	import { m } from '$lib/paraglide/messages';
	import Grid, { GridItem } from 'svelte-grid-extended';
	import IconInfoBox from '$lib/components/IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import WhiteboardViewer from '$lib/components/whiteboard/WhiteboardViewer.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import { liveQuery } from 'dexie';
	import { localDB } from '$lib/local-db/localDB';
	import { getPresentationLayoutPreset } from '$lib/data/presentationLayoutPresets';
	import AbbreviationInfoBox from '$lib/components/AbbreviationInfoBox.svelte';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import RegionalGroups from './RegionalGroups.svelte';
	import PresentationRollCall from '$lib/components/rollCall/PresentationRollCall.svelte';
	import { sortTranslatedCountries } from '$lib/utils/nationTranslationHelper.svelte';
	import CurrentSpeaker from '$lib/components/speakersList/CurrentSpeaker.svelte';
	import SpeakersQueue from '$lib/components/speakersList/PresentationSpeakersQueue.svelte';
	import ShowOfHandsVotingPresentation from '$lib/components/voting/ShowOfHandsVotingPresentation.svelte';
	import RollCallVotingPresentation from '$lib/components/voting/RollCallVotingPresentation.svelte';
	import { browser } from '$app/environment';
	import AdoptionConfetti from '$lib/components/AdoptionConfetti.svelte';
	import PresentationResolutionPreview from './PresentationResolutionPreview.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';

	const committeeId = page.params.committeeId!;

	const committee: any = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		abbreviation: true,
		name: true,
		resolutionHeadline: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		paperSupportThreshold: true,
		lastResolutionAdoptionDate: true,
		activeDraftResolutionId: true,
		currentOperativeIndex: true,
		currentOperativeClauseId: true,
		activeAmendmentId: true,
		activeAmendment: {
			id: true,
			type: true,
			status: true,
			documentNumber: true,
			targetClauseId: true,
			targetOperativeIndex: true,
			targetPosition: true,
			newContent: true,
			proposer: {
				id: true,
				representation: {
					name: true,
					alpha2Code: true,
					alpha3Code: true
				}
			}
		},
		activeDraftResolution: {
			id: true,
			content: true,
			documentNumber: true,
			status: true,
			title: true,
			updatedAt: true,
			agendaItem: {
				id: true,
				title: true
			},
			creator: {
				id: true,
				representation: {
					name: true,
					alpha2Code: true,
					alpha3Code: true
				}
			},
			sponsors: {
				id: true,
				committeeMember: {
					representation: {
						name: true,
						alpha3Code: true
					}
				}
			},
			amendments: {
				id: true,
				type: true,
				status: true,
				documentNumber: true,
				targetClauseId: true,
				targetOperativeIndex: true,
				targetPosition: true,
				newContent: true,
				proposer: {
					id: true,
					representation: {
						name: true
					}
				}
			},
			operativeClauseVotes: {
				id: true,
				clauseId: true,
				outcome: true
			},
			voteResult: {
				outcome: true,
				votesFor: true,
				votesAgainst: true,
				votesAbstain: true
			}
		},
		whiteboardContent: true,
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
							type: true,
							name: true,
							regionalGroup: true,
							alpha2Code: true,
							alpha3Code: true,
							faIcon: true
						},
						present: true
					},
					conferenceMember: {
						id: true,
						representation: {
							id: true,
							type: true,
							name: true,
							regionalGroup: true,
							alpha2Code: true,
							alpha3Code: true,
							faIcon: true
						}
					}
				}
			}
		},
		members: {
			id: true,
			present: true,
			representation: {
				id: true,
				type: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				regionalGroup: true,
				faIcon: true
			}
		},
		conference: {
			title: true,
			resolutionFeatureEnabled: true,
			uniqueConferenceMembers: {
				id: true,
				representation: {
					id: true,
					type: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true,
					faIcon: true
				}
			}
		}
	});

	let committeeSettings = liveQuery(() => localDB.committeeSettings.get(committeeId));

	let layout = $derived(
		($committeeSettings && getPresentationLayoutPreset($committeeSettings.layout)) ??
			getPresentationLayoutPreset()
	);

	let speakersList = $derived(
		committee?.activeAgendaItem?.speakersList.find((x: any) => x.type === 'SPEAKERS_LIST')
	);

	let commentsList = $derived(
		committee?.activeAgendaItem?.speakersList.find((x: any) => x.type === 'COMMENT_LIST')
	);
	let speakersQueueResizeFn: () => void;
	let commentsQueueResizeFn: () => void;

	$effect(() => {
		if (!layout || !committee) {
			return;
		}
		resizeQueues();
	});

	const resizeQueues = () => {
		speakersQueueResizeFn?.();
		commentsQueueResizeFn?.();
	};

	$effect(() => {
		if ($committeeSettings?.presentationRootFontSize) {
			document.documentElement.style.fontSize = `${$committeeSettings.presentationRootFontSize}px`;
		}
	});
</script>

<svelte:head>
	<title>{committee?.abbreviation ?? 'N/A'} {m.presentationMode()} - MUNify CHASE</title>
</svelte:head>

{#if committee}
	<Grid
		itemSize={{ height: browser ? window.innerHeight / 16 : 60 }}
		cols={12}
		on:change={resizeQueues}
		collision="none"
	>
		{#if layout.committeeTitle}
			{@const gridProps = layout.committeeTitle}
			<GridItem
				{...gridProps}
				class="card bg-base-100 gap-2 overflow-hidden p-4"
				id="committee-title"
			>
				<AbbreviationInfoBox text={committee.name || '—'} abbreviation={committee.abbreviation} />
			</GridItem>
		{/if}
		{#if layout.committeeStatus}
			{@const gridProps = layout.committeeStatus}
			<GridItem
				{...gridProps}
				class="card bg-base-100 gap-2 overflow-hidden p-4"
				id="committee-status"
			>
				<IconInfoBox
					text={committee.statusHeadline.length > 0
						? committee.statusHeadline
						: getCommitteeStatusText(committee.status)}
					faIcon={getCommitteeStatusIcon(committee.status)}
					committeeStatus={committee.status}
					marqueeOnOverflow={false}
					until={new Date(committee.statusUntil)}
					fullHeight
					hideCountdown={committee.status === 'FORMAL'}
				/>
			</GridItem>
		{/if}
		{#if layout.agendaItem}
			{@const gridProps = layout.agendaItem}
			<GridItem {...gridProps} class="card bg-base-100 gap-2 overflow-hidden p-4" id="agenda-item">
				<IconInfoBox text={committee.activeAgendaItem?.title || '—'} faIcon="podium" fullHeight />
			</GridItem>
		{/if}
		{#if layout.majorities}
			{@const gridProps = layout.majorities}
			<GridItem {...gridProps} class="card bg-base-100 gap-2 overflow-hidden p-4" id="majorities">
				<Majorities
					totalPresent={committee.totalPresent}
					simpleMajority={committee.simpleMajority}
					twoThirdsMajority={committee.twoThirdsMajority}
					paperSupportThreshold={committee.paperSupportThreshold}
				/>
			</GridItem>
		{/if}

		{#if layout.whiteboard}
			{@const gridProps = layout.whiteboard}
			<GridItem {...gridProps} class="card bg-base-100 gap-2 overflow-hidden p-4" id="whiteboard">
				<WhiteboardViewer data={committee.whiteboardContent} />
			</GridItem>
		{/if}

		{#if layout.speakersList}
			{@const gridProps = layout.speakersList}
			<GridItem
				{...gridProps}
				class="card bg-base-100 gap-8 overflow-hidden p-4"
				id="speakers-list"
			>
				<CurrentSpeaker {speakersList} />
				<SpeakersQueue
					rawSpeakers={speakersList?.speakers}
					closed={speakersList?.isClosed}
					bind:resizeFn={speakersQueueResizeFn}
				/>
			</GridItem>
		{/if}

		{#if layout.commentsList}
			{@const gridProps = layout.commentsList}
			<GridItem {...gridProps} class="card bg-base-100 gap-8 overflow-hidden p-4" id="comment-list">
				<CurrentSpeaker speakersList={commentsList} />
				<SpeakersQueue
					rawSpeakers={commentsList?.speakers}
					closed={commentsList?.isClosed}
					bind:resizeFn={commentsQueueResizeFn}
				/>
			</GridItem>
		{/if}

		{#if layout.resolutionPreview}
			{@const gridProps = layout.resolutionPreview}
			<GridItem {...gridProps} class="card bg-base-100 overflow-auto p-4" id="resolution-preview">
				<PresentationResolutionPreview
					{committee}
					resolutionFontSize={$committeeSettings?.presentationResolutionFontSize ?? 16}
				/>
			</GridItem>
		{/if}
	</Grid>

	<RegionalGroups
		open={$committeeSettings?.displayRegionalGroups ?? false}
		committeeMembers={committee.members}
	/>

	<PresentationRollCall
		{committeeId}
		members={committee.members
			.filter((x: any) => x.representation?.type === 'DELEGATION')
			.sort((a: any, b: any) => sortTranslatedCountries(a.representation!, b.representation!))}
	/>

	<ShowOfHandsVotingPresentation committeeSettings={$committeeSettings} />
	<RollCallVotingPresentation committeeSettings={$committeeSettings} {committee} />

	<AdoptionConfetti
		lastAdoptionDate={committee?.lastResolutionAdoptionDate}
		agendaItem={committee?.activeAgendaItem?.title ?? m.unknown()}
		committeeName={committee?.name ?? m.unknown()}
		confettiDurationSec={90}
	/>
{:else}
	<UndrawError
		undrawImage={emptyStreet}
		title={m.committeeDoesNotExist()}
		buttonText={m.back()}
		buttonLink="/app"
	/>
{/if}
