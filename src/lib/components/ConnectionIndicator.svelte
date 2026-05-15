<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	type Props = {
		live: boolean;
	};

	let { live }: Props = $props();
</script>

{#if live}
	<span class="flex items-center gap-2 text-success">
		<span class="relative flex h-2.5 w-2.5">
			<span
				class="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"
			></span>
			<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-success"></span>
		</span>
		<span class="text-xs font-medium">{m.live()}</span>
	</span>
{/if}
