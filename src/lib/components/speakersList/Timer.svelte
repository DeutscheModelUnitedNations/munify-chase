<script lang="ts">
	import { type Dayjs } from 'dayjs';
	import Hourglass, { type HourglassStatus } from './Hourglass.svelte';
	import { serverTime } from '$lib/state/serverTime.svelte';

	interface Props {
		startTimestamp?: Dayjs | null;
		timeLeft?: number | null;
	}

	let { startTimestamp, timeLeft }: Props = $props();

	let calculatedTimeLeft = $derived.by(() => {
		if (startTimestamp && timeLeft !== null && timeLeft !== undefined) {
			return startTimestamp.diff($serverTime, 'seconds') + timeLeft;
		}
		return undefined;
	});

	let status: HourglassStatus = $derived.by(() => {
		if (calculatedTimeLeft && calculatedTimeLeft < 0) {
			return 'overtime';
		}
		if (calculatedTimeLeft && calculatedTimeLeft > 0) {
			return 'active';
		}
		return 'paused';
	});
</script>

<div class="flex items-center gap-2">
	<Hourglass {status} />
</div>
