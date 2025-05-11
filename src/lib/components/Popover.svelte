<script lang="ts">
	import { Popover, Separator, Toggle } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		Trigger: Snippet;
		Content: Snippet;
	}

	let { Trigger, Content }: Props = $props();

	let open = $state(false);

	let width = $state(1024);
	let height = $state(768);
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{@render Trigger()}
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content forceMount sideOffset={8}>
			{#if open}
				<div class="card bg-base-100 shadow-md" transition:fly={{ y: -20, duration: 500 }}>
					<div class="card-body p-4">
						{@render Content()}
					</div>
				</div>
			{/if}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
