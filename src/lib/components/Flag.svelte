<script lang="ts">
	import { Alpha3 } from 'convert-iso-codes';

	interface Representation {
		type?: string | null;
		name?: string | null;
		alpha2Code?: string | null;
		alpha3Code?: string | null;
		faIcon?: string | null;
		regionalGroup?: string | null;
	}

	interface Props {
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
		representation?: Representation | null;
		placeholder?: boolean;
	}

	let { size = 'md', placeholder = false, representation }: Props = $props();

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

	let countryCode = $derived.by(() => {
		if (representation?.type === 'UN') return 'un';
		if (representation?.alpha2Code) return representation.alpha2Code.toLowerCase();
		if (representation?.alpha3Code)
			return Alpha3.toAlpha2(representation.alpha3Code)?.toLowerCase();
		return null;
	});
</script>

<div
	class="{flagClassNames()} card items-center justify-center overflow-hidden shadow-md {representation?.type ===
	'NSA'
		? 'bg-error text-error-content'
		: representation?.type === 'DELEGATION' && 'text-base-content bg-[#bea162]'} {placeholder &&
		'bg-base-200 text-base-content opacity-50'} {size === 'xs' && 'rounded-sm'}"
>
	{#if placeholder}
		<i class="fa-solid fa-{placeholderIcon()} {iconClassNames()}"></i>
	{:else if representation?.faIcon}
		<i class="fa-solid fa-{representation.faIcon?.replace('fa-', '')} {iconClassNames()}"></i>
	{:else}
		<span class="fi fi-{countryCode}"></span>
	{/if}
</div>

<style>
	.fi {
		width: 100% !important;
		line-height: 100rem !important;
	}
</style>
