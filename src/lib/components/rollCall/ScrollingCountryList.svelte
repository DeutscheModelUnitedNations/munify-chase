<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { representationName, rollCallMark, type RollCallMark } from './rollCallRow';
	import Flag from '../Flag.svelte';
	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Icon {
		id: string;
		icon: string;
		color?: 'info' | 'success' | 'error';
	}

	interface Props {
		currentIndex: number;
		members: Array<{
			id: string;
			present: boolean;
			representation?: {
				name?: string | null;
				alpha2Code?: string | null;
				alpha3Code?: string | null;
				icon?: string | null;
				type?: string | null;
			} | null;
		}>;
		height?: string;
		icons?: Icon[];
		/** Member IDs whose presence change is still saving — shown as a spinner. */
		pendingIds?: string[];
	}

	let { currentIndex, members, height = '70vh', icons, pendingIds = [] }: Props = $props();

	let containerRef: HTMLElement;
	let listContainerRef: HTMLElement;

	let offset = $state(0);

	function centerSelectedCountry() {
		if (!containerRef || !listContainerRef) return;

		const parentHeight = listContainerRef.clientHeight;

		const containerHeight = containerRef.clientHeight;

		const elementHeight = containerHeight / members.length;
		const elementOffset = elementHeight * currentIndex + elementHeight / 2;

		offset = -elementOffset + parentHeight / 2;
	}

	// Watch for changes in currentCountry
	$effect(() => {
		if (currentIndex !== undefined) {
			centerSelectedCountry();
		}
	});
</script>

{#snippet markIcon(mark: RollCallMark, icon: Icon | undefined)}
	{#if mark === 'pending'}
		<span
			class="loading loading-spinner loading-md text-info absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			transition:scale={{
				duration: 500,
				easing: cubicOut,
				opacity: 0
			}}
		></span>
	{:else if mark === 'icon'}
		<i
			aria-hidden="true"
			class="ph-fill ph-{icon?.icon} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-2xl text-{icon?.color}"
			transition:scale={{
				delay: 200,
				duration: 500,
				easing: cubicOut,
				opacity: 0
			}}
		></i>
	{:else if mark === 'absent'}
		<i
			aria-hidden="true"
			class="ph-fill ph-x-circle text-error absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-3xl"
			transition:scale={{
				delay: 200,
				duration: 500,
				easing: cubicOut,
				opacity: 0
			}}
		></i>
	{:else if mark === 'present'}
		<i
			aria-hidden="true"
			class="ph-fill ph-check icon-beat-fade text-success absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-3xl"
			in:scale={{
				delay: 200,
				duration: 500,
				easing: cubicOut,
				opacity: 0
			}}
		></i>
	{/if}
{/snippet}

<div class="relative flex h-full w-full flex-col gap-2 overflow-hidden pr-6 pl-6">
	<div class="absolute top-0 bottom-0 left-0 z-40 flex items-center justify-center">
		<i aria-hidden="true" class="ph-fill ph-caret-right text-4xl"></i>
	</div>
	<div class="absolute top-0 right-0 bottom-0 z-40 flex items-center justify-center">
		<i aria-hidden="true" class="ph-fill ph-caret-left text-4xl"></i>
	</div>
	<div class="relative overflow-hidden" bind:this={listContainerRef} style="max-height: {height};">
		<div
			class="from-base-100 pointer-events-none absolute top-0 left-0 z-40 h-32 w-full bg-gradient-to-b to-transparent"
		></div>
		<div
			class="from-base-100 pointer-events-none absolute bottom-0 left-0 z-40 h-32 w-full bg-gradient-to-t to-transparent"
		></div>
		<div class="card bg-base-300 absolute top-1/2 left-0 -z-10 h-22 w-full -translate-y-1/2"></div>
		<div
			class="transition-transform duration-500"
			style="transform: translateY({offset}px);"
			bind:this={containerRef}
		>
			{#each members as member, index (member.id)}
				{@const pending = pendingIds.includes(member.id)}
				{@const icon = icons?.find((x) => x.id === member.id)}
				{@const mark = rollCallMark({
					present: member.present,
					pending,
					hasIcon: !!icon,
					called: index < currentIndex
				})}
				<div
					class="flex w-full flex-shrink-0 flex-row items-center gap-4 p-2"
					class:card-active={currentIndex === index}
				>
					<Flag representation={member.representation} size="md" />
					<h3
						class="flex-1 text-2xl transition-all duration-500"
						class:opacity-40={mark === 'absent'}
					>
						{representationName(member.representation) ?? m.unknown()}
					</h3>
					<div class="relative w-12">
						{@render markIcon(mark, icon)}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
