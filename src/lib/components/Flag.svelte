<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
		alpha2Code?: string | null;
		nsa?: boolean;
		un?: boolean;
		icon?: string | null;
		placeholder?: boolean;
	}

	let {
		size = 'md',
		alpha2Code,
		nsa = false,
		un = false,
		icon = 'fa-bullhorn',
		placeholder = false
	}: Props = $props();

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

	const placeholderIcon = () => {
		const worldIcons = [
			'earth-americas',
			'earth-europe',
			'earth-asia',
			'earth-africa',
			'earth-oceania'
		];
		const randomIndex = Math.floor(Math.random() * worldIcons.length);
		return worldIcons[randomIndex];
	};
</script>

<div
	class="{flagClassNames()} card items-center justify-center overflow-hidden shadow-md {nsa &&
		'bg-error text-error-content'} {placeholder &&
		'bg-base-200 text-base-content opacity-50'} {size === 'xs' && 'rounded-sm'}"
>
	{#if placeholder}
		<i class="fa-solid fa-{placeholderIcon()} {iconClassNames()}"></i>
	{:else if nsa}
		<i class="fa-solid fa-{icon?.replace('fa-', '')} {iconClassNames()}"></i>
	{:else}
		<span class="fi fi-{un ? 'un' : alpha2Code}"></span>
	{/if}
</div>

<style>
	.fi {
		width: 100% !important;
		line-height: 100rem !important;
	}
</style>
