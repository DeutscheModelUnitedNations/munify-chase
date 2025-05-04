<script lang="ts">
	import type { CommitteeStatusEnum$options } from '$houdini';
	import { getCommitteeStatusBackground } from '$lib/utils/committeeStatus';
	import Marquee from 'svelte-fast-marquee';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	dayjs.extend(duration);

	interface Props {
		text: string;
		faIcon: string;
		committeeStatus?: CommitteeStatusEnum$options;
		until?: Date;
		marqueeOnOverflow?: boolean;
	}

	let { text, faIcon, committeeStatus, until, marqueeOnOverflow = true }: Props = $props();

	let textElement = $state<HTMLParagraphElement>();
	let isOverflowing = $state(false);

	function checkOverflow() {
		if (textElement) {
			isOverflowing = textElement.scrollWidth > textElement.clientWidth;
		}
	}

	onMount(() => {
		checkOverflow();
		window.addEventListener('resize', checkOverflow);
		return () => window.removeEventListener('resize', checkOverflow);
	});

	let countdownDelta = $state<duration.Duration>();

	let countdownDeltaInFuture = $derived(() => {
		if (until) {
			const now = dayjs(new Date());
			const untilDate = dayjs(until);
			return now.isBefore(untilDate);
		}
		return false;
	});

	$effect(() => {
		if (until) {
			const interval = setInterval(() => {
				const now = dayjs(new Date());
				const untilDate = dayjs(until);
				countdownDelta = dayjs.duration(untilDate.diff(now));
			}, 1000);
			return () => clearInterval(interval);
		}
	});
</script>

<div
	class="alert block w-full text-lg shadow-sm {committeeStatus
		? getCommitteeStatusBackground(committeeStatus)
		: ''}"
>
	<div class="flex w-full flex-1 flex-row items-center gap-4 overflow-hidden">
		<i class="fas fa-{faIcon.replace('fa-', '')} w-6 flex-none text-center"></i>

		{#if !isOverflowing || !marqueeOnOverflow || until}
			<div class="flex w-full flex-1 flex-col">
				<div bind:this={textElement} class="w-full text-nowrap">
					{text}
				</div>
				{#if until}
					<p class="text-sm">
						{m.until({
							time:
								until?.toLocaleTimeString(getLocale(), {
									hour: '2-digit',
									minute: '2-digit'
								}) ?? m.unknown()
						})}
					</p>
				{/if}
			</div>
		{:else}
			<Marquee
				speed={30}
				class="w-full flex-1"
				gap="1rem"
				style="mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);"
			>
				<p class="text-nowrap">{text}</p>
				<p>+++</p>
			</Marquee>
		{/if}

		{#if until && countdownDelta}
			{#if countdownDeltaInFuture()}
				<p class="flex-none font-mono">
					{countdownDelta.hours() !== 0 ? countdownDelta.format('H:') : ''}{countdownDelta.format(
						'mm:ss'
					)}
				</p>
			{:else}
				<i class="fas fa-bell fa-shake"></i>
			{/if}
		{/if}
	</div>
</div>
