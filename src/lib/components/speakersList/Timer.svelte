<script lang="ts">
	import dayjs from 'dayjs';
	import Hourglass, { type HourglassStatus } from './Hourglass.svelte';
	import { getServerTime } from '#lib/state/serverTime.svelte';
	import { countdownSeconds, formatDuration, secondsLeft, timerStatus } from './timerMath';

	interface Props {
		noSpeaker?: boolean;
		speakingTime?: number | null;
		startTimestamp?: Date | null;
		timeLeft?: number | null;
	}

	let { noSpeaker = true, speakingTime, startTimestamp, timeLeft }: Props = $props();

	let calculatedTimeLeft = $derived(
		secondsLeft({ startTimestamp, timeLeft, now: getServerTime() })
	);
	let countdownDelta = $derived(
		dayjs.duration(
			countdownSeconds({ noSpeaker, startTimestamp, timeLeft, speakingTime, calculatedTimeLeft }),
			'seconds'
		)
	);

	let speakingTimeDelta = $derived(dayjs.duration(speakingTime ?? 0, 'seconds'));

	let overtime = $derived((calculatedTimeLeft ?? 0) < 0);

	let status: HourglassStatus = $derived(timerStatus({ startTimestamp, calculatedTimeLeft }));
</script>

<div class="flex items-center gap-2">
	<Hourglass {status} />

	<div
		class="flex items-end gap-3 {status === 'overtime'
			? 'text-error'
			: ''} transition-colors duration-1000"
	>
		<div class="flex font-mono text-2xl">
			<span
				class="{!overtime ? 'opacity-0' : ''} transition-all duration-1000"
				aria-hidden={!overtime}>+</span
			>
			<span class="transition-all duration-1000 {!overtime ? '-translate-x-3' : 'translate-x-0'}"
				>{formatDuration(countdownDelta)}
				<span class="font-mono text-lg opacity-50">
					/{formatDuration(speakingTimeDelta)}
				</span>
			</span>
		</div>
	</div>
</div>
