<script lang="ts">
	import { onMount } from 'svelte';
	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
		alpha2Code?: string | null;
		nsa?: boolean;
		icon?: string;
	}

	let { size = 'md', alpha2Code, nsa = false, icon = 'fa-hand-point-up' }: Props = $props();

	const flagClassNames = () => {
		switch (size) {
			case 'xs':
				return 'w-[2rem] h-[1.5rem]';
			case 'sm':
				return 'w-[4rem] h-[3rem]';
			case 'md':
				return 'w-[6rem] h-[4.5rem]';
			case 'lg':
				return 'w-[8rem] h-[6rem]';
			case 'full':
				return 'w-full aspect-[4/3]';
		}
	};

	const iconClassNames = () => {
		switch (size) {
			case 'xs':
				return 'text-base';
			case 'sm':
				return 'text-lg';
			case 'md':
				return 'text-2xl';
			case 'lg':
				return 'text-5xl';
		}
	};

	onMount(() => {
		if (!alpha2Code && !nsa) {
			throw new Error('No alpha2Code or NSA-Flag provided');
		}
	});
</script>

<div
	class="{flagClassNames()} card items-center justify-center overflow-hidden shadow-sm {nsa &&
		'bg-base-300'}"
>
	{#if nsa}
		<i class="fa-solid fa-{icon.replace('fa-', '')} {iconClassNames()}"></i>
	{:else}
		<span class="fi fi-{alpha2Code}"></span>
	{/if}
</div>

<style>
	.fi {
		width: 100% !important;
		line-height: 100rem !important;
	}
</style>
