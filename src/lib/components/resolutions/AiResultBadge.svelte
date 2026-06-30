<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import AiIcon from '$lib/components/AiIcon.svelte';

	interface Props {
		label: string;
		cls: string;
		onclick: () => void;
	}

	let { label, cls, onclick }: Props = $props();
	let hovered = $state(false);
</script>

<button
	class="badge badge-sm {cls} cursor-pointer gap-1"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	{onclick}
>
	<span class="relative flex items-center" style="width: 0.75rem; height: 0.75rem;">
		{#if hovered}
			<i
				class="fas fa-rotate-right absolute inset-0 flex items-center justify-center text-[0.6rem]"
				in:scale={{ duration: 150, start: 0.4 }}
				out:fade={{ duration: 100 }}
			></i>
		{:else}
			<span
				class="absolute inset-0 flex items-center justify-center"
				in:scale={{ duration: 150, start: 0.4 }}
				out:fade={{ duration: 100 }}
			>
				<AiIcon />
			</span>
		{/if}
	</span>
	{label}
</button>
