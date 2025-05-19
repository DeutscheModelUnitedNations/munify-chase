<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		text: string;
		children?: Snippet;
	}

	let { title, text, children }: Props = $props();
</script>

<h1
	class="text-center font-serif text-3xl leading-tight font-bold text-slate-900 lg:text-right lg:text-4xl"
>
	{title}
</h1>
<div class="pb-10 lg:pb-0">
	<p class="text-md text-center leading-normal text-slate-900 lg:text-left lg:text-lg">
		{text}
	</p>
	{#if children}
		{@render children()}
	{/if}
</div>
