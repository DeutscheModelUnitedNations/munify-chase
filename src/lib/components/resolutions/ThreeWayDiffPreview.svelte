<script lang="ts">
	import {
		parseClauseFragment,
		buildDiffRenderClause,
		buildRenderClause,
		getSubClauseLabel,
		type RenderBlock,
		type RenderText,
		type RenderItem
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { SvelteMap } from 'svelte/reactivity';

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

	type TripleStatus = 'same' | 'trigger-added' | 'trigger-removed' | 'ai-added' | 'ai-removed';

	interface AnnotatedWord {
		value: string;
		status: TripleStatus;
	}

	interface AnnotatedText {
		type: 'text';
		words: AnnotatedWord[];
		punctuation: string;
		blockStatus: TripleStatus;
	}

	interface AnnotatedSubclauses {
		type: 'subclauses';
		items: AnnotatedSubItem[];
	}

	interface AnnotatedSubItem {
		status: TripleStatus;
		blocks: (AnnotatedText | AnnotatedSubclauses)[];
	}

	interface AnnotatedClause {
		blocks: (AnnotatedText | AnnotatedSubclauses)[];
	}

	// Build the annotated three-way diff tree.
	// Strategy: compute A→C diff as the base render tree, then use a word-bag
	// from B to classify each change as trigger-originated or AI-originated.
	let annotated = $derived.by((): AnnotatedClause | null => {
		const pA = parseClauseFragment(originalMarkup ?? '');
		const pB = parseClauseFragment(triggerMarkup ?? '');
		const pC = parseClauseFragment(aiMarkup ?? '');

		if (!pA.valid || !pC.valid) return null;

		const diffAC = buildDiffRenderClause(pA.clause, pC.clause);

		// Build a consumable multiset of words in B.
		// 'added' words in A→C that appear in B were placed there by the trigger.
		// 'removed' words in A→C that appear in B were removed by AI (B had kept them).
		const bBag = new SvelteMap<string, number>();
		if (pB.valid) {
			const bTree = buildRenderClause(pB.clause);
			function collectFromBlock(block: RenderBlock) {
				if (block.type === 'text') {
					for (const w of block.words) bBag.set(w.value, (bBag.get(w.value) ?? 0) + 1);
				} else {
					for (const item of block.items) {
						for (const b of item.blocks) collectFromBlock(b);
					}
				}
			}
			for (const block of bTree.blocks) collectFromBlock(block);
		}

		function consumeBag(word: string): boolean {
			const n = bBag.get(word) ?? 0;
			if (n === 0) return false;
			if (n === 1) bBag.delete(word);
			else bBag.set(word, n - 1);
			return true;
		}

		function classifyWord(value: string, acStatus: string): TripleStatus {
			if (acStatus === 'same') return 'same';
			const inB = consumeBag(value);
			if (acStatus === 'added') return inB ? 'trigger-added' : 'ai-added';
			// removed
			return inB ? 'ai-removed' : 'trigger-removed';
		}

		function annotateText(rt: RenderText): AnnotatedText {
			const words: AnnotatedWord[] = rt.words.map((w) => ({
				value: w.value,
				status: classifyWord(w.value, w.status)
			}));
			// Block-level status for wholly-added or wholly-removed blocks.
			let blockStatus: TripleStatus = 'same';
			if (rt.blockStatus === 'added') {
				blockStatus = words[0]?.status === 'trigger-added' ? 'trigger-added' : 'ai-added';
			} else if (rt.blockStatus === 'removed') {
				blockStatus = words[0]?.status === 'ai-removed' ? 'ai-removed' : 'trigger-removed';
			}
			return { type: 'text', words, punctuation: rt.punctuation, blockStatus };
		}

		function annotateItem(item: RenderItem): AnnotatedSubItem {
			let status: TripleStatus = 'same';
			if (item.status === 'added') {
				// Check first word to determine if trigger or AI added this subclause.
				const firstText = item.blocks.find((b) => b.type === 'text') as RenderText | undefined;
				const firstWord = firstText?.words[0];
				const inB = firstWord ? consumeBag(firstWord.value) : false;
				status = inB ? 'trigger-added' : 'ai-added';
			} else if (item.status === 'removed') {
				const firstText = item.blocks.find((b) => b.type === 'text') as RenderText | undefined;
				const firstWord = firstText?.words[0];
				const inB = firstWord ? consumeBag(firstWord.value) : false;
				status = inB ? 'ai-removed' : 'trigger-removed';
			}
			return {
				status,
				blocks: item.blocks.map((b) => {
					if (b.type === 'text') return annotateText(b);
					return { type: 'subclauses' as const, items: b.items.map(annotateItem) };
				})
			};
		}

		return {
			blocks: diffAC.blocks.map((b) => {
				if (b.type === 'text') return annotateText(b);
				return { type: 'subclauses' as const, items: b.items.map(annotateItem) };
			})
		};
	});

	function wordClasses(status: TripleStatus): string {
		switch (status) {
			case 'trigger-added':
				return 'bg-warning/20 text-warning-content rounded-sm';
			case 'trigger-removed':
				return 'text-warning line-through decoration-warning';
			case 'ai-added':
				return 'bg-success/15 text-success rounded-sm';
			case 'ai-removed':
				return 'bg-error/10 text-error line-through decoration-error';
			default:
				return '';
		}
	}

	function blockClasses(status: TripleStatus): string {
		switch (status) {
			case 'trigger-added':
				return 'bg-warning/20 text-warning-content rounded-sm';
			case 'trigger-removed':
				return 'text-warning line-through decoration-warning';
			case 'ai-added':
				return 'bg-success/15 text-success rounded-sm';
			case 'ai-removed':
				return 'bg-error/10 text-error line-through decoration-error';
			default:
				return '';
		}
	}

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
			<i class="fa-solid fa-paragraph mb-2 text-2xl"></i>
			<p>Empty clause</p>
		</div>
	{:else}
		<ol class="list-none p-0">
			<li class="mb-2 text-justify indent-8">
				<span class="font-bold">{operativeNumber}.</span>
				{#each annotated.blocks as block, bi (bi)}
					{#if block.type === 'text'}
						{@const isFirst = bi === 0}
						{#if block.blockStatus !== 'same'}
							<span class={blockClasses(block.blockStatus)}>
								{#if isFirst}{@const { first, rest } = splitFirst(block.words)}{#if first}<span
											class="italic">{first.value}</span
										>{/if}{#each rest as w, i (i)}{w.value}{/each}{:else}{plainText(
										block.words
									)}{/if}{block.punctuation}
							</span>
						{:else if isFirst}
							{@const { first, rest } = splitFirst(block.words)}
							{#if first}<span class="italic">{first.value}</span
								>{/if}{#each rest as w, wi (wi)}<span class={wordClasses(w.status)}>{w.value}</span
								>{/each}{block.punctuation}
						{:else}
							<p class="mb-1 mt-2 text-justify indent-8">
								{#each block.words as w, wi (wi)}<span class={wordClasses(w.status)}>{w.value}</span
									>{/each}{block.punctuation}
							</p>
						{/if}
					{:else}
						{@render subList(block.items, 1)}
					{/if}
				{/each}
			</li>
		</ol>
	{/if}
</div>

{#snippet subList(items: AnnotatedSubItem[], depth: number)}
	<ol class="mt-2 list-none p-0">
		{#each items as item, index (index)}
			<li class="mb-1 text-justify {depth === 1 ? 'indent-8' : 'pl-8 indent-0'}">
				<span>{getSubClauseLabel(index, depth)}</span>
				{#each item.blocks as block, bi (bi)}
					{#if block.type === 'text'}
						{#if item.status !== 'same'}
							<span class={blockClasses(item.status)}>
								{plainText(block.words)}{block.punctuation}
							</span>
						{:else}
							{#each block.words as w, wi (wi)}<span class={wordClasses(w.status)}>{w.value}</span
								>{/each}{block.punctuation}
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
