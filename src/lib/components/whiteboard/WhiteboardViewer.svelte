<script lang="ts">
	import { m } from '#lib/paraglide/messages';

	interface Props {
		data?: string | null;
	}

	let { data }: Props = $props();
</script>

<div class="prose leading-6">
	{#if data && data !== '<p></p>'}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- whiteboard content is sanitized server-side -->
		{@html data}
	{:else}
		<p class="text-center opacity-60">
			<i class="ph-fill ph-text-t-slash mr-2"></i>{m.whiteboardIsEmpty()}
		</p>
	{/if}
</div>
