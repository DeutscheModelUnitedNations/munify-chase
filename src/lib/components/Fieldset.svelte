<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		legend?: string;
		icon?: string;
		className?: string;
	}

	let { children, legend, icon, className = '' }: Props = $props();
</script>

<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 {className}">
	{#if legend}
		<legend class="fieldset-legend">
			{#if icon}
				<i aria-hidden="true" class="ph-duotone ph-{icon} mr-1"></i>
			{/if}
			{legend}
		</legend>
	{/if}
	{@render children()}
</fieldset>
