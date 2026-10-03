<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		text: string;
		children?: Snippet;
	}

	let { title, text, children }: Props = $props();
</script>

<div class="flex flex-col items-start gap-4">
	<h3 class="text-primary text-xl leading-none font-light">{title}</h3>
	<p class="text-[15px] leading-[1.3]">{text}</p>
	{#if children}
		{@render children()}
	{/if}
</div>
