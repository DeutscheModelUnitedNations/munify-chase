<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** The organisation's Phosphor icon, a badge when it has none */
		icon?: string | null;
		name: string;
		/** The organisation's name, shown muted after the person's */
		orgName?: string | null;
		children?: Snippet;
	}

	let { icon, name, orgName, children }: Props = $props();
</script>

<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
	<i aria-hidden="true" class="ph-fill ph-{icon || 'identification-badge'} text-lg"></i>
	<span class="flex-1">{name}</span>
	{#if orgName}
		<span class="text-base-content/60 text-sm">{orgName}</span>
	{/if}
	{@render children?.()}
</li>
