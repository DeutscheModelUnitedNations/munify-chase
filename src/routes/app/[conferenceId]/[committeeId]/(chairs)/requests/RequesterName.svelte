<script lang="ts">
	import { requesterLabel } from '../requesters';

	interface Props {
		req: Parameters<typeof requesterLabel>[0];
		class?: string;
	}

	let { req, class: className }: Props = $props();

	const label = $derived(requesterLabel(req));
</script>

<span class={className}>
	{label.primary}
	{#if label.secondary}
		<span class="text-base-content/40">({label.secondary})</span>
	{/if}
</span>
