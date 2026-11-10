<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { CommitteestatusEnum } from '#lib/api/rumbleClient/client';
	import { GridItem } from 'svelte-grid-extended';
	import IconInfoBox from '#lib/components/IconInfoBox.svelte';
	import AbbreviationInfoBox from '#lib/components/AbbreviationInfoBox.svelte';
	import Majorities from '#lib/components/Majorities.svelte';
	import WhiteboardViewer from '#lib/components/whiteboard/WhiteboardViewer.svelte';
	import { getCommitteeStatusIcon, getCommitteeStatusText } from '#lib/utils/committeeStatus';

	type Tile = ComponentProps<GridItem> | undefined;

	interface Props {
		layout: {
			committeeTitle?: Tile;
			committeeStatus?: Tile;
			agendaItem?: Tile;
			majorities?: Tile;
			whiteboard?: Tile;
		};
		committee: {
			name: string;
			abbreviation: string;
			status: CommitteestatusEnum;
			statusHeadline: string;
			statusUntil: Date | string;
			totalPresent: number;
			simpleMajority: number;
			twoThirdsMajority: number;
			whiteboardContent?: string | null;
		};
		agendaItemTitle: string | null | undefined;
		minAmendmentSponsors: number;
	}
	let { layout, committee, agendaItemTitle, minAmendmentSponsors }: Props = $props();

	const tileClass = 'card bg-base-100 gap-2 overflow-hidden p-4';
</script>

{#if layout.committeeTitle}
	<GridItem {...layout.committeeTitle} class={tileClass} id="committee-title">
		<AbbreviationInfoBox text={committee.name || '—'} abbreviation={committee.abbreviation} />
	</GridItem>
{/if}
{#if layout.committeeStatus}
	<GridItem {...layout.committeeStatus} class={tileClass} id="committee-status">
		<IconInfoBox
			text={committee.statusHeadline || getCommitteeStatusText(committee.status)}
			icon={getCommitteeStatusIcon(committee.status)}
			committeeStatus={committee.status}
			until={new Date(committee.statusUntil)}
			fullHeight
			hideCountdown={committee.status === 'FORMAL'}
		/>
	</GridItem>
{/if}
{#if layout.agendaItem}
	<GridItem {...layout.agendaItem} class={tileClass} id="agenda-item">
		<IconInfoBox text={agendaItemTitle || '—'} icon="lectern" fullHeight />
	</GridItem>
{/if}
{#if layout.majorities}
	<GridItem {...layout.majorities} class={tileClass} id="majorities">
		<Majorities
			totalPresent={committee.totalPresent}
			simpleMajority={committee.simpleMajority}
			twoThirdsMajority={committee.twoThirdsMajority}
			{minAmendmentSponsors}
		/>
	</GridItem>
{/if}
{#if layout.whiteboard}
	<GridItem {...layout.whiteboard} class={tileClass} id="whiteboard">
		<WhiteboardViewer data={committee.whiteboardContent} />
	</GridItem>
{/if}
