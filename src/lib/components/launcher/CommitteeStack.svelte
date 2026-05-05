<script lang="ts">
	interface Props {
		committees: ReadonlyArray<{ abbreviation: string }>;
		max?: number;
		size?: 'sm' | 'md' | 'lg';
	}

	let { committees, max = 4, size = 'sm' }: Props = $props();

	const visible = $derived(committees.slice(0, max));
	const overflow = $derived(Math.max(0, committees.length - max));

	const sizeClass = $derived.by(() => {
		switch (size) {
			case 'lg':
				return 'badge-lg';
			case 'md':
				return 'badge-md';
			case 'sm':
			default:
				return 'badge-sm';
		}
	});
</script>

<div class="flex min-w-0 flex-row flex-wrap items-center gap-1">
	{#each visible as c (c.abbreviation)}
		<span
			class="badge badge-soft badge-primary {sizeClass} text-base-content w-max shrink-0 font-mono font-semibold uppercase"
		>
			{c.abbreviation}
		</span>
	{/each}
	{#if overflow > 0}
		<span
			class="badge badge-dash badge-ghost {sizeClass} text-base-content/55 w-max shrink-0 font-mono font-semibold"
		>
			+{overflow}
		</span>
	{/if}
</div>
