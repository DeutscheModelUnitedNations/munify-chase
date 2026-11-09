<script lang="ts">
	import { createOverflowCheck } from './overflowCheck.svelte';

	interface Props {
		text: string;
		abbreviation?: string;
	}

	let { text, abbreviation }: Props = $props();

	const overflow = createOverflowCheck();
</script>

<div class="alert py-0 block h-full w-full justify-center text-lg shadow-sm">
	<div
		class="flex h-full w-full flex-1 flex-row items-center justify-center gap-4 overflow-hidden py-2"
	>
		{#if abbreviation}
			<div class="flex-none text-center text-4xl font-bold">{abbreviation}</div>
		{/if}

		{#if !overflow.overflowing}
			<div class="flex w-full flex-1 flex-col overflow-hidden">
				<h3 bind:this={overflow.element} class="w-full text-nowrap">
					{text}
				</h3>
			</div>
		{/if}
	</div>
</div>
