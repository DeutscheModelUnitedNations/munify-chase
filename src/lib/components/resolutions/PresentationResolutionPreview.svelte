<script lang="ts">
	import { onDestroy } from 'svelte';
	import { client } from '#lib/api/rumbleClient/client';
	import {
		ResolutionPreview,
		OperativeParagraphPreview,
		serializeClause,
		type OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import {
		englishPreamblePhrases,
		englishOperativePhrases
	} from '@deutschemodelunitednations/munify-resolution-editor/phrases';
	import { createPaperYjsClient, type PaperYjsClient } from '#lib/api/yjs/createPaperYjs.svelte';
	import { toAmendmentOverlays } from './paperContext';
	import { rejectedClauseIdsOf } from './paperPageState';
	import { fetchClauseVoteOutcomes, fetchOverlayAmendments } from './paperOverlays';
	import { delegationName, resolutionHeaderData } from './resolutionHeader';
	import { amendmentClauseIndex, presentationAmendmentType } from './presentationAmendment';
	import Flag from '#lib/components/Flag.svelte';
	import { m } from '#lib/paraglide/messages';

	interface ActiveAmendment {
		id: string;
		type: string;
		documentNumber?: string | null;
		targetClauseId?: string | null;
		targetOperativeIndex?: number | null;
		targetPosition?: number | null;
		newContent?: string | null;
		proposer?: {
			id?: string;
			representation?: {
				id?: string;
				name?: string | null;
				alpha2Code?: string | null;
				alpha3Code?: string | null;
			} | null;
		} | null;
	}

	interface Props {
		paperId: string;
		/** Only highlight the active clause during AMENDMENT_PHASE. */
		currentOperativeIndex?: number | null;
		/** Only show amendment overlays during AMENDMENT_PHASE. */
		showAmendments?: boolean;
		resolutionFontSize?: number;
		/** When set, switches to focused amendment display. */
		activeAmendment?: ActiveAmendment | null;
	}

	let {
		paperId,
		currentOperativeIndex = null,
		showAmendments = false,
		resolutionFontSize = 16,
		activeAmendment = null
	}: Props = $props();

	// ---- Y.js live document -------------------------------------------------
	let yClient = $state<PaperYjsClient | null>(null);
	$effect(() => {
		const created = createPaperYjsClient({
			paperId,
			user: { id: 'presentation', name: 'Presentation', color: undefined }
		});
		yClient = created;
		return () => void created.destroy();
	});
	onDestroy(() => void yClient?.destroy());

	const resolution = $derived(yClient?.store.snapshot ?? null);

	// ---- Committee + conference data (for header) ---------------------------
	const committees = await client.liveQuery.committees({
		__args: { where: { resolutionPapers: { id: { eq: paperId } } } },
		id: true,
		name: true,
		abbreviation: true,
		conference: { title: true, logoSvg: true }
	});
	const committee = $derived(committees?.[0]);

	// ---- Paper metadata (for header) ----------------------------------------
	const papers = await client.liveQuery.resolutionPapers({
		__args: { where: { id: { eq: paperId } } },
		id: true,
		documentNumber: true,
		updatedAt: true,
		agendaItem: { title: true },
		creatorCommitteeMember: {
			representation: { id: true, name: true, alpha3Code: true }
		},
		sponsors: {
			id: true,
			committeeMember: {
				representation: { id: true, name: true, alpha3Code: true }
			}
		}
	});
	const paper = $derived(papers?.[0]);

	// ---- Amendment overlays + rejected clauses ------------------------------
	const amendmentRows = await fetchOverlayAmendments(paperId);
	const clauseVotes = await fetchClauseVoteOutcomes(paperId);

	const overlays = $derived(showAmendments ? toAmendmentOverlays(amendmentRows) : undefined);
	const rejectedClauseIds = $derived(rejectedClauseIdsOf(clauseVotes ?? []));

	// ---- Header data (shared with PaperPage.svelte) ------------------------
	const headerData = $derived(resolutionHeaderData({ committee, paper }));

	// ---- Active clause for gavel marker + auto-scroll ----------------------
	const activeClauseId = $derived(
		resolution && currentOperativeIndex != null
			? (resolution.operative[currentOperativeIndex]?.id ?? null)
			: null
	);

	function scrollClauseIntoView(node: HTMLElement) {
		const clauseEl = node.parentElement?.parentElement;
		clauseEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	// ---- Active amendment helpers ------------------------------------------
	const resolvedActiveAmendIdx = $derived(
		amendmentClauseIndex({ amendment: activeAmendment, operative: resolution?.operative })
	);

	function singleClauseResolution(clause: OperativeClause) {
		return { committeeName: committee?.name ?? '', preamble: [], operative: [clause] };
	}
</script>

{#if resolution}
	{#if activeAmendment}
		<!-- Active amendment: focused full-area display -->
		<div
			class="resolution-font-size-wrapper flex h-full w-full flex-col gap-5 overflow-hidden p-4"
			style="--resolution-font-size: {resolutionFontSize}px"
		>
			{@render amendmentHeader(activeAmendment)}
			{@render amendmentBody(activeAmendment, resolution.operative[resolvedActiveAmendIdx])}
		</div>
	{:else}
		<!-- Normal full resolution preview with amendment overlays -->
		<div
			class="resolution-font-size-wrapper h-full w-full overflow-auto p-8 [&_.active-clause]:bg-warning/10"
			style="--resolution-font-size: {resolutionFontSize}px"
		>
			<ResolutionPreview
				{resolution}
				{headerData}
				labels={englishLabels}
				preamblePhrases={englishPreamblePhrases}
				operativePhrases={englishOperativePhrases}
				amendments={overlays}
				{rejectedClauseIds}
			>
				{#snippet afterOperativeClause({ clause })}
					{#if clause.id === activeClauseId}
						<span use:scrollClauseIntoView></span>
						<div class="badge badge-warning badge-sm gap-1">
							<i aria-hidden="true" class="ph-fill ph-gavel"></i>
						</div>
					{/if}
				{/snippet}
			</ResolutionPreview>
		</div>
	{/if}
{/if}

{#snippet amendmentHeader(amendment: ActiveAmendment)}
	{@const type = presentationAmendmentType(amendment.type)}
	<div class="flex flex-wrap items-center gap-3 border-b-2 border-base-300 pb-3">
		<div class="flex flex-col">
			<span class="badge badge-lg {type.badge} h-auto px-4 py-2 text-xl font-bold">
				{type.label}
			</span>
			{#if amendment.documentNumber}
				<span class="font-mono text-base-content/60 text-lg">{amendment.documentNumber}</span>
			{/if}
		</div>
		<span class="flex-1 text-center text-2xl font-semibold"
			>{m.proposedAmendmentPresentation()}</span
		>
		{#if amendment.proposer?.representation}
			<div class="ml-auto flex items-center gap-2 rounded-box bg-base-200 py-1 pl-1 pr-3 text-base">
				<Flag representation={amendment.proposer.representation} size="sm" />
				<span class="font-medium">{delegationName(amendment.proposer.representation) ?? ''}</span>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet amendmentBody(amendment: ActiveAmendment, targetClause: OperativeClause | undefined)}
	{#if amendment.type === 'ADD'}
		{@render addedClause(amendment)}
	{:else if resolvedActiveAmendIdx < 0}
		<!-- the target clause is gone: only the header is shown -->
	{:else if amendment.type === 'DELETE'}
		{@render clausePill('bg-error text-error-content', 'trash')}
		{#if targetClause}
			<div
				class="flex-1 overflow-auto rounded-lg border-2 border-error/30 border-l-4 border-l-error bg-white p-4 opacity-70 line-through decoration-error decoration-4"
			>
				{@render clausePreview(targetClause)}
			</div>
		{/if}
	{:else if amendment.type === 'ALTER_TEXT'}
		{@render alteredClause(amendment, targetClause)}
	{:else if amendment.type === 'ALTER_POSITION'}
		{@render movedClause(amendment, targetClause)}
	{/if}
{/snippet}

{#snippet clausePill(colors: string, icon: string)}
	<div class="mx-auto flex w-fit items-center gap-2 rounded-full {colors} px-4 py-2">
		<i aria-hidden="true" class="ph-fill ph-{icon} text-lg"></i>
		<span class="text-lg font-semibold"
			>{m.operativeClausePresentation()} {resolvedActiveAmendIdx + 1}</span
		>
	</div>
{/snippet}

{#snippet clausePreview(clause: OperativeClause)}
	<ResolutionPreview
		resolution={singleClauseResolution(clause)}
		labels={englishLabels}
		preamblePhrases={englishPreamblePhrases}
		operativePhrases={englishOperativePhrases}
	>
		{#snippet previewHeader()}{/snippet}
	</ResolutionPreview>
{/snippet}

{#snippet alteredClause(amendment: ActiveAmendment, targetClause: OperativeClause | undefined)}
	{@render clausePill('bg-warning text-warning-content', 'note-pencil')}
	<div class="flex-1 overflow-auto p-4">
		{#if amendment.newContent}
			<div
				class="rounded-lg border-2 border-warning/30 border-l-4 border-l-warning bg-white p-4 pt-6"
			>
				<OperativeParagraphPreview
					markup={amendment.newContent}
					oldMarkup={targetClause ? serializeClause(targetClause) : undefined}
					showDiff
					operativeNumber={resolvedActiveAmendIdx + 1}
					labels={englishLabels}
				/>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet addedClause(amendment: ActiveAmendment)}
	<div class="mx-auto flex w-fit items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-white">
		<i aria-hidden="true" class="ph-fill ph-plus text-lg"></i>
		<span class="text-lg font-semibold"
			>{m.insertAfterPresentation({ index: (amendment.targetPosition ?? 0) + 1 })}</span
		>
	</div>
	<div class="flex-1 overflow-auto p-4">
		{#if amendment.newContent}
			<div
				class="rounded-lg border-2 border-green-700/40 border-l-4 border-l-green-700 bg-white p-4 pt-6"
			>
				<OperativeParagraphPreview
					markup={amendment.newContent}
					operativeNumber={(amendment.targetPosition ?? 0) + 2}
					labels={englishLabels}
				/>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet movedClause(amendment: ActiveAmendment, targetClause: OperativeClause | undefined)}
	<div class="flex flex-1 flex-col items-center justify-center gap-6 overflow-auto p-4">
		<div class="flex w-fit items-center gap-2 rounded-full bg-info px-4 py-2 text-info-content">
			<i aria-hidden="true" class="ph-fill ph-arrows-down-up text-lg"></i>
			<span class="text-lg font-semibold"
				>{m.operativeClausePresentation()} {resolvedActiveAmendIdx + 1}</span
			>
		</div>
		{#if targetClause}
			<div class="w-full rounded-lg border-2 border-info/30 border-l-4 border-l-info bg-white p-4">
				{@render clausePreview(targetClause)}
			</div>
		{/if}
		<div class="flex items-center gap-3 rounded-full bg-info px-6 py-3 text-info-content">
			<i aria-hidden="true" class="ph-fill ph-arrow-down text-2xl"></i>
			<span class="text-xl font-semibold"
				>{m.moveToPositionPresentation({
					position: (amendment.targetPosition ?? 0) + 1
				})}</span
			>
		</div>
	</div>
{/snippet}

<style>
	.resolution-font-size-wrapper :global(.resolution-preview),
	.resolution-font-size-wrapper :global(.operative-paragraph-preview) {
		font-size: var(--resolution-font-size) !important;
	}
</style>
