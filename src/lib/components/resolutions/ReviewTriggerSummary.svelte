<script lang="ts">
	import Flag from '#lib/components/Flag.svelte';
	import { OperativeParagraphPreview } from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishLabels } from '@deutschemodelunitednations/munify-resolution-editor/i18n';
	import { representationName } from './sponsors';
	import type { ReviewAmendment } from './amendmentReview';

	interface Props {
		/** The accepted amendment the review follows from. */
		trigger: ReviewAmendment;
		/** The clause text before it was applied, if it could be read. */
		oldMarkup: string | undefined;
	}

	let { trigger, oldMarkup }: Props = $props();

	const representation = $derived(trigger.proposer?.representation);
</script>

<!-- Diff view — no wrapper boxes; OperativeParagraphPreview supplies its own card -->
<div class="flex flex-col gap-3">
	<div class="flex items-center gap-2 text-xs text-base-content/50">
		{#if trigger.type === 'ALTER_TEXT'}
			<i aria-hidden="true" class="ph-fill ph-pen opacity-60"></i>
		{/if}
		{#if trigger.documentNumber}
			<span class="font-mono font-semibold">{trigger.documentNumber}</span>
		{/if}
		{#if trigger.targetOperativeIndex != null}
			<span>· Clause {trigger.targetOperativeIndex + 1}</span>
		{/if}
		{#if representation}
			<span class="ml-auto flex items-center gap-1">
				<Flag {representation} size="xs" />
				{representationName(representation)}
			</span>
		{/if}
	</div>
	{#if trigger.newContent}
		<div>
			<p class="text-base-content/40 mb-1 text-xs uppercase tracking-wide">
				{oldMarkup ? 'Accepted change' : 'New text'}
			</p>
			<div class="rounded-lg bg-white p-3">
				<OperativeParagraphPreview
					markup={trigger.newContent}
					{oldMarkup}
					showDiff={!!oldMarkup}
					operativeNumber={(trigger.targetOperativeIndex ?? 0) + 1}
					labels={englishLabels}
				/>
			</div>
		</div>
	{/if}
</div>
