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

<div class="card border-base-300 bg-base-100 relative h-full gap-4 border p-8">
	<img {src} {alt} class="mb-4 h-40 w-full object-contain" />
	<h3 class="text-primary text-xl leading-none font-light">{header}</h3>
	<p class="text-[15px] leading-[1.3]">{text}</p>
	{#if comingSoonRibbon}
		<ComingSoonRibbon />
	{/if}
</div>
