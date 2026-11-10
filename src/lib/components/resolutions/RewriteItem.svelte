<script lang="ts">
	import AiSpinner from '#lib/components/AiSpinner.svelte';
	import AiIcon from '#lib/components/AiIcon.svelte';
	import ThreeWayDiffPreview from './ThreeWayDiffPreview.svelte';
	import ReviewItemHeader from './ReviewItemHeader.svelte';
	import { OperativeParagraphPreview } from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import { editedContent, parseOldMarkup, rewriteDraft, type ReviewItem } from './amendmentReview';

	interface Props {
		item: ReviewItem;
		/** A commit of any item is running. */
		busy: boolean;
		/** The AI queue is working on this item. */
		processing: boolean;
		onrerun: () => void;
		/** Resolves the item, with the text to use instead of the proposal if there is one. */
		onresolve: (verdictRewrite?: string) => void;
	}

	let { item, busy, processing, onrerun, onresolve }: Props = $props();

	let editing = $state(false);
	let edit = $state<string | undefined>(undefined);

	const original = $derived(item.subjectAmendment?.newContent ?? '');
	const aiEvaluated = $derived(item.aiRewriteSuggestion != null);
	const aiSuggestion = $derived(item.aiRewriteSuggestion ?? '');
	const oldMarkup = $derived(parseOldMarkup(item.triggerAmendment?.oldContent));
	const triggerMarkup = $derived(item.triggerAmendment?.newContent);
	const operativeNumber = $derived((item.subjectAmendment?.targetOperativeIndex ?? 0) + 1);
	const draft = $derived(rewriteDraft({ aiSuggestion, original, edit }));

	function startEditing() {
		if (!edit) edit = draft.initial;
		editing = true;
	}

	function cancelEditing() {
		editing = false;
		edit = undefined;
	}
</script>

{#snippet revision()}
	{#if editing}
		<textarea
			class="flex-1 w-full rounded-lg bg-white p-3 resize-none outline-none border-0 text-sm leading-relaxed text-gray-900"
			value={draft.current}
			oninput={(e) => {
				edit = e.currentTarget.value;
			}}></textarea>
	{:else if aiEvaluated}
		<div class="rounded-lg bg-white p-3 flex-1">
			{#if triggerMarkup && oldMarkup}
				<ThreeWayDiffPreview
					originalMarkup={oldMarkup}
					{triggerMarkup}
					aiMarkup={aiSuggestion}
					{operativeNumber}
				/>
			{:else}
				<OperativeParagraphPreview
					markup={aiSuggestion}
					oldMarkup={triggerMarkup ?? original}
					showDiff={true}
					{operativeNumber}
					labels={englishLabels}
				/>
			{/if}
		</div>
	{:else}
		<button
			class="rounded-lg border-2 border-dashed border-base-300 p-3 w-full flex-1 text-base-content/40 text-sm hover:border-base-content/30 hover:text-base-content/60 transition-colors cursor-pointer flex items-center justify-center gap-2"
			onclick={startEditing}
		>
			<i aria-hidden="true" class="ph-fill ph-pen text-xs"></i>
			Edit manually
		</button>
	{/if}
{/snippet}

{#snippet actions()}
	{#if editing}
		<button class="btn btn-ghost btn-sm cursor-pointer" disabled={busy} onclick={cancelEditing}>
			Cancel
		</button>
		<button
			class="btn btn-primary btn-sm cursor-pointer"
			disabled={busy || draft.unchanged}
			onclick={() => onresolve(editedContent({ edit, item }))}
		>
			{#if busy}<AiSpinner size="xs" />{/if}
			Commit
		</button>
	{:else if aiEvaluated}
		<button
			class="btn btn-primary btn-sm cursor-pointer"
			disabled={busy}
			onclick={() => onresolve(item.aiRewriteSuggestion ?? '')}
		>
			{#if busy}<AiSpinner size="xs" />{/if}
			<i aria-hidden="true" class="ph-fill ph-magic-wand"></i>
			Accept AI
		</button>
	{:else}
		<button
			class="btn btn-success btn-sm cursor-pointer"
			disabled={busy || draft.unchanged}
			onclick={() => onresolve()}
		>
			{#if busy}<AiSpinner size="xs" />{/if}
			<i aria-hidden="true" class="ph-fill ph-check"></i>
			Confirm
		</button>
	{/if}
{/snippet}

<div class="flex flex-col gap-3 py-2">
	<ReviewItemHeader
		{item}
		badge={aiEvaluated ? { label: 'Adjustment suggested', cls: 'badge-warning' } : null}
		{processing}
		{onrerun}
	/>

	<!-- Side-by-side columns -->
	<div class="grid grid-cols-2 gap-3 items-stretch">
		<!-- Left: Proposed text -->
		<div class="flex flex-col gap-1">
			<div class="flex items-center h-6">
				<p class="text-base-content/50 text-xs uppercase tracking-wide">Proposed text</p>
			</div>
			<div class="rounded-lg bg-white p-3 flex-1">
				<OperativeParagraphPreview
					markup={original}
					{oldMarkup}
					showDiff={!!oldMarkup}
					{operativeNumber}
					labels={englishLabels}
				/>
			</div>
		</div>

		<!-- Right: AI revision or edit textarea -->
		<div class="flex flex-col gap-1">
			<div class="flex items-center justify-between h-6">
				<p class="text-base-content/50 flex items-center gap-1 text-xs uppercase tracking-wide">
					{#if aiEvaluated}
						<AiIcon />
						<i aria-hidden="true" class="ph-fill ph-magic-wand text-primary"></i>
						AI revision
					{:else}
						Manual edit
					{/if}
				</p>
				{#if aiEvaluated && !editing}
					<button
						class="btn btn-ghost btn-xs cursor-pointer"
						onclick={startEditing}
						title="Edit manually"
					>
						<i aria-hidden="true" class="ph-fill ph-pen text-xs"></i>
					</button>
				{/if}
			</div>

			{@render revision()}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex items-center justify-end gap-2">
		{@render actions()}
	</div>
</div>
