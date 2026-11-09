<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import {
		type OperativeClause,
		getFirstTextContent,
		getAllTextContent
	} from '@deutschemodelunitednations/munify-resolution-editor';

	interface Props {
		/** The clause the amendment targets, null while the list is shown. */
		clauseId: string | null;
		search: string;
		operative: OperativeClause[];
	}

	let { clauseId = $bindable(), search = $bindable(), operative }: Props = $props();

	const filteredClauses = $derived.by(() => {
		const q = search.trim().toLowerCase();
		if (!q) return operative;
		return operative.filter((c) => getAllTextContent(c).toLowerCase().includes(q));
	});
	const index = $derived(operative.findIndex((c) => c.id === clauseId));
	const clause = $derived(operative[index]);
</script>

<div class="flex flex-col gap-1">
	<span class="label-text text-sm font-medium">{m.targetClause()}</span>
	{#if clauseId}
		<div class="bg-base-100 flex items-start gap-2 rounded-lg px-3 py-2">
			<span class="shrink-0 font-mono text-sm font-semibold opacity-60">{index + 1}.</span>
			<span class="flex-1 text-sm">{clause ? getFirstTextContent(clause) : ''}</span>
			<button
				class="btn btn-ghost btn-xs btn-circle shrink-0"
				aria-label={m.deselect()}
				onclick={() => (clauseId = null)}
			>
				<i aria-hidden="true" class="ph-fill ph-x text-xs"></i>
			</button>
		</div>
	{:else}
		<label class="input input-bordered input-sm flex w-full items-center gap-2">
			<i aria-hidden="true" class="ph-fill ph-magnifying-glass text-base-content/40 text-xs"></i>
			<input class="grow" type="text" bind:value={search} placeholder={m.searchClauses()} />
		</label>
		<div class="bg-base-300 flex max-h-40 flex-col gap-1 overflow-y-auto rounded-lg p-1">
			{#each filteredClauses as option (option.id)}
				<button
					class="hover:bg-base-200 flex items-start gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors"
					onclick={() => (clauseId = option.id)}
				>
					<span class="shrink-0 font-mono font-semibold opacity-60"
						>{operative.indexOf(option) + 1}.</span
					>
					<span class="line-clamp-1 flex-1">{getFirstTextContent(option)}</span>
				</button>
			{:else}
				<p class="text-base-content/50 px-2 py-3 text-center text-xs">
					{m.noOperativeClauses()}
				</p>
			{/each}
		</div>
	{/if}
</div>
