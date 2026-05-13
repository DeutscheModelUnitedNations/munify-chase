<script lang="ts">
	import dayjs, { type Dayjs } from 'dayjs';
	import Hourglass, { type HourglassStatus } from './Hourglass.svelte';
	import { getServerTime } from '$lib/state/serverTime.svelte';
	import { scale } from 'svelte/transition';
	import toast from 'svelte-french-toast';
	import { m } from '$lib/paraglide/messages';
	import BellIcon from '../toast/BellIcon.svelte';
	import type { Duration } from 'dayjs/plugin/duration';

	interface Props {
		noSpeaker?: boolean;
		speakingTime?: number | null;
		startTimestamp?: Date | null;
		timeLeft?: number | null;
	}

	let { noSpeaker = true, speakingTime, startTimestamp, timeLeft }: Props = $props();

	let calculatedTimeLeft = $derived.by(() => {
		if (startTimestamp && timeLeft !== null && timeLeft !== undefined) {
			return dayjs(startTimestamp).diff(getServerTime(), 'seconds') + timeLeft;
		}
		if (timeLeft !== null && timeLeft !== undefined) {
			return timeLeft;
		}
		return undefined;
	});
	let countdownDelta = $derived.by(() => {
		if (noSpeaker) {
			return dayjs.duration(speakingTime ?? 0, 'seconds');
		}
		if (!startTimestamp || calculatedTimeLeft === undefined) {
			return dayjs.duration(timeLeft ? Math.abs(timeLeft) : (speakingTime ?? 0), 'seconds');
		}
		return dayjs.duration(Math.abs(calculatedTimeLeft), 'seconds');
	});

	let speakingTimeDelta = $derived(dayjs.duration(speakingTime ?? 0, 'seconds'));

	let overtime = $derived((calculatedTimeLeft ?? 0) < 0);

	let status: HourglassStatus = $derived.by(() => {
		if (startTimestamp && (calculatedTimeLeft ?? 0) < 0) {
			return 'overtime';
		}
		if (startTimestamp && (calculatedTimeLeft ?? 0) >= 0) {
			return 'active';
		}
		return 'paused';
	});

	let countdownDeltaFormatted = (delta: Duration) => {
		return `${delta.hours() !== 0 ? delta.format('H:') : ''}${
			delta.hours() !== 0 ? delta.format('mm:') : delta.format('m:')
		}${delta.format('ss')}`;
	};
</script>

<div class="flex items-center gap-2">
	<Hourglass {status} />

	<div
		class="flex items-end gap-3 {status === 'overtime'
			? 'text-error'
			: ''} transition-colors duration-1000"
	>
		<div class="flex font-mono text-2xl">
			<span class="{!overtime ? 'opacity-0' : ''} transition-all duration-1000">+</span>
			<span class="transition-all duration-1000 {!overtime ? '-translate-x-3' : 'translate-x-0'}"
				>{countdownDeltaFormatted(countdownDelta)}
				<span class="font-mono text-lg opacity-50">
					/{countdownDeltaFormatted(speakingTimeDelta)}
				</span>
			</span>
		</div>
	</div>
</div>
