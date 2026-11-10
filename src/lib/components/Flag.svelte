<script lang="ts">
	import { flagCardClass, flagCountryCode, type FlagRepresentation } from './flag';

	type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'full';

	interface Props {
		size?: FlagSize;
		representation?: FlagRepresentation | null;
		placeholder?: boolean;
	}

	let { size = 'md', placeholder = false, representation }: Props = $props();

	const FLAG_CLASSES: Record<FlagSize, string> = {
		xs: 'w-[2rem] h-[1.5rem]',
		sm: 'w-[4rem] h-[3rem]',
		md: 'w-[6rem] h-[4.5rem]',
		lg: 'w-[8rem] h-[6rem]',
		full: 'w-full aspect-[4/3]'
	};

	const ICON_CLASSES: Partial<Record<FlagSize, string>> = {
		xs: 'text-base',
		sm: 'text-lg',
		md: 'text-2xl',
		lg: 'text-5xl'
	};
	const iconClass = $derived(ICON_CLASSES[size]);

	const placeholderIcon = () => {
		const worldIcons = ['globe-hemisphere-west', 'globe-hemisphere-east', 'globe'];
		const randomIndex = Math.floor(Math.random() * worldIcons.length);
		return worldIcons[randomIndex];
	};

	let countryCode = $derived(flagCountryCode(representation));
</script>

<div
	class="{FLAG_CLASSES[
		size
	]} card items-center justify-center overflow-hidden shadow-md {flagCardClass({
		type: representation?.type,
		placeholder
	})}"
>
	{#if placeholder}
		<i aria-hidden="true" class="ph-fill ph-{placeholderIcon()} {iconClass}"></i>
	{:else if representation?.icon}
		<i aria-hidden="true" class="ph-fill ph-{representation.icon} {iconClass}"></i>
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
