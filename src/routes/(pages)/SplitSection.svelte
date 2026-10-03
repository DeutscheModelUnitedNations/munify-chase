<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		text: string;
		inverse?: boolean;
		children?: Snippet;
	}

	let { title, text, inverse = false, children }: Props = $props();
</script>

<section class={inverse ? 'bg-neutral text-neutral-content' : ''}>
	<div
		class="mx-auto flex max-w-[1200px] flex-wrap items-start gap-x-16 gap-y-8 px-4 py-16 md:px-12 lg:py-24"
	>
		<h2 class="flex-[1_1_320px] text-[27px] leading-none font-bold {inverse ? '' : 'text-primary'}">
			{title}
		</h2>
		<div class="flex flex-[2_1_420px] flex-col items-start gap-6">
			<p class="max-w-[66ch] text-[15px] leading-[1.3]">{text}</p>
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
</section>
