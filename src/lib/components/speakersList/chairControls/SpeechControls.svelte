<script lang="ts">
	import type { SpeakerslistcategoryEnum } from '$lib/api/rumbleClient/client';
	import { client } from '$lib/api/rumbleClient/client';
	import Kbd from '$lib/components/Kbd.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getServerTime } from '$lib/state/serverTime.svelte';
	import hotkeys from 'hotkeys-js';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	type List = {
		id: string;
		type: string;
		speakingTime: number;
		startTimestamp?: Date | null;
		timeLeft: number;
		speakers: Array<{ id: string; position: number }>;
	} | null;

	interface Props {
		type: SpeakerslistcategoryEnum;
		speakersList?: List;
		otherList?: List;
	}

	let { speakersList, type, otherList }: Props = $props();

	let timerRunning = $derived(!!speakersList?.startTimestamp);

	const startTimer = async () => {
		if (!speakersList) return;

		const ops: Promise<unknown>[] = [
			client.mutate.updateSpeakersList({
				__args: { id: speakersList.id, startTimestamp: getServerTime().toDate() },
				id: true,
				speakingTime: true,
				startTimestamp: true,
				phase: true
			})
		];

		if (otherList) {
			ops.push(
				client.mutate.updateSpeakersList({
					__args: {
						id: otherList.id,
						timeLeft:
							otherList.type === 'SPEAKERS_LIST'
								? speakersList.speakingTime
								: otherList.speakingTime,
						stopTimer: true,
						// When starting the comment list timer, mark the speakers list as entering question phase
						...(type === 'COMMENT_LIST' ? { phase: 'QUESTION' } : {})
					},
					id: true,
					speakingTime: true,
					timeLeft: true,
					startTimestamp: true,
					phase: true
				})
			);
		}

		const results = await Promise.all(ops);
		if (results.some((r) => !r)) toast.error(m.errorUpdatingTimer());
	};

	const stopTimer = async () => {
		if (!speakersList) return;

		const promises: Promise<unknown>[] = [
			client.mutate
				.updateSpeakersList({
					__args: {
						id: speakersList.id,
						stopTimer: true
					},
					id: true,
					timeLeft: true,
					startTimestamp: true,
					phase: true
				})
				.then((r) => {
					if (!r) toast.error(m.errorUpdatingTimer());
				})
		];

		// When stopping the comment list timer, transition the speakers list to answer phase
		if (type === 'COMMENT_LIST' && otherList) {
			promises.push(
				client.mutate.updateSpeakersList({
					__args: { id: otherList.id, phase: 'ANSWER' },
					id: true,
					phase: true
				})
			);
		}

		await Promise.all(promises);
	};

	const resetTimer = async () => {
		if (!speakersList) return;

		await client.mutate
			.updateSpeakersList({
				__args: {
					id: speakersList.id,
					timeLeft: speakersList.speakingTime,
					startTimestamp: speakersList.startTimestamp ? getServerTime().toDate() : undefined,
					stopTimer: !speakersList.startTimestamp
				},
				id: true,
				timeLeft: true,
				startTimestamp: true,
				phase: true
			})
			.then((r) => {
				if (!r) {
					toast.error(m.errorUpdatingTimer());
				}
			});
	};

	const changeTimer = async (delta: number) => {
		if (!speakersList) return;

		await client.mutate
			.updateSpeakersList({
				__args: { id: speakersList.id, timeLeft: speakersList.timeLeft + delta },
				id: true,
				timeLeft: true
			})
			.then((r) => {
				if (!r) {
					toast.error(m.errorUpdatingTimer());
				}
			});
	};

	onMount(() => {
		hotkeys('space, shift+space, alt+r, alt+shift+r', (event, handler) => {
			event.preventDefault();
			if (!speakersList?.speakers?.length) return;
			switch (handler.key) {
				case 'space':
					if (type === 'SPEAKERS_LIST') {
						if (timerRunning) {
							stopTimer();
						} else {
							startTimer();
						}
					}
					break;
				case 'shift+space':
					if (type === 'COMMENT_LIST') {
						console.log('Start /Stop Timer Comment List');
						if (timerRunning) {
							stopTimer();
						} else {
							startTimer();
						}
					}
					break;
				case 'alt+r':
					if (type === 'SPEAKERS_LIST') {
						console.log('Reset Timer Speakers List');
						resetTimer();
					}
					break;
				case 'alt+shift+r':
					if (type === 'COMMENT_LIST') {
						console.log('Reset Timer Comment List');
						resetTimer();
					}
					break;
			}
		});
	});
</script>

<div class="flex gap-2">
	<button
		class="btn btn-lg join-item flex flex-1 gap-2
			{(!speakersList?.speakers?.length && 'btn-disabled') || (timerRunning ? 'bg-error' : 'bg-success')}"
		onclick={timerRunning ? stopTimer : startTimer}
	>
		{#if timerRunning}
			<i class="fas fa-pause"></i>
		{:else}
			<i class="fas fa-play"></i>
		{/if}
		{m.timer()}
		{#if type === 'COMMENT_LIST'}
			<Kbd hotkey="shift+space" class="text-base-content" />
		{:else if type === 'SPEAKERS_LIST'}
			<Kbd hotkey="space" class="text-base-content" />
		{/if}
	</button>
	<div class="join">
		<button
			class="btn btn-lg join-item flex gap-2
				{!speakersList?.speakers?.length ? 'btn-disabled' : 'btn-square'}"
			aria-label="remove time"
			onclick={() => changeTimer(-10)}
		>
			<i class="fas fa-minus"></i>
		</button>
		<button
			class="btn btn-lg join-item flex gap-2
				{!speakersList?.speakers?.length ? 'btn-disabled' : ''}"
			onclick={resetTimer}
		>
			<i class="fas fa-rotate-left"></i>
			{#if type === 'COMMENT_LIST'}
				<Kbd hotkey="alt+shift+R" class="text-base-content" />
			{:else if type === 'SPEAKERS_LIST'}
				<Kbd hotkey="alt+R" class="text-base-content" />
			{/if}
		</button>
		<button
			class="btn btn-lg join-item flex gap-2
				{!speakersList?.speakers?.length ? 'btn-disabled' : 'btn-square'}"
			aria-label="add time"
			onclick={() => changeTimer(10)}
		>
			<i class="fas fa-plus"></i>
		</button>
	</div>
</div>
