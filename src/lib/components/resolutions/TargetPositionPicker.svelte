<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import {
		type OperativeClause,
		getFirstTextContent
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { positionSummary } from './amendmentDraft';

	interface Props {
		/** null shows the list; -1 inserts at the beginning, n after the clause at index n. */
		position: number | null;
		operative: OperativeClause[];
		/** A clause that cannot be its own new neighbour (the one being moved), or -1. */
		movingIndex: number;
	}

	let { position = $bindable(), operative, movingIndex }: Props = $props();

	const summary = $derived.by(() => {
		if (position === null) return null;
		const clause = operative[position];
		return positionSummary({ position, preview: clause ? getFirstTextContent(clause) : null });
	});
</script>

<div class="flex flex-col gap-1">
	<span class="label-text text-sm font-medium">{m.targetPosition()}</span>
	{#if summary}
		<div class="bg-base-100 flex items-start gap-2 rounded-lg px-3 py-2">
			<span class="shrink-0 font-mono text-sm font-semibold opacity-60">{summary.marker}</span>
			<span class="flex-1 text-sm">{summary.text}</span>
			<button
				class="btn btn-ghost btn-xs btn-circle shrink-0"
				aria-label={m.deselect()}
				onclick={() => (position = null)}
			>
				<i aria-hidden="true" class="ph-fill ph-x text-xs"></i>
			</button>
		</div>
	{:else}
		<div class="bg-base-300 flex max-h-40 flex-col gap-1 overflow-y-auto rounded-lg p-1">
			<button
				class="hover:bg-base-200 flex items-start gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors"
				onclick={() => (position = -1)}
			>
				<span class="shrink-0 font-mono font-semibold opacity-60">↑</span>
				<span class="flex-1">{m.insertAtBeginning()}</span>
			</button>
			{#each operative as clause, i (clause.id)}
				{#if i !== movingIndex}
					<button
						class="hover:bg-base-200 flex items-start gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors"
						onclick={() => (position = i)}
					>
						<span class="shrink-0 font-mono font-semibold opacity-60">{i + 1}.</span>
						<span class="line-clamp-1 flex-1">
							{m.insertAfterPresentation({ index: String(i + 1) })} — {getFirstTextContent(clause)}
						</span>
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>
