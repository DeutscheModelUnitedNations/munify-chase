<script lang="ts">
import dayjs from "dayjs";
import type duration from "dayjs/plugin/duration";
import { check } from "drizzle-orm/gel-core";
import { onMount } from "svelte";
import Marquee from "svelte-fast-marquee";
import type { CommitteeStatusEnum$options } from "$houdini";
import * as m from "$lib/paraglide/messages.js";
import { getLocale } from "$lib/paraglide/runtime";
import { serverTime } from "$lib/state/serverTime.svelte";
import { getCommitteeStatusBackground } from "$lib/utils/committeeStatus";

interface Props {
  text: string;
  faIcon?: string;
  iconText?: string;
  committeeStatus?: CommitteeStatusEnum$options;
  until?: Date;
  marqueeOnOverflow?: boolean;
  fullHeight?: boolean;
  hideCountdown?: boolean;
}

const {
  text,
  faIcon,
  iconText,
  committeeStatus,
  until,
  marqueeOnOverflow = true,
  fullHeight = false,
  hideCountdown = false,
}: Props = $props();

const textElement = $state<HTMLParagraphElement>();
let isOverflowing = $state(false);

function checkOverflow() {
  if (textElement) {
    isOverflowing = textElement.scrollWidth > textElement.clientWidth;
  }
}

onMount(() => {
  checkOverflow();
  window.addEventListener("resize", checkOverflow);
  return () => window.removeEventListener("resize", checkOverflow);
});

let countdownDelta = $state<duration.Duration>();

const countdownDeltaInFuture = $derived(() => {
  if (until) {
    const untilDate = dayjs(until);
    return $serverTime.isBefore(untilDate);
  }
  return false;
});

$effect(() => {
  const calculateCountdown = () => {
    const untilDate = dayjs(until);
    countdownDelta = dayjs.duration(untilDate.diff($serverTime));
  };
  if (until) {
    calculateCountdown();
    const interval = setInterval(() => calculateCountdown(), 1000);
    return () => clearInterval(interval);
  }
});
</script>

<div
	class="alert block w-full text-lg shadow-sm {committeeStatus
		? getCommitteeStatusBackground(committeeStatus)
		: ''} {fullHeight ? 'h-full' : ''}"
>
	<div class="flex h-full w-full flex-1 flex-row items-center gap-4 overflow-hidden">
		{#if iconText}
			<div class="flex-none text-center text-4xl font-bold">{iconText}</div>
		{:else if faIcon}
			<i class="fas fa-{faIcon.replace('fa-', '')} w-6 flex-none text-center"></i>
		{/if}

		{#if !isOverflowing || !marqueeOnOverflow || until}
			<div class="flex w-full flex-1 flex-col overflow-hidden">
				<h3 bind:this={textElement} class="w-full text-nowrap">
					{text}
				</h3>
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

		{#if until && countdownDelta && !hideCountdown}
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
