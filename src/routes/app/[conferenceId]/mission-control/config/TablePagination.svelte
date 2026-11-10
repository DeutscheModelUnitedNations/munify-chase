<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { visiblePages } from './conferenceUsers';

	interface Props {
		pageIndex: number;
		pageSize: number;
		pageCount: number;
		/** Rows across all pages */
		rowCount: number;
		canPrevious: boolean;
		canNext: boolean;
		onPage: (index: number) => void;
	}
	let { pageIndex, pageSize, pageCount, rowCount, canPrevious, canNext, onPage }: Props = $props();
</script>

<div class="mt-4 flex items-center justify-between">
	<span class="text-base-content/60 text-sm">
		{pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, rowCount)} / {rowCount}
	</span>
	<div class="join">
		<button
			class="join-item btn btn-sm"
			onclick={() => onPage(pageIndex - 1)}
			disabled={!canPrevious}
			aria-label={m.back()}
		>
			<i aria-hidden="true" class="ph-fill ph-caret-left"></i>
		</button>
		{#each visiblePages( { current: pageIndex, total: pageCount } ) as item, i (item === 'ellipsis' ? `ellipsis-${i}` : item)}
			{#if item === 'ellipsis'}
				<span class="join-item btn btn-sm btn-disabled">…</span>
			{:else}
				<button
					class="join-item btn btn-sm"
					class:btn-active={pageIndex === item}
					onclick={() => onPage(item)}
				>
					{item + 1}
				</button>
			{/if}
		{/each}
		<button
			class="join-item btn btn-sm"
			onclick={() => onPage(pageIndex + 1)}
			disabled={!canNext}
			aria-label={m.forward()}
		>
			<i aria-hidden="true" class="ph-fill ph-caret-right"></i>
		</button>
	</div>
</div>
