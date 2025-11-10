<script lang="ts">
import ComingSoonRibbon from "./ComingSoonRibbon.svelte";

interface Props {
  src: string;
  alt: string;
  header: string;
  text: string;
  comingSoonRibbon?: boolean;
}

const { src, alt, header, text, comingSoonRibbon = false }: Props = $props();
</script>

<div class="card bg-base-100 relative h-full flex-1 shadow-sm">
	<div class="card-header flex h-60 items-center justify-center p-8">
		<img {src} {alt} />
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
