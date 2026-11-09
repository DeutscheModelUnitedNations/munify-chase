<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import type { CommitteestatusEnum } from '#lib/api/rumbleClient/client';
	import { getCommitteeStatusBackground } from '#lib/utils/committeeStatus';
	import Marquee from 'svelte-fast-marquee';
	import { createOverflowCheck } from './overflowCheck.svelte';
	import { formatCountdown } from './countdown';
	import * as m from '#lib/paraglide/messages';
	import { getLocale } from '#lib/paraglide/runtime';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import { getServerTime } from '#lib/state/serverTime.svelte';

	interface Props {
		text: string;
		icon?: string;
		iconText?: string;
		committeeStatus?: CommitteestatusEnum;
		until?: Date;
		marqueeOnOverflow?: boolean;
		fullHeight?: boolean;
		hideCountdown?: boolean;
		/** Tailwind font-size class for the main text/icon — defaults to text-lg. */
		textClass?: string;
		/** Tailwind font-size class for the "until HH:MM" line — defaults to text-sm. */
		subTextClass?: string;
	}

	let {
		text,
		icon,
		iconText,
		committeeStatus,
		until,
		marqueeOnOverflow = true,
		fullHeight = false,
		hideCountdown = false,
		textClass = 'text-lg',
		subTextClass = 'text-sm'
	}: Props = $props();

	const overflow = createOverflowCheck();
	const showMarquee = $derived(overflow.overflowing && marqueeOnOverflow);
	const statusBackground = $derived(
		committeeStatus ? getCommitteeStatusBackground(committeeStatus) : ''
	);
	const untilTime = $derived(
		until?.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }) ?? m.unknown()
	);

	let countdownDelta = $state<duration.Duration>();

	let countdownDeltaInFuture = $derived(() => {
		if (until) {
			const untilDate = dayjs(until);
			return getServerTime().isBefore(untilDate);
		}
		return false;
	});

	$effect(() => {
		const calculateCountdown = () => {
			const untilDate = dayjs(until);
			countdownDelta = dayjs.duration(untilDate.diff(getServerTime()));
		};
		if (until) {
			calculateCountdown();
			const interval = setInterval(() => calculateCountdown(), 1000);
			return () => clearInterval(interval);
		}
	});
</script>

<div
	class="alert py-0 block w-full {textClass} shadow-sm {statusBackground}"
	class:h-full={fullHeight}
>
	<div class="flex h-full w-full min-w-0 flex-1 flex-row items-center gap-4 overflow-hidden py-2">
		{#if iconText}
			<div class="flex-none text-center text-4xl font-bold">{iconText}</div>
		{:else if icon}
			<i aria-hidden="true" class="ph-fill ph-{icon} w-6 flex-none text-center"></i>
		{/if}

		<div class="flex w-full min-w-0 flex-1 flex-col overflow-hidden">
			{#if !showMarquee}
				<h3 bind:this={overflow.element} class="w-full min-w-0 truncate">
					{text}
				</h3>
			{:else}
				<!-- The text twice and a separator, scrolling: a screen reader gets it once instead -->
				<h3 class="sr-only">{text}</h3>
				<div class="flex w-full min-w-0 flex-1" aria-hidden="true">
					<Marquee
						play={!prefersReducedMotion.current}
						pauseOnHover
						speed={30}
						class="w-full min-w-0 flex-1"
						gap="1rem"
						style="mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);"
					>
						<p class="text-nowrap">{text}</p>
						<p>+++</p>
					</Marquee>
				</div>
			{/if}
			{#if until}
				<p class={subTextClass}>{m.until({ time: untilTime })}</p>
			{/if}
		</div>

		{#if until && countdownDelta && !hideCountdown}
			{#if countdownDeltaInFuture()}
				<p class="flex-none font-mono">{formatCountdown(countdownDelta)}</p>
			{:else}
				<i aria-hidden="true" class="ph-fill ph-bell icon-shake"></i>
			{/if}
		{/if}
	</div>
</div>
