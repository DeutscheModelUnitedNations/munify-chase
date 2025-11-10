<script lang="ts">
import { m } from "$lib/paraglide/messages";

interface Props {
  data?: string | null;
}

const { data }: Props = $props();
</script>

<div class="prose leading-6">
	{#if data && data !== '<p></p>'}
		{@html data}
	{:else}
		<p class="text-center opacity-60">
			<i class="fas fa-align-slash mr-2"></i>{m.whiteboardIsEmpty()}
		</p>
	{/if}
</div>
