<script lang="ts">
	import ComingSoonRibbon from './ComingSoonRibbon.svelte';

	interface Props {
		src: string;
		alt: string;
		header: string;
		text: string;
		comingSoonRibbon?: boolean;
	}

	let { src, alt, header, text, comingSoonRibbon = false }: Props = $props();
</script>

<div class="card border-base-300 bg-base-100 relative h-full gap-4 border p-6 md:p-8">
	<img {src} {alt} class="mb-2 h-28 w-full object-contain md:mb-4 md:h-40" />
	<h3 class="text-primary text-xl leading-none font-light">{header}</h3>
	<p class="text-[15px] leading-[1.3]">{text}</p>
	{#if comingSoonRibbon}
		<ComingSoonRibbon />
	{/if}
</div>
