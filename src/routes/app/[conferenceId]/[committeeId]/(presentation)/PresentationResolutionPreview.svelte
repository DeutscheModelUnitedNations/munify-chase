<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import {
		ResolutionPreview,
		OperativeParagraphPreview,
		migrateResolution,
		type Resolution,
		type ResolutionHeaderData,
		type OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { serializeClause } from '$lib/utils/amendmentMarkup';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { getResolutionLabels } from '$lib/utils/resolutionEditorLabels';
	import { svgToDataUrl } from '$lib/utils/svgToDataUrl';
	import { SvelteMap } from 'svelte/reactivity';

	interface Props {
		resolutionFontSize?: number;
		committee: {
			abbreviation: string;
			name: string;
			resolutionHeadline?: string | null;
			currentOperativeIndex?: number | null;
			currentOperativeClauseId?: string | null;
			activeAmendment?: {
				id: string;
				type: string;
				status: string;
				documentNumber?: string | null;
				targetClauseId?: string | null;
				targetOperativeIndex?: number | null;
				targetPosition?: number | null;
				newContent?: unknown;
				proposer?: {
					id: string;
					representation?: {
						name?: string | null;
						alpha2Code?: string | null;
						alpha3Code?: string | null;
					} | null;
				} | null;
			} | null;
			activeDraftResolution?: {
				id: string;
				content?: unknown;
				documentNumber?: string | null;
				status: string;
				title?: string | null;
				updatedAt?: Date | string | null;
				agendaItem?: {
					id: string;
					title?: string | null;
				} | null;
				creator?: {
					id: string;
					representation?: {
						name?: string | null;
						alpha2Code?: string | null;
						alpha3Code?: string | null;
					} | null;
				} | null;
				sponsors?: Array<{
					id: string;
					committeeMember?: {
						representation?: {
							name?: string | null;
							alpha3Code?: string | null;
						} | null;
					} | null;
				}>;
				amendments?: Array<{
					id: string;
					type: string;
					status: string;
					documentNumber?: string | null;
					targetClauseId?: string | null;
					targetOperativeIndex?: number | null;
					targetPosition?: number | null;
					newContent?: unknown;
					proposer?: {
						id: string;
						representation?: {
							name?: string | null;
						} | null;
					} | null;
				}>;
				operativeClauseVotes?: Array<{
					id: string;
					clauseId: string;
					outcome: string;
				}>;
				voteResult?: {
					outcome: string;
					votesFor: number;
					votesAgainst: number;
					votesAbstain: number;
				} | null;
			} | null;
			conference?: {
				title?: string | null;
				logoSvg?: string | null;
			} | null;
		};
	}

	let { committee, resolutionFontSize = 16 }: Props = $props();

	let dr = $derived(committee.activeDraftResolution);
	let activeAmendment = $derived(committee.activeAmendment);
	let currentOpIndex = $derived.by(() => {
		const clauseId = committee.currentOperativeClauseId;
		if (clauseId && resolution) {
			const idx = resolution.operative.findIndex((c) => c.id === clauseId);
			if (idx !== -1) return idx;
		}
		return committee.currentOperativeIndex ?? 0;
	});

	let resolution = $derived.by(() => {
		if (!dr?.content) return null;
		try {
			return migrateResolution(dr.content as Resolution) as Resolution;
		} catch {
			return null;
		}
	});

	let currentClause = $derived.by(() => {
		if (!resolution) return null;
		return resolution.operative[currentOpIndex] ?? null;
	});

	let headerData = $derived.by((): ResolutionHeaderData | undefined => {
		if (!dr) return undefined;
		return {
			conferenceName: committee.conference?.title ?? undefined,
			conferenceTitle: committee.conference?.title ?? undefined,
			conferenceEmblem: svgToDataUrl(committee.conference?.logoSvg),
			committeeAbbreviation: committee.abbreviation,
			committeeFullName: committee.name,
			committeeResolutionHeadline: committee.resolutionHeadline ?? undefined,
			documentNumber: dr.documentNumber ?? undefined,
			topic: dr.agendaItem?.title ?? undefined,
			authoringDelegation:
				dr.creator?.representation?.name ??
				(dr.creator?.representation?.alpha3Code
					? getTranslatedCountryNameFromAlpha3Code(dr.creator.representation.alpha3Code)
					: undefined),
			sponsoringDelegations: dr.sponsors
				?.map(
					(s) =>
						getTranslatedCountryNameFromAlpha3Code(s.committeeMember?.representation?.alpha3Code) ??
						s.committeeMember?.representation?.name ??
						''
				)
				.filter(Boolean)
				.sort((a, b) => a.localeCompare(b)),
			lastEdited: dr.updatedAt ?? undefined
		};
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

	function singleClauseResolution(clause: OperativeClause): Resolution {
		return { committeeName: committee.name, preamble: [], operative: [clause] };
	}

	let pendingAmendmentCounts = $derived.by(() => {
		if (!dr?.amendments || !resolution) return new SvelteMap<number, number>();
		const counts = new SvelteMap<number, number>();
		for (const a of dr.amendments) {
			if (a.status !== 'SUBMITTED') continue;
			if (a.type !== 'ALTER_TEXT' && a.type !== 'DELETE') continue;
			let idx: number | null = null;
			if (a.targetClauseId) {
				const found = resolution.operative.findIndex((c) => c.id === a.targetClauseId);
				if (found !== -1) idx = found;
			} else if (a.targetOperativeIndex != null) {
				idx = a.targetOperativeIndex;
			}
			if (idx == null) continue;
			counts.set(idx, (counts.get(idx) ?? 0) + 1);
		}
		return counts;
	});

	// Resolve active amendment's target index from stable clause ID
	let resolvedActiveAmendIdx = $derived.by(() => {
		if (!activeAmendment || !resolution) return -1;
		if (activeAmendment.targetClauseId) {
			const idx = resolution.operative.findIndex((c) => c.id === activeAmendment.targetClauseId);
			if (idx !== -1) return idx;
		}
		return activeAmendment.targetOperativeIndex ?? -1;
	});

	function getProposerName(
		proposer:
			| {
					representation?: {
						name?: string | null;
						alpha2Code?: string | null;
						alpha3Code?: string | null;
					} | null;
			  }
			| null
			| undefined
	): string {
		if (!proposer?.representation) return '';
		return (
			proposer.representation.name ??
			(proposer.representation.alpha3Code
				? getTranslatedCountryNameFromAlpha3Code(proposer.representation.alpha3Code)
				: '') ??
			''
		);
	}
</script>

<div class="resolution-font-size-wrapper" style="--resolution-font-size: {resolutionFontSize}px;">
	{#if !dr}
		<!-- No active DR -->
		<div class="flex flex-col items-center justify-center h-full text-base-content/50 gap-4">
			<i class="fas fa-file-lines text-6xl"></i>
			<p class="text-xl">{m.noActiveDraftResolution()}</p>
			<p class="text-sm">{m.setActiveDrHint()}</p>
		</div>
	{:else if dr.status === 'DRAFT_RESOLUTION' && resolution}
		<!-- Full resolution preview -->
		<div class="h-full overflow-auto">
			<ResolutionPreview {resolution} {headerData} labels={getResolutionLabels()} />
		</div>
	{:else if (dr.status === 'AMENDMENT_PHASE' || dr.status === 'VOTING_PHASE') && resolution}
		{#if activeAmendment && dr.status === 'AMENDMENT_PHASE'}
			<!-- Active amendment display -->
			<div class="flex flex-col gap-5 h-full">
				<div class="flex flex-col gap-3 pb-3 border-b-2 border-base-300">
					<div class="flex items-center gap-3 flex-wrap">
						<div class="flex flex-col">
							<span class="badge badge-lg {getAmendmentTypeBadge(activeAmendment.type)} font-bold">
								{getAmendmentTypeLabel(activeAmendment.type)}
							</span>
							{#if activeAmendment.documentNumber}
								<span class="font-mono text-base-content/60 text-lg">
									{activeAmendment.documentNumber}
								</span>
							{/if}
						</div>
						<span class="text-2xl font-semibold flex-1 text-center"
							>{m.proposedAmendmentPresentation()}</span
						>
						{#if activeAmendment.proposer?.representation}
							<div
								class="flex items-center gap-2 ml-auto bg-base-200 rounded-box pl-1 pr-3 py-1 text-base"
							>
								<Flag representation={activeAmendment.proposer.representation} size="sm" />
								<span class="font-medium">{getProposerName(activeAmendment.proposer)}</span>
							</div>
						{/if}
					</div>
				</div>

				{#if activeAmendment.type === 'DELETE' && resolvedActiveAmendIdx >= 0}
					<!-- DELETE: show clause with strikethrough -->
					{@const targetClause = resolution.operative[resolvedActiveAmendIdx]}
					<div class="flex items-center justify-center gap-2 text-error">
						<i class="fas fa-trash-can text-lg"></i>
						<span class="text-lg font-semibold">
							{m.operativeClausePresentation()}
							{resolvedActiveAmendIdx + 1}
						</span>
					</div>
					{#if targetClause}
						<div
							class="flex-1 overflow-auto p-4 rounded-lg bg-white border-2 border-error/30 border-l-4 border-l-error line-through decoration-error decoration-4 opacity-70"
						>
							<ResolutionPreview
								resolution={singleClauseResolution(targetClause)}
								labels={getResolutionLabels()}
							>
								{#snippet previewHeader()}{/snippet}
							</ResolutionPreview>
						</div>
					{/if}
				{:else if activeAmendment.type === 'ALTER_TEXT' && resolvedActiveAmendIdx >= 0}
					<!-- ALTER_TEXT: word-level diff against the current clause -->
					{@const targetClause = resolution.operative[resolvedActiveAmendIdx]}
					<div class="flex items-center justify-center gap-2 text-warning">
						<i class="fas fa-pen-to-square text-lg"></i>
						<span class="text-lg font-semibold">
							{m.operativeClausePresentation()}
							{resolvedActiveAmendIdx + 1}
						</span>
					</div>
					<div class="flex-1 overflow-auto p-4">
						{#if typeof activeAmendment.newContent === 'string'}
							<div
								class="rounded-lg border-2 border-warning/30 border-l-4 border-l-warning bg-white p-4 pt-6"
							>
								<OperativeParagraphPreview
									markup={activeAmendment.newContent}
									oldMarkup={targetClause ? serializeClause(targetClause) : undefined}
									showDiff
									operativeNumber={resolvedActiveAmendIdx + 1}
									labels={getResolutionLabels()}
								/>
							</div>
						{/if}
					</div>
				{:else if activeAmendment.type === 'ADD'}
					<!-- ADD: show the new clause content -->
					<div class="flex items-center justify-center gap-2 text-green-700">
						<i class="fas fa-plus text-lg"></i>
						<span class="text-lg font-semibold">
							{m.insertAfterPresentation({ index: (activeAmendment.targetPosition ?? 0) + 1 })}
						</span>
					</div>
					<div class="flex-1 overflow-auto p-4">
						{#if typeof activeAmendment.newContent === 'string'}
							<div
								class="rounded-lg bg-white border-2 border-green-700/40 border-l-4 border-l-green-700 p-4 pt-6"
							>
								<OperativeParagraphPreview
									markup={activeAmendment.newContent}
									operativeNumber={(activeAmendment.targetPosition ?? 0) + 2}
									labels={getResolutionLabels()}
								/>
							</div>
						{/if}
					</div>
				{:else if activeAmendment.type === 'ALTER_POSITION' && resolvedActiveAmendIdx >= 0}
					<!-- ALTER_POSITION: show move action -->
					{@const targetClause = resolution.operative[resolvedActiveAmendIdx]}
					<div class="flex-1 flex flex-col items-center justify-center gap-6 p-4 overflow-auto">
						<div class="flex items-center gap-2 text-info">
							<i class="fas fa-arrows-up-down text-lg"></i>
							<span class="text-lg font-semibold">
								{m.operativeClausePresentation()}
								{resolvedActiveAmendIdx + 1}
							</span>
						</div>
						{#if targetClause}
							<div
								class="w-full rounded-lg bg-white border-2 border-info/30 border-l-4 border-l-info p-4"
							>
								<ResolutionPreview
									resolution={singleClauseResolution(targetClause)}
									labels={getResolutionLabels()}
								>
									{#snippet previewHeader()}{/snippet}
								</ResolutionPreview>
							</div>
						{/if}
						<div class="flex items-center gap-3 text-info bg-info/10 rounded-full px-5 py-2">
							<i class="fas fa-arrow-down text-2xl"></i>
							<span class="text-xl font-semibold">
								{m.moveToPositionPresentation({
									position: (activeAmendment.targetPosition ?? 0) + 1
								})}
							</span>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Single operative clause view (amendment phase without active amendment, or voting phase) -->
			<div class="flex flex-col h-full">
				<div class="flex items-center justify-center gap-2 text-base-content/60 text-lg mb-4">
					<span>
						{m.operativeClausePresentation()}
						{currentOpIndex + 1} / {resolution.operative.length}
					</span>
					{#if dr.status === 'AMENDMENT_PHASE' && pendingAmendmentCounts.get(currentOpIndex)}
						<span class="badge badge-lg badge-warning">
							{pendingAmendmentCounts.get(currentOpIndex)}
							{m.amendments()}
						</span>
					{/if}
				</div>

				{#if currentClause}
					<div class="flex-1 overflow-auto p-4 pt-6 bg-white rounded-box">
						<OperativeParagraphPreview
							markup={serializeClause(currentClause)}
							operativeNumber={currentOpIndex + 1}
							labels={getResolutionLabels()}
						/>
					</div>
				{:else}
					<div class="flex-1 flex items-center justify-center text-base-content/50">
						<p>{m.noOperativeClauses()}</p>
					</div>
				{/if}
			</div>
		{/if}
	{:else}
		<!-- Fallback -->
		<div class="flex flex-col items-center justify-center h-full text-base-content/50 gap-4">
			<i class="fas fa-file-lines text-6xl"></i>
			<p class="text-xl">{m.noActiveDraftResolution()}</p>
		</div>
	{/if}
</div>

<style>
	.resolution-font-size-wrapper :global(.resolution-preview),
	.resolution-font-size-wrapper :global(.operative-paragraph-preview) {
		font-size: var(--resolution-font-size) !important;
	}
</style>
