<script lang="ts">
	interface Props {
		label: string;
		/** The column's current sort direction, `false` when unsorted */
		sorted: 'asc' | 'desc' | false;
		canSort: boolean;
		/** A placeholder cell of a grouped header stays empty */
		isPlaceholder: boolean;
		onclick: ((event: unknown) => void) | undefined;
	}

	let { label, sorted, canSort, isPlaceholder, onclick }: Props = $props();

	const sortIcons = {
		asc: 'ph-sort-ascending',
		desc: 'ph-sort-descending'
	} as const;
</script>

<th class={canSort ? 'cursor-pointer select-none' : ''} {onclick}>
	{#if !isPlaceholder}
		<div class="flex items-center gap-1">
			{label}
			{#if sorted}
				<i aria-hidden="true" class="ph-fill {sortIcons[sorted]} text-xs"></i>
			{:else if canSort}
				<i aria-hidden="true" class="ph-fill ph-arrows-down-up text-base-content/30 text-xs"></i>
			{/if}
		</div>
	{/if}
</th>
