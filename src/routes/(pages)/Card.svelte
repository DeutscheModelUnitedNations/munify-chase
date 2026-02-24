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

<div class="card bg-base-100 border border-base-300 relative h-full flex-1 shadow-lg">
	<div class="card-header flex max-h-60 items-center justify-center p-8">
		<img {src} {alt} class="h-full w-full" />
	</div>
	<div class="card-body">
		<h2 class="mb-4 text-center font-serif text-3xl font-bold">
			{header}
		</h2>
		<p class="text-md text-center">{text}</p>
	</div>
	{#if comingSoonRibbon}
		<ComingSoonRibbon />
	{/if}
</div>
