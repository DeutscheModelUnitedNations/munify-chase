<script lang="ts">
import { Popover, Separator, Toggle } from "bits-ui";
import type { Snippet } from "svelte";
import { fly } from "svelte/transition";

interface Props {
  open?: boolean;
  Trigger: Snippet;
  Content: Snippet;
}

const { open = $bindable(false), Trigger, Content }: Props = $props();
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
