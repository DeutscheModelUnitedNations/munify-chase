<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Grid, { GridItem } from 'svelte-grid-extended';
	import IconInfoBox from '$lib/components/IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import WhiteboardViewer from '$lib/components/whiteboard/WhiteboardViewer.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import {
		getPresentationLayoutPreset,
		type PresentationLayoutPresetOptions
	} from '$lib/data/presentationLayoutPresets';
	import AbbreviationInfoBox from '$lib/components/AbbreviationInfoBox.svelte';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import RegionalGroups from './RegionalGroups.svelte';
	import PresentationRollCall from '$lib/components/rollCall/PresentationRollCall.svelte';
	import ShowOfHandsVotingPresentation from '$lib/components/voting/ShowOfHandsVotingPresentation.svelte';
	import RollCallVotingPresentation from '$lib/components/voting/RollCallVotingPresentation.svelte';
	import PresentationResolutionPreview from '$lib/components/resolutions/PresentationResolutionPreview.svelte';
	import AdoptionConfetti from '$lib/components/AdoptionConfetti.svelte';
	import { sortTranslatedCountries } from '$lib/utils/nationTranslationHelper.svelte';
	import CurrentSpeaker from '$lib/components/speakersList/CurrentSpeaker.svelte';
	import SpeakersQueue from '$lib/components/speakersList/PresentationSpeakersQueue.svelte';
	import { browser } from '$app/environment';
	import { client } from '$lib/api/rumbleClient/client';
	import { page } from '$app/state';

	const committeeId = page.params.committeeId!;

	const committee = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		abbreviation: true,
		name: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		whiteboardContent: true,
		presentationLayout: true,
		presentationRootFontSize: true,
		presentationResolutionFontSize: true,
		displayRegionalGroups: true,
		currentOperativeIndex: true,
		activeDraftResolutionId: true,
		activeDraftResolution: { id: true, status: true },
		activeAmendmentId: true,
		activeAmendment: {
			id: true,
			type: true,
			documentNumber: true,
			targetClauseId: true,
			targetOperativeIndex: true,
			targetPosition: true,
			newContent: true,
			proposer: {
				id: true,
				representation: {
					id: true,
					name: true,
					alpha2Code: true,
					alpha3Code: true
				}
			}
		},
		lastResolutionAdoptionDate: true,
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
			id: true,
			title: true,
			logoSvg: true,
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

	const minAmendmentSponsors = $derived(Math.ceil((committee?.totalPresent ?? 0) * 0.1));

	const activePaperId = $derived(committee?.activeDraftResolutionId ?? null);

	let layout = $derived(
		getPresentationLayoutPreset(
			activePaperId != null
				? 'resolution'
				: ((committee?.presentationLayout as PresentationLayoutPresetOptions) ?? undefined)
		)
	);

	let speakersList = $derived(
		committee?.activeAgendaItem?.speakersList.find((x) => x.type === 'SPEAKERS_LIST')
	);

	let commentsList = $derived(
		committee?.activeAgendaItem?.speakersList.find((x) => x.type === 'COMMENT_LIST')
	);
	let speakersQueueResizeFn = $state<(() => void) | undefined>(undefined);
	let commentsQueueResizeFn = $state<(() => void) | undefined>(undefined);

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
		if (committee?.presentationRootFontSize) {
			document.documentElement.style.fontSize = `${committee.presentationRootFontSize}px`;
		}
	});

	$effect(() => {
		const handler = (event: MessageEvent) => {
			if (event.source !== window.opener) return;
			if (event.data !== 'toggle-fullscreen') return;
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen().catch(() => {});
			} else {
				document.exitFullscreen().catch(() => {});
			}
		};
		window.addEventListener('message', handler);
		return () => window.removeEventListener('message', handler);
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
					{minAmendmentSponsors}
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

		{#if layout.resolutionPreview && activePaperId}
			{@const gridProps = layout.resolutionPreview}
			<GridItem {...gridProps} class="card bg-base-100 overflow-auto p-4" id="resolution-preview">
				<PresentationResolutionPreview
					paperId={activePaperId}
					currentOperativeIndex={committee.activeDraftResolution?.status === 'AMENDMENT_PHASE' || committee.activeDraftResolution?.status === 'VOTING_PHASE'
						? committee.currentOperativeIndex
						: undefined}
					resolutionFontSize={committee.presentationResolutionFontSize ?? 16}
					showAmendments={committee.activeDraftResolution?.status === 'AMENDMENT_PHASE'}
					activeAmendment={committee.activeDraftResolution?.status === 'AMENDMENT_PHASE'
						? (committee.activeAmendment ?? null)
						: null}
				/>
			</GridItem>
		{/if}
	</Grid>

	<AdoptionConfetti lastAdoptionDate={committee.lastResolutionAdoptionDate} confettiDurationSec={45} />

	<RegionalGroups
		open={committee.displayRegionalGroups ?? false}
		committeeMembers={committee.members}
	/>

	<PresentationRollCall
		{committeeId}
		members={committee.members
			.filter((x) => x.representation?.type === 'DELEGATION')
			.sort((a, b) => sortTranslatedCountries(a.representation!, b.representation!))}
	/>

	<ShowOfHandsVotingPresentation {committeeId} />
	<RollCallVotingPresentation {committeeId} {committee} />
{:else}
	<UndrawError
		undrawImage={emptyStreet}
		title={m.committeeDoesNotExist()}
		buttonText={m.back()}
		buttonLink="/app"
	/>
{/if}
