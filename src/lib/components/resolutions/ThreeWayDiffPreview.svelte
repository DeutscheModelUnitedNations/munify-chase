<script lang="ts">
	import { getSubClauseLabel } from '@deutschemodelunitednations/munify-resolution-editor';
	import {
		statusClasses,
		threeWayDiff,
		type AnnotatedSubItem,
		type AnnotatedText,
		type AnnotatedWord
	} from './threeWayDiff';

	interface Props {
		/** Markup of the clause before the trigger amendment was applied (A). */
		originalMarkup: string;
		/** Markup of the clause after the trigger amendment was accepted (B). */
		triggerMarkup: string;
		/** Markup of the AI's suggested revision (C). */
		aiMarkup: string;
		operativeNumber?: number;
	}

	let { originalMarkup, triggerMarkup, aiMarkup, operativeNumber = 1 }: Props = $props();

	// The A→C diff, with each change attributed to the trigger (B) or the AI (C).
	let annotated = $derived(threeWayDiff({ originalMarkup, triggerMarkup, aiMarkup }));

	function plainText(words: AnnotatedWord[]): string {
		return words.map((w) => w.value).join('');
	}

	// Split the first word off for italic formatting of the operative phrase.
	function splitFirst(words: AnnotatedWord[]): {
		first: AnnotatedWord | null;
		rest: AnnotatedWord[];
	} {
		if (words.length === 0) return { first: null, rest: [] };
		return { first: words[0], rest: words.slice(1) };
	}
</script>

<div class="operative-paragraph-preview w-full bg-white text-[0.95rem] leading-[1.7] text-gray-900">
	{#if !annotated}
		<div class="rounded border border-error/40 bg-error/10 px-3 py-2 font-sans text-sm text-error">
			Could not parse markup for three-way diff.
		</div>
	{:else if annotated.blocks.length === 0}
		<div class="py-6 text-center font-sans text-base-content/50">
			<i aria-hidden="true" class="ph-fill ph-paragraph mb-2 text-2xl"></i>
			<p>Empty clause</p>
		</div>
	{:else}
		<ol class="list-none p-0">
			<li class="mb-2 text-justify indent-8">
				<span class="font-bold">{operativeNumber}.</span>
				{#each annotated.blocks as block, bi (bi)}
					{#if block.type === 'text'}
						{@render textBlock(block, bi === 0)}
					{:else}
						{@render subList(block.items, 1)}
					{/if}
				{/each}
			</li>
		</ol>
	{/if}
</div>

{#snippet textBlock(block: AnnotatedText, isFirst: boolean)}
	{#if block.blockStatus !== 'same'}
		<span class={statusClasses(block.blockStatus)}>
			{#if isFirst}{@render operativeLead(block.words, false)}{:else}{plainText(
					block.words
				)}{/if}{block.punctuation}
		</span>
	{:else if isFirst}
		{@render operativeLead(block.words, true)}{block.punctuation}
	{:else}
		<p class="mb-1 mt-2 text-justify indent-8">
			{@render highlightedWords(block.words)}{block.punctuation}
		</p>
	{/if}
{/snippet}

<!-- The operative phrase in italics, then the rest, highlighted by attribution or plain. -->
{#snippet operativeLead(words: AnnotatedWord[], highlight: boolean)}
	{@const { first, rest } = splitFirst(words)}
	{#if first}<span class="italic">{first.value}</span>{/if}{#if highlight}{@render highlightedWords(
			rest
		)}{:else}{plainText(rest)}{/if}
{/snippet}

{#snippet highlightedWords(words: AnnotatedWord[])}
	{#each words as w, wi (wi)}<span class={statusClasses(w.status)}>{w.value}</span>{/each}
{/snippet}

{#snippet subList(items: AnnotatedSubItem[], depth: number)}
	<ol class="mt-2 list-none p-0">
		{#each items as item, index (index)}
			<li class="mb-1 text-justify {depth === 1 ? 'indent-8' : 'pl-8 indent-0'}">
				<span>{getSubClauseLabel(index, depth)}</span>
				{#each item.blocks as block, bi (bi)}
					{#if block.type === 'text'}
						{#if item.status !== 'same'}
							<span class={statusClasses(item.status)}>
								{plainText(block.words)}{block.punctuation}
							</span>
						{:else}
							{@render highlightedWords(block.words)}{block.punctuation}
						{/if}
					{:else if depth < 4}
						{@render subList(block.items, depth + 1)}
					{/if}
				{/each}
			</li>
		{/each}
	</ol>
{/snippet}

<style>
	.operative-paragraph-preview {
		font-family: 'Times New Roman', Times, serif;
	}
</style>
