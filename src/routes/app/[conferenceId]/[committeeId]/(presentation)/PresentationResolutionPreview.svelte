<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import {
		ResolutionPreview,
		migrateResolution,
		type Resolution,
		type ResolutionHeaderData,
		type OperativeClause,
		getFirstTextContent
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';

	interface Props {
		committee: {
			abbreviation: string;
			name: string;
			resolutionHeadline?: string | null;
			currentOperativeIndex?: number | null;
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
			} | null;
		};
	}

	let { committee }: Props = $props();

	let dr = $derived(committee.activeDraftResolution);
	let activeAmendment = $derived(committee.activeAmendment);
	let currentOpIndex = $derived(committee.currentOperativeIndex ?? 0);

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
				return 'badge-success';
			case 'ALTER_POSITION':
				return 'badge-info';
			default:
				return 'badge-ghost';
		}
	}

	function getClausePreviewText(clause: OperativeClause): string {
		return getFirstTextContent(clause) || '';
	}

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
		<ResolutionPreview {resolution} {headerData} />
	</div>
{:else if (dr.status === 'AMENDMENT_PHASE' || dr.status === 'VOTING_PHASE') && resolution}
	{#if activeAmendment && dr.status === 'AMENDMENT_PHASE'}
		<!-- Active amendment display -->
		<div class="flex flex-col gap-4 h-full">
			<div class="flex items-center gap-3">
				<span class="badge badge-lg {getAmendmentTypeBadge(activeAmendment.type)}">
					{activeAmendment.documentNumber ?? getAmendmentTypeLabel(activeAmendment.type)}
				</span>
				<span class="text-lg font-semibold">{m.proposedAmendmentPresentation()}</span>
				{#if activeAmendment.proposer?.representation}
					<div class="flex items-center gap-1 ml-auto">
						<Flag representation={activeAmendment.proposer.representation} size="sm" />
						<span>{getProposerName(activeAmendment.proposer)}</span>
					</div>
				{/if}
			</div>

			{#if activeAmendment.type === 'DELETE' && activeAmendment.targetOperativeIndex != null}
				<!-- DELETE: show clause with strikethrough -->
				{@const targetClause = resolution.operative[activeAmendment.targetOperativeIndex]}
				<div class="text-center text-base-content/60 text-sm mb-2">
					{m.operativeClausePresentation()}
					{activeAmendment.targetOperativeIndex + 1}
				</div>
				{#if targetClause}
					<div
						class="flex-1 flex items-center justify-center text-2xl leading-relaxed p-8 font-serif"
					>
						<div class="line-through decoration-error decoration-4 opacity-60">
							<span class="font-bold">{activeAmendment.targetOperativeIndex + 1}.</span>
							{getClausePreviewText(targetClause)}
						</div>
					</div>
				{/if}
			{:else if activeAmendment.type === 'ALTER_TEXT' && activeAmendment.targetOperativeIndex != null}
				<!-- ALTER_TEXT: show current and proposed side by side -->
				{@const targetClause = resolution.operative[activeAmendment.targetOperativeIndex]}
				<div class="text-center text-base-content/60 text-sm mb-2">
					{m.operativeClausePresentation()}
					{activeAmendment.targetOperativeIndex + 1}
				</div>
				<div class="flex-1 grid grid-cols-2 gap-6 p-4">
					<div class="flex flex-col gap-2">
						<div class="text-sm font-semibold text-error">{m.currentText()}</div>
						{#if targetClause}
							<div class="text-xl leading-relaxed font-serif bg-error/5 rounded-lg p-4">
								<span class="font-bold">{activeAmendment.targetOperativeIndex + 1}.</span>
								{getClausePreviewText(targetClause)}
							</div>
						{/if}
					</div>
					<div class="flex flex-col gap-2">
						<div class="text-sm font-semibold text-success">{m.proposedText()}</div>
						{#if activeAmendment.newContent}
							<div class="text-xl leading-relaxed font-serif bg-success/5 rounded-lg p-4">
								<span class="font-bold">{activeAmendment.targetOperativeIndex + 1}.</span>
								{getClausePreviewText(activeAmendment.newContent as OperativeClause)}
							</div>
						{/if}
					</div>
				</div>
			{:else if activeAmendment.type === 'ADD'}
				<!-- ADD: show the new clause content -->
				<div class="text-center text-base-content/60 text-sm mb-2">
					{m.insertAfterPresentation({ index: (activeAmendment.targetPosition ?? 0) + 1 })}
				</div>
				<div
					class="flex-1 flex items-center justify-center text-2xl leading-relaxed p-8 font-serif"
				>
					{#if activeAmendment.newContent}
						<div class="bg-success/10 rounded-lg p-6 border-l-4 border-success">
							{getClausePreviewText(activeAmendment.newContent as OperativeClause)}
						</div>
					{/if}
				</div>
			{:else if activeAmendment.type === 'ALTER_POSITION' && activeAmendment.targetOperativeIndex != null}
				<!-- ALTER_POSITION: show move action -->
				{@const targetClause = resolution.operative[activeAmendment.targetOperativeIndex]}
				<div class="flex-1 flex flex-col items-center justify-center gap-4 p-8">
					{#if targetClause}
						<div class="text-xl font-serif leading-relaxed text-center">
							<span class="font-bold">{activeAmendment.targetOperativeIndex + 1}.</span>
							{getClausePreviewText(targetClause)}
						</div>
					{/if}
					<div class="flex items-center gap-2 text-info">
						<i class="fas fa-arrow-right text-2xl"></i>
						<span class="text-lg font-semibold">
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
			<div class="flex items-center justify-between mb-4">
				<div class="text-lg font-semibold">
					{dr.documentNumber ?? m.draftResolution()}
				</div>
				<div class="badge badge-lg badge-primary">
					{dr.status === 'VOTING_PHASE' ? m.votingPhase() : m.amendmentPhase()}
				</div>
			</div>

			<div class="text-center text-base-content/60 text-sm mb-4">
				{m.operativeClausePresentation()}
				{currentOpIndex + 1} / {resolution.operative.length}
			</div>

			{#if currentClause}
				<div
					class="flex-1 flex items-center justify-center text-2xl leading-relaxed p-8 font-serif"
				>
					<div>
						<span class="font-bold">{currentOpIndex + 1}.</span>
						{getClausePreviewText(currentClause)}
					</div>
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
