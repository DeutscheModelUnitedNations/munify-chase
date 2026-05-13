<script lang="ts">
	import { Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		open?: boolean;
		Trigger: Snippet<[{ props: Record<string, unknown> }]>;
		Content: Snippet;
	}

	let { open = $bindable(false), Trigger, Content }: Props = $props();
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			{@render Trigger({ props })}
		{/snippet}
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
