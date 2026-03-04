<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		legend?: string;
		faIcon?: string;
		className?: string;
	}

	let { children, legend, faIcon, className = '' }: Props = $props();
</script>

<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4 {className}">
	{#if legend}
		<legend class="fieldset-legend">
			{#if faIcon}
				<i class="{faIcon} mr-1"></i>
			{/if}
			{legend}
		</legend>
	{/if}
	{@render children()}
</fieldset>
