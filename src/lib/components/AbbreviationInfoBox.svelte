<script lang="ts">
import { onMount } from "svelte";

interface Props {
  text: string;
  abbreviation?: string;
}

const { text, abbreviation }: Props = $props();

const textElement = $state<HTMLParagraphElement>();
let isOverflowing = $state(false);

function checkOverflow() {
  if (textElement) {
    isOverflowing = textElement.scrollWidth > textElement.clientWidth;
  }
}

onMount(() => {
  checkOverflow();
  window.addEventListener("resize", checkOverflow);
  return () => window.removeEventListener("resize", checkOverflow);
});
</script>

<div class="alert block h-full w-full justify-center text-lg shadow-sm">
	<div class="flex h-full w-full flex-1 flex-row items-center justify-center gap-4 overflow-hidden">
		{#if abbreviation}
			<div class="flex-none text-center text-4xl font-bold">{abbreviation}</div>
		{/if}

		{#if !isOverflowing}
			<div class="flex w-full flex-1 flex-col overflow-hidden">
				<h3 bind:this={textElement} class="w-full text-nowrap">
					{text}
				</h3>
			</div>
		{/if}
	</div>
</div>
