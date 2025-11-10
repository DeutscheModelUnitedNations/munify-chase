<script lang="ts">
import { liveQuery } from "dexie";
import { type Component, onMount } from "svelte";
import Grid, { GridItem } from "svelte-grid-extended";
import { browser } from "$app/environment";
import emptyStreet from "$lib/assets/undraw/empty_street.svg";
import AbbreviationInfoBox from "$lib/components/AbbreviationInfoBox.svelte";
import AdoptionConfetti from "$lib/components/AdoptionConfetti.svelte";
import DevPlaceholder from "$lib/components/DevPlaceholder.svelte";
import IconInfoBox from "$lib/components/IconInfoBox.svelte";
import Majorities from "$lib/components/Majorities.svelte";
import PresentationRollCall from "$lib/components/rollCall/PresentationRollCall.svelte";
import CurrentSpeaker from "$lib/components/speakersList/CurrentSpeaker.svelte";
import SpeakersQueue from "$lib/components/speakersList/PresentationSpeakersQueue.svelte";
import UndrawError from "$lib/components/UndrawError.svelte";
import RollCallVotingPresentation from "$lib/components/voting/RollCallVotingPresentation.svelte";
import ShowOfHandsVotingPresentation from "$lib/components/voting/ShowOfHandsVotingPresentation.svelte";
import WhiteboardViewer from "$lib/components/whiteboard/WhiteboardViewer.svelte";
import { getPresentationLayoutPreset } from "$lib/data/presentationLayoutPresets";
import { localDB } from "$lib/local-db/localDB";
import { m } from "$lib/paraglide/messages";
import {
  getCommitteeStatusIcon,
  getCommitteeStatusText,
} from "$lib/utils/committeeStatus";
import { sortTranslatedCountries } from "$lib/utils/nationTranslationHelper.svelte";
import type { PageData } from "./$houdini";
import { PresentationSubscription } from "./committeeSubscription";
import RegionalGroups from "./RegionalGroups.svelte";

const { data }: { data: PageData } = $props();

const committeeQuery = $derived(data?.CommitteePresentationQuery);
const committee = $derived($committeeQuery.data?.findFirstCommittee);

const committeeSettings = liveQuery(() =>
  localDB.committeeSettings.get(data.committeeId),
);

const layout = $derived(
  ($committeeSettings &&
    getPresentationLayoutPreset($committeeSettings.layout)) ??
    getPresentationLayoutPreset(),
);

const speakersList = $derived(
  committee?.activeAgendaItem?.speakersList.find(
    (x) => x.type === "SPEAKERS_LIST",
  ),
);

const commentsList = $derived(
  committee?.activeAgendaItem?.speakersList.find(
    (x) => x.type === "COMMENT_LIST",
  ),
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

onMount(() => {
  PresentationSubscription.listen({ id: data.committeeId });
});

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
	</Grid>

	<RegionalGroups
		open={$committeeSettings?.displayRegionalGroups ?? false}
		committeeMembers={committee.members}
	/>

	<PresentationRollCall
		committeeId={data.committeeId}
		members={committee.members
			.filter((x) => x.representation?.type === 'DELEGATION')
			.sort((a, b) => sortTranslatedCountries(a.representation!, b.representation!))}
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
