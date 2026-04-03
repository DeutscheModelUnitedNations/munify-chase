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
	class="text-center font-serif text-3xl leading-tight font-bold text-base-content lg:text-right lg:text-4xl"
>
	{title}
</h1>
<div class="pb-10 lg:pb-0 flex flex-col items-center lg:items-start">
	<p class="text-md text-center leading-normal text-base-content lg:text-left lg:text-lg">
		{text}
	</p>
	{#if children}
		{@render children()}
	{/if}
</div>
