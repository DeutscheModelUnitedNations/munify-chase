<script lang="ts">
	import { queueMetrics, representationLabel, shortCode, speakerMember } from './speakerQueue';
	import { flip } from 'svelte/animate';
	import Flag from '../Flag.svelte';
	import { queueFlip, queueIn, queueOut } from '#lib/helpers/queueTransitions';
	import { fly } from 'svelte/transition';
	import StripesAlert from './StripesAlert.svelte';
	import { m } from '#lib/paraglide/messages';
	import Marquee from 'svelte-fast-marquee';
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import { compareSpeakers } from '#lib/helpers/speakerSort';
	import { prefersReducedMotion } from 'svelte/motion';

	interface Props {
		// speaker on list
		rawSpeakers?: Array<{
			id: string;
			position: number;
			overwriteName?: string | null;
			committeeMember?: {
				id: string;
				representation?: {
					name?: string | null;
					alpha2Code?: string | null;
					alpha3Code?: string | null;
					icon?: string | null;
					type?: string | null;
				} | null;
			} | null;
			conferenceMember?: {
				id: string;
				representation?: {
					name?: string | null;
					alpha2Code?: string | null;
					alpha3Code?: string | null;
					icon?: string | null;
					type?: string | null;
				} | null;
			} | null;
		}>;
		closed?: boolean;
		resizeFn?: () => void;
	}

	// eslint-disable-next-line no-useless-assignment -- $bindable() initializer is read by parent
	let { rawSpeakers, closed = false, resizeFn = $bindable() }: Props = $props();

	let speakers = $derived(rawSpeakers?.toSorted(compareSpeakers).toSpliced(0, 1));

	type Speaker = NonNullable<Props['rawSpeakers']>[number];

	let container = $state<HTMLElement | null>(null);
	let overflowContainer = $state<HTMLElement | null>(null);
	let containerHeight = $state(250);
	let rowHeight = $state(70);
	let reservedHeight = $state(50); // Reserve space for the header and footer, adjust as needed
	let visibleCount = $derived(Math.floor((containerHeight - reservedHeight) / rowHeight));

	const resize = () => {
		if (!container || !overflowContainer) return;
		({ containerHeight, rowHeight, reservedHeight } = queueMetrics({
			containerHeight: container.clientHeight,
			firstRowHeight: container.children[0]?.clientHeight,
			overflowHeight: overflowContainer.clientHeight
		}));
	};

	$effect(() => {
		if (browser) {
			resize();
			window.addEventListener('resize', resize);
			container?.addEventListener('reset', resize);
			return () => {
				window.removeEventListener('resize', resize);
				container?.removeEventListener('reset', resize);
			};
		}
	});

	onMount(() => {
		resizeFn = resize;
	});
</script>

{#snippet srQueue(speakers: Speaker[] | undefined)}
	{#if speakers && speakers.length > 0}
		<ol aria-label={m.a11yUpcomingSpeakers()}>
			{#each speakers as speaker (speaker.id)}
				<li>{representationLabel(speakerMember(speaker))}</li>
			{/each}
		</ol>
	{:else}
		<p>{m.listEmpty()}</p>
	{/if}
	{#if closed}
		<p>{m.listClosed()}</p>
	{/if}
{/snippet}

{#snippet closedAlert()}
	<StripesAlert badgeColor="error" stripeColor="error" icon="lock" badgeText={m.listClosed()} />
{/snippet}

{#snippet overflowQueue(speakers: Speaker[])}
	<div
		class="bg-base-200 card mt-2 flex w-full items-center justify-center inset-shadow-sm transition-all duration-300"
		class:opacity-100={speakers.length > visibleCount}
		class:opacity-0={speakers.length <= visibleCount}
	>
		<Marquee speed={30} gap="3rem" play={!prefersReducedMotion.current} pauseOnHover>
			<div class="flex items-center justify-center gap-2 py-4" bind:this={overflowContainer}>
				{#each speakers.slice(visibleCount) as speaker, i (i)}
					{@const member = speakerMember(speaker)}
					<div class="card bg-base-100 flex w-16 items-center justify-center gap-1 p-2 shadow-sm">
						<div class="w-4 text-sm opacity-50">{i + 1 + visibleCount}.</div>
						<Flag representation={member?.representation} size="full" />
						<div class="text-center font-mono font-bold">{shortCode(member)}</div>
					</div>
				{/each}
			</div>
			{#if closed}
				{@render closedAlert()}
			{/if}
		</Marquee>
	</div>
{/snippet}

<!-- What the queue below shows by fitting rows to the height and scrolling the rest: everyone
	 waiting, in order -->
<div class="sr-only">
	{@render srQueue(speakers)}
</div>

<div
	class="relative flex h-full w-full flex-col overflow-hidden"
	bind:this={container}
	aria-hidden="true"
>
	{#if speakers && speakers.length > 0}
		{#each speakers.slice(0, visibleCount) as speaker, i (speaker.id)}
			{@const member = speakerMember(speaker)}
			<div
				class="flex items-center gap-4 py-2"
				animate:flip={queueFlip}
				in:fly={queueIn}
				out:fly={queueOut}
			>
				<div class="w-4 text-sm opacity-50">{i + 1}.</div>
				<Flag representation={member?.representation} size="sm" />
				<h2 class="text-lg font-bold">{representationLabel(member)}</h2>
			</div>
		{/each}
		{@render overflowQueue(speakers)}
	{:else}
		<StripesAlert badgeText={m.listEmpty()} />
	{/if}
	{#if closed && (speakers?.length || 0) <= visibleCount}
		{@render closedAlert()}
	{/if}
</div>
