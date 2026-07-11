<script lang="ts">
	import { onDestroy } from 'svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import {
		ResolutionPreview,
		OperativeParagraphPreview,
		serializeClause,
		type ResolutionHeaderData,
		type OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import {
		englishPreamblePhrases,
		englishOperativePhrases
	} from '@deutschemodelunitednations/munify-resolution-editor/phrases';
	import { createPaperYjsClient, type PaperYjsClient } from '$lib/api/yjs/createPaperYjs.svelte';
	import { toAmendmentOverlays } from './paperContext';
	import { svgToDataUrl } from '$lib/utils/svgToDataUrl';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { m } from '$lib/paraglide/messages';

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
		__args: { where: { resolutionPapers: { id: paperId } } },
		id: true,
		name: true,
		abbreviation: true,
		conference: { title: true, logoSvg: true }
	});
	const committee = $derived(committees?.[0]);

	// ---- Paper metadata (for header) ----------------------------------------
	const papers = await client.liveQuery.resolutionPapers({
		__args: { where: { id: paperId } },
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
	const amendmentRows = await client.liveQuery.amendments({
		__args: { where: { paper: { id: paperId } } },
		id: true,
		type: true,
		status: true,
		targetClauseId: true,
		targetOperativeIndex: true,
		targetPosition: true,
		newContent: true,
		proposer: { id: true, representation: { id: true, name: true, alpha2Code: true } },
		sponsors: { id: true }
	});
	const clauseVotes = await client.liveQuery.operativeClauseVotes({
		__args: { where: { paper: { id: paperId } } },
		id: true,
		clauseId: true,
		vote: { id: true, outcome: true }
	});

	const overlays = $derived(showAmendments ? toAmendmentOverlays(amendmentRows) : undefined);
	const rejectedClauseIds = $derived(
		(clauseVotes ?? []).filter((v) => v.vote?.outcome === 'REJECTED').map((v) => v.clauseId)
	);

	// ---- Header data (mirrors PaperPage.svelte) -----------------------------
	const headerData = $derived<ResolutionHeaderData>({
		conferenceTitle: committee?.conference?.title ?? undefined,
		conferenceEmblem: svgToDataUrl(committee?.conference?.logoSvg),
		committeeAbbreviation: committee?.abbreviation ?? undefined,
		committeeFullName: committee?.name ?? undefined,
		documentNumber: paper?.documentNumber ?? undefined,
		topic: paper?.agendaItem?.title ?? undefined,
		authoringDelegation:
			getTranslatedCountryNameFromAlpha3Code(
				paper?.creatorCommitteeMember?.representation?.alpha3Code
			) ??
			paper?.creatorCommitteeMember?.representation?.name ??
			undefined,
		sponsoringDelegations: (paper?.sponsors ?? []).map(
			(s) =>
				getTranslatedCountryNameFromAlpha3Code(s.committeeMember?.representation?.alpha3Code) ??
				s.committeeMember?.representation?.name ??
				''
		),
		lastEdited: paper?.updatedAt ?? undefined
	});

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
	const resolvedActiveAmendIdx = $derived.by(() => {
		if (!activeAmendment || !resolution) return -1;
		if (activeAmendment.targetClauseId) {
			const idx = resolution.operative.findIndex((c) => c.id === activeAmendment.targetClauseId);
			if (idx !== -1) return idx;
		}
		return activeAmendment.targetOperativeIndex ?? -1;
	});

	function getAmendmentTypeLabel(type: string): string {
		switch (type) {
			case 'DELETE':
				return m.deleteClausePresentation();
			case 'ALTER_TEXT':
				return m.alterClausePresentation();
			case 'ADD':
				return m.addClausePresentation();
			case 'ALTER_POSITION':
				return m.moveClausePresentation();
			default:
				return type;
		}
	}

	function getAmendmentTypeBadge(type: string): string {
		switch (type) {
			case 'DELETE':
				return 'badge-error';
			case 'ALTER_TEXT':
				return 'badge-warning';
			case 'ADD':
				return 'bg-green-700 text-white border-0';
			case 'ALTER_POSITION':
				return 'badge-info';
			default:
				return 'badge-ghost';
		}
	}

	function singleClauseResolution(clause: OperativeClause) {
		return { committeeName: committee?.name ?? '', preamble: [], operative: [clause] };
	}

	function getProposerName(proposer: ActiveAmendment['proposer']): string {
		if (!proposer?.representation) return '';
		return (
			getTranslatedCountryNameFromAlpha3Code(proposer.representation.alpha3Code) ??
			proposer.representation.name ??
			''
		);
	}
</script>

{#if resolution}
	{#if activeAmendment}
		<!-- Active amendment: focused full-area display -->
		<div
			class="resolution-font-size-wrapper flex h-full w-full flex-col gap-5 overflow-hidden p-4"
			style="--resolution-font-size: {resolutionFontSize}px"
		>
			<!-- Header row -->
			<div class="flex flex-wrap items-center gap-3 border-b-2 border-base-300 pb-3">
				<div class="flex flex-col">
					<span
						class="badge badge-lg {getAmendmentTypeBadge(
							activeAmendment.type
						)} h-auto px-4 py-2 text-xl font-bold"
					>
						{getAmendmentTypeLabel(activeAmendment.type)}
					</span>
					{#if activeAmendment.documentNumber}
						<span class="font-mono text-base-content/60 text-lg"
							>{activeAmendment.documentNumber}</span
						>
					{/if}
				</div>
				<span class="flex-1 text-center text-2xl font-semibold"
					>{m.proposedAmendmentPresentation()}</span
				>
				{#if activeAmendment.proposer?.representation}
					<div
						class="ml-auto flex items-center gap-2 rounded-box bg-base-200 py-1 pl-1 pr-3 text-base"
					>
						<Flag representation={activeAmendment.proposer.representation} size="sm" />
						<span class="font-medium">{getProposerName(activeAmendment.proposer)}</span>
					</div>
				{/if}
			</div>

			{#if activeAmendment.type === 'DELETE' && resolvedActiveAmendIdx >= 0}
				{@const targetClause = resolution.operative[resolvedActiveAmendIdx]}
				<div
					class="mx-auto flex w-fit items-center gap-2 rounded-full bg-error px-4 py-2 text-error-content"
				>
					<i class="fas fa-trash-can text-lg"></i>
					<span class="text-lg font-semibold"
						>{m.operativeClausePresentation()} {resolvedActiveAmendIdx + 1}</span
					>
				</div>
				{#if targetClause}
					<div
						class="flex-1 overflow-auto rounded-lg border-2 border-error/30 border-l-4 border-l-error bg-white p-4 opacity-70 line-through decoration-error decoration-4"
					>
						<ResolutionPreview
							resolution={singleClauseResolution(targetClause)}
							labels={englishLabels}
							preamblePhrases={englishPreamblePhrases}
							operativePhrases={englishOperativePhrases}
						>
							{#snippet previewHeader()}{/snippet}
						</ResolutionPreview>
					</div>
				{/if}
			{:else if activeAmendment.type === 'ALTER_TEXT' && resolvedActiveAmendIdx >= 0}
				{@const targetClause = resolution.operative[resolvedActiveAmendIdx]}
				<div
					class="mx-auto flex w-fit items-center gap-2 rounded-full bg-warning px-4 py-2 text-warning-content"
				>
					<i class="fas fa-pen-to-square text-lg"></i>
					<span class="text-lg font-semibold"
						>{m.operativeClausePresentation()} {resolvedActiveAmendIdx + 1}</span
					>
				</div>
				<div class="flex-1 overflow-auto p-4">
					{#if activeAmendment.newContent}
						<div
							class="rounded-lg border-2 border-warning/30 border-l-4 border-l-warning bg-white p-4 pt-6"
						>
							<OperativeParagraphPreview
								markup={activeAmendment.newContent}
								oldMarkup={targetClause ? serializeClause(targetClause) : undefined}
								showDiff
								operativeNumber={resolvedActiveAmendIdx + 1}
								labels={englishLabels}
							/>
						</div>
					{/if}
				</div>
			{:else if activeAmendment.type === 'ADD'}
				<div
					class="mx-auto flex w-fit items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-white"
				>
					<i class="fas fa-plus text-lg"></i>
					<span class="text-lg font-semibold"
						>{m.insertAfterPresentation({ index: (activeAmendment.targetPosition ?? 0) + 1 })}</span
					>
				</div>
				<div class="flex-1 overflow-auto p-4">
					{#if activeAmendment.newContent}
						<div
							class="rounded-lg border-2 border-green-700/40 border-l-4 border-l-green-700 bg-white p-4 pt-6"
						>
							<OperativeParagraphPreview
								markup={activeAmendment.newContent}
								operativeNumber={(activeAmendment.targetPosition ?? 0) + 2}
								labels={englishLabels}
							/>
						</div>
					{/if}
				</div>
			{:else if activeAmendment.type === 'ALTER_POSITION' && resolvedActiveAmendIdx >= 0}
				{@const targetClause = resolution.operative[resolvedActiveAmendIdx]}
				<div class="flex flex-1 flex-col items-center justify-center gap-6 overflow-auto p-4">
					<div
						class="flex w-fit items-center gap-2 rounded-full bg-info px-4 py-2 text-info-content"
					>
						<i class="fas fa-arrows-up-down text-lg"></i>
						<span class="text-lg font-semibold"
							>{m.operativeClausePresentation()} {resolvedActiveAmendIdx + 1}</span
						>
					</div>
					{#if targetClause}
						<div
							class="w-full rounded-lg border-2 border-info/30 border-l-4 border-l-info bg-white p-4"
						>
							<ResolutionPreview
								resolution={singleClauseResolution(targetClause)}
								labels={englishLabels}
								preamblePhrases={englishPreamblePhrases}
								operativePhrases={englishOperativePhrases}
							>
								{#snippet previewHeader()}{/snippet}
							</ResolutionPreview>
						</div>
					{/if}
					<div class="flex items-center gap-3 rounded-full bg-info px-6 py-3 text-info-content">
						<i class="fas fa-arrow-down text-2xl"></i>
						<span class="text-xl font-semibold"
							>{m.moveToPositionPresentation({
								position: (activeAmendment.targetPosition ?? 0) + 1
							})}</span
						>
					</div>
				</div>
			{/if}
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
							<i class="fas fa-gavel"></i>
						</div>
					{/if}
				{/snippet}
			</ResolutionPreview>
		</div>
	{/if}
{/if}

<style>
	.resolution-font-size-wrapper :global(.resolution-preview),
	.resolution-font-size-wrapper :global(.operative-paragraph-preview) {
		font-size: var(--resolution-font-size) !important;
	}
</style>
