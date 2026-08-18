<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import AiSpinner from '$lib/components/AiSpinner.svelte';
	import AiIcon from '$lib/components/AiIcon.svelte';
	import AiResultBadge from './AiResultBadge.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import ThreeWayDiffPreview from './ThreeWayDiffPreview.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import {
		OperativeParagraphPreview,
		serializeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';

	interface ReviewItem {
		id: string;
		aiRewriteSuggestion: string | null | undefined;
		triggerAmendment:
			| { newContent: string | null | undefined; oldContent: string | null | undefined }
			| null
			| undefined;
		subjectAmendment:
			| {
					documentNumber: string | null | undefined;
					type: string | null | undefined;
					status: string | null | undefined;
					newContent: string | null | undefined;
					targetOperativeIndex: number | null | undefined;
					proposer:
						| {
								representation:
									| {
											name: string | null | undefined;
											alpha2Code: string | null | undefined;
											alpha3Code: string | null | undefined;
											faIcon: string | null | undefined;
											type: string | null | undefined;
									  }
									| null
									| undefined;
						  }
						| null
						| undefined;
					sponsors: Array<{ id: string }> | null | undefined;
			  }
			| null
			| undefined;
	}

	interface Props {
		items: ReviewItem[];
		/** ID of the item the AI queue is currently working on. */
		currentlyProcessingId?: string | null;
		onrerunItem?: (itemId: string) => void;
	}

	let { items, currentlyProcessingId = null, onrerunItem }: Props = $props();

	let busy = $state(false);
	let editMode = $state<Record<string, boolean>>({});
	let edits = $state<Record<string, string | undefined>>({});

	async function keepOriginalForItem(item: ReviewItem) {
		busy = true;
		try {
			await client.mutate.updateAmendmentReviewItem({
				__args: { reviewItemId: item.id, phase: 'RESOLVED' }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
		}
	}

	async function acceptAiForItem(item: ReviewItem) {
		busy = true;
		try {
			await client.mutate.updateAmendmentReviewItem({
				__args: {
					reviewItemId: item.id,
					phase: 'RESOLVED',
					verdictRewrite: item.aiRewriteSuggestion ?? ''
				}
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
		}
	}

	async function confirmEditForItem(item: ReviewItem) {
		const content = edits[item.id] ?? item.subjectAmendment?.newContent ?? '';
		busy = true;
		try {
			await client.mutate.updateAmendmentReviewItem({
				__args: { reviewItemId: item.id, phase: 'RESOLVED', verdictRewrite: content }
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busy = false;
		}
	}

	function parseOldMarkup(triggerClauseOldContent: string | null | undefined): string | undefined {
		if (!triggerClauseOldContent) return undefined;
		try {
			return serializeClause(JSON.parse(triggerClauseOldContent));
		} catch {
			return undefined;
		}
	}

	function typeLabel(type: string | null | undefined) {
		if (type === 'ALTER_TEXT') return 'Alter text';
		if (type === 'DELETE') return 'Delete';
		if (type === 'ADD') return 'Add';
		if (type === 'ALTER_POSITION') return 'Move';
		return type ?? '';
	}
</script>

<div class="flex flex-col gap-4">
	{#if items.length === 0}
		<div class="text-base-content/50 py-4 text-center text-sm">
			<i class="fas fa-circle-check text-success mr-1"></i>
			All text adjustments reviewed
		</div>
	{:else}
		<div class="flex flex-col gap-3">
			{#each items as item (item.id)}
				{@const originalContent = item.subjectAmendment?.newContent ?? ''}
				{@const aiEvaluated =
					item.aiRewriteSuggestion !== null && item.aiRewriteSuggestion !== undefined}
				{@const aiSuggestion = item.aiRewriteSuggestion ?? ''}
				{@const isEditing = editMode[item.id] ?? false}
				{@const oldMarkup = parseOldMarkup(item.triggerAmendment?.oldContent)}
				{@const initialEditValue = (aiSuggestion || null) ?? originalContent}
				{@const currentEditValue = edits[item.id] ?? initialEditValue}
				{@const editUnchanged = currentEditValue === initialEditValue}

				<div class="flex flex-col gap-3 py-2">
					<!-- Header -->
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-2">
							<p class="font-mono text-sm font-semibold">
								{item.subjectAmendment?.documentNumber ?? typeLabel(item.subjectAmendment?.type)}
							</p>
							{#if aiEvaluated}
								<AiResultBadge
									label="Adjustment suggested"
									cls="badge-warning"
									onclick={() => onrerunItem?.(item.id)}
								/>
							{:else if currentlyProcessingId === item.id}
								<span class="badge badge-ghost badge-sm gap-1">
									<AiSpinner size="xs" />
									Analysing…
								</span>
							{/if}
						</div>
						<div class="flex items-center gap-2 text-xs text-base-content/60 shrink-0">
							{#if item.subjectAmendment?.proposer?.representation}
								<span class="flex items-center gap-1">
									<Flag representation={item.subjectAmendment.proposer.representation} size="xs" />
									{getTranslatedCountryNameFromAlpha3Code(
										item.subjectAmendment.proposer.representation.alpha3Code
									) ?? item.subjectAmendment.proposer.representation.name}
								</span>
							{/if}
							{#if (item.subjectAmendment?.sponsors?.length ?? 0) > 0}
								<span class="text-base-content/40">
									<i class="fas fa-users mr-0.5 text-[0.6rem]"></i>{item.subjectAmendment?.sponsors
										?.length}
								</span>
							{/if}
						</div>
					</div>

					<!-- Side-by-side columns -->
					<div class="grid grid-cols-2 gap-3 items-stretch">
						<!-- Left: Proposed text -->
						<div class="flex flex-col gap-1">
							<div class="flex items-center h-6">
								<p class="text-base-content/50 text-xs uppercase tracking-wide">Proposed text</p>
							</div>
							<div class="rounded-lg bg-white p-3 flex-1">
								<OperativeParagraphPreview
									markup={originalContent}
									{oldMarkup}
									showDiff={!!oldMarkup}
									operativeNumber={(item.subjectAmendment?.targetOperativeIndex ?? 0) + 1}
									labels={englishLabels}
								/>
							</div>
						</div>

						<!-- Right: AI revision or edit textarea -->
						<div class="flex flex-col gap-1">
							<div class="flex items-center justify-between h-6">
								<p
									class="text-base-content/50 flex items-center gap-1 text-xs uppercase tracking-wide"
								>
									{#if aiEvaluated}
										<AiIcon />
										<i class="fas fa-wand-magic-sparkles text-primary"></i>
										AI revision
									{:else}
										Manual edit
									{/if}
								</p>
								{#if aiEvaluated && !isEditing}
									<button
										class="btn btn-ghost btn-xs cursor-pointer"
										onclick={() => {
											if (!edits[item.id]) edits[item.id] = aiSuggestion || originalContent;
											editMode[item.id] = true;
										}}
										title="Edit manually"
									>
										<i class="fas fa-pen text-xs"></i>
									</button>
								{/if}
							</div>

							{#if isEditing}
								<textarea
									class="flex-1 w-full rounded-lg bg-white p-3 resize-none outline-none border-0 text-sm leading-relaxed text-gray-900"
									value={currentEditValue}
									oninput={(e) => {
										edits[item.id] = (e.currentTarget as HTMLTextAreaElement).value;
									}}></textarea>
							{:else if aiEvaluated}
								<div class="rounded-lg bg-white p-3 flex-1">
									{#if item.triggerAmendment?.newContent && oldMarkup}
										<ThreeWayDiffPreview
											originalMarkup={oldMarkup}
											triggerMarkup={item.triggerAmendment.newContent}
											aiMarkup={aiSuggestion}
											operativeNumber={(item.subjectAmendment?.targetOperativeIndex ?? 0) + 1}
										/>
									{:else}
										<OperativeParagraphPreview
											markup={aiSuggestion}
											oldMarkup={item.triggerAmendment?.newContent ?? originalContent}
											showDiff={true}
											operativeNumber={(item.subjectAmendment?.targetOperativeIndex ?? 0) + 1}
											labels={englishLabels}
										/>
									{/if}
								</div>
							{:else}
								<button
									class="rounded-lg border-2 border-dashed border-base-300 p-3 w-full flex-1 text-base-content/40 text-sm hover:border-base-content/30 hover:text-base-content/60 transition-colors cursor-pointer flex items-center justify-center gap-2"
									onclick={() => {
										if (!edits[item.id]) edits[item.id] = originalContent;
										editMode[item.id] = true;
									}}
								>
									<i class="fas fa-pen text-xs"></i>
									Edit manually
								</button>
							{/if}
						</div>
					</div>

					<!-- Actions -->
					<div class="flex items-center justify-end gap-2">
						{#if isEditing}
							<button
								class="btn btn-ghost btn-sm cursor-pointer"
								disabled={busy}
								onclick={() => {
									editMode[item.id] = false;
									delete edits[item.id];
								}}
							>
								Cancel
							</button>
							<button
								class="btn btn-primary btn-sm cursor-pointer"
								disabled={busy || editUnchanged}
								onclick={() => confirmEditForItem(item)}
							>
								{#if busy}<AiSpinner size="xs" />{/if}
								Commit
							</button>
						{:else if aiEvaluated}
							<button
								class="btn btn-primary btn-sm cursor-pointer"
								disabled={busy}
								onclick={() => acceptAiForItem(item)}
							>
								{#if busy}<AiSpinner size="xs" />{/if}
								<i class="fas fa-wand-magic-sparkles"></i>
								Accept AI
							</button>
						{:else}
							<button
								class="btn btn-success btn-sm cursor-pointer"
								disabled={busy || editUnchanged}
								onclick={() => keepOriginalForItem(item)}
							>
								{#if busy}<AiSpinner size="xs" />{/if}
								<i class="fas fa-check"></i>
								Confirm
							</button>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
