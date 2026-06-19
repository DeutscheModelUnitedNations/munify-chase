<script lang="ts">
	import { onDestroy } from 'svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import {
		ResolutionPreview,
		type ResolutionHeaderData
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import { englishPreamblePhrases, englishOperativePhrases } from '@deutschemodelunitednations/munify-resolution-editor/phrases';
	import { createPaperYjsClient, type PaperYjsClient } from '$lib/api/yjs/createPaperYjs.svelte';
	import { toAmendmentOverlays } from './paperContext';
	import { svgToDataUrl } from '$lib/utils/svgToDataUrl';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface Props {
		paperId: string;
		/** Only highlight the active clause during AMENDMENT_PHASE. */
		currentOperativeIndex?: number | null;
		/** Only show amendment overlays during AMENDMENT_PHASE. */
		showAmendments?: boolean;
		resolutionFontSize?: number;
	}

	let {
		paperId,
		currentOperativeIndex = null,
		showAmendments = false,
		resolutionFontSize = 16
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
		proposer: { id: true, representation: { id: true, name: true } },
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
		// node lives inside: <div class="font-sans"> (afterOperativeClause wrapper)
		//   → clause row element → clause list
		// Two levels up reaches the clause row, which is what we want centred.
		const clauseEl = node.parentElement?.parentElement;
		clauseEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}
</script>

{#if resolution}
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

<style>
	.resolution-font-size-wrapper :global(.resolution-preview),
	.resolution-font-size-wrapper :global(.operative-paragraph-preview) {
		font-size: var(--resolution-font-size) !important;
	}
</style>
