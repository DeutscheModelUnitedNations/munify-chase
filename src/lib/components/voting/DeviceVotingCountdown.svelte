<script lang="ts">
	import dayjs from 'dayjs';
	import { getServerTime } from '$lib/state/serverTime.svelte';

	interface Props {
		startTimestamp: Date | string | null;
		windowSeconds: number;
		expired?: boolean;
	}

	let { startTimestamp, windowSeconds, expired = $bindable(false) }: Props = $props();

	// Re-derives every 500ms via getServerTime()'s tick (see serverTime.svelte.ts), so this
	// stays in sync across chair/participant/presentation regardless of client clock drift.
	// Consumers react to the exported `expired` themselves (see DeviceBasedVotingChair's
	// own $effect) instead of this component firing a callback — a callback fired from
	// inside this component's own $effect could otherwise race with this component being
	// torn down by the very state change the callback triggers.
	let secondsLeft = $derived(
		dayjs(startTimestamp).add(windowSeconds, 'seconds').diff(getServerTime()) / 1000
	);

	$effect(() => {
		expired = secondsLeft <= 0;
	});

	let progress = $derived(Math.max(0, Math.min(100, (secondsLeft / windowSeconds) * 100)));
</script>

<div class="flex flex-col gap-1">
	<!-- A native <progress> element's `value` can't be CSS-transitioned, so each 500ms
		server-time tick (see serverTime.svelte.ts) would snap the fill instead of gliding —
		a plain div with a `width` transition animates smoothly between ticks instead. -->
	<div class="bg-base-300 h-2 w-full overflow-hidden rounded-full">
		<div
			class="h-full rounded-full transition-[width] duration-500 ease-linear {progress <= 20
				? 'bg-error'
				: progress <= 50
					? 'bg-warning'
					: 'bg-success'}"
			style="width: {progress}%"
		></div>
	</div>
	<span class="text-center font-mono text-sm">{Math.max(0, Math.ceil(secondsLeft))}s</span>
</div>
