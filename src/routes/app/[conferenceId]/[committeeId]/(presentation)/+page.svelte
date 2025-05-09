<script lang="ts">
	import DevPlaceholder from '$lib/components/DevPlaceholder.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { PageData } from './$houdini';
	import Grid, { GridItem } from 'svelte-grid-extended';
	import IconInfoBox from '$lib/components/IconInfoBox.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '$lib/utils/committeeStatus';
	import WhiteboardViewer from '$lib/components/whiteboard/WhiteboardViewer.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import { onMount } from 'svelte';
	import { liveQuery } from 'dexie';
	import { localDB } from '$lib/local-db/localDB';
	import { getPresentationLayoutPreset } from '$lib/data/presentationLayoutPresets';
	import { graphql } from '$houdini';
	import AbbreviationInfoBox from '$lib/components/AbbreviationInfoBox.svelte';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import RegionalGroups from './RegionalGroups.svelte';

	let { data }: { data: PageData } = $props();

	let committeeQuery = $derived(data?.CommitteePresentationQuery);
	let committee = $derived($committeeQuery.data?.findFirstCommittee);

	let committeeSettings = liveQuery(() => localDB.committeeSettings.get(data.committeeId));

	let layout = $derived(
		($committeeSettings && getPresentationLayoutPreset($committeeSettings.layout)) ??
			getPresentationLayoutPreset()
	);

	let itemSize = $derived({ height: 60 });

	let presentationSub = graphql(`
		subscription PresentationSubscription($id: ID!) {
			findFirstCommittee(where: { id: $id }) {
				id
				abbreviation
				name
				stateOfDebate
				status
				statusHeadline
				statusUntil
				totalPresent
				simpleMajority
				twoThirdsMajority
				paperSupportThreshold
				activeAgendaItem {
					id
					title
				}
				agendaItems {
					id
					title
				}
				whiteboardContent
			}
		}
	`);

	onMount(() => {
		presentationSub.listen({ id: data.committeeId });
	});
</script>

{#if committee}
	<Grid {itemSize} cols={12}>
		{#if layout.committeeTitle}
			{@const gridProps = layout.committeeTitle}
			<GridItem
				{...gridProps}
				class="card bg-base-100 gap-2 overflow-hidden p-4"
				id="committee-title"
			>
				<AbbreviationInfoBox
					text={committee.activeAgendaItem?.title || '—'}
					abbreviation={committee.abbreviation}
				/>
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
			<GridItem {...gridProps} class="card bg-base-100 gap-2 overflow-hidden p-4" id="speakers-list"
			></GridItem>
		{/if}

		{#if layout.commentsList}
			{@const gridProps = layout.commentsList}
			<GridItem {...gridProps} class="card bg-base-100 gap-2 overflow-hidden p-4" id="comment-list"
			></GridItem>
		{/if}
	</Grid>

	<RegionalGroups
		open={$committeeSettings?.displayRegionalGroups ?? false}
		committeeMembers={committee.members}
	/>
{:else}
	<UndrawError
		undrawImage={emptyStreet}
		title={m.committeeDoesNotExist()}
		buttonText={m.back()}
		buttonLink="/app"
	/>
{/if}
