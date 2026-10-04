<script lang="ts">
	import type { SpeakerslistcategoryEnum } from '$lib/api/rumbleClient/client';
	import { client } from '$lib/api/rumbleClient/client';
	import Kbd from '$lib/components/Kbd.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getServerTime } from '$lib/state/serverTime.svelte';
	import { registerCommands } from '$lib/commands/registry.svelte';
	import toast from 'svelte-french-toast';
	import { listCommandScope } from './listCommands';

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
	// Silent debounce to absorb accidental fat-finger double-clicks that would
	// otherwise immediately undo the optimistic start/stop. Kept short and
	// non-visual: offline mutations never resolve, so a longer lock would leave
	// the button looking disabled until the timeout expired.
	let lastTimerActionAt = 0;

	const withTimerLock = (fn: () => Promise<void>) => async () => {
		const now = performance.now();
		if (now - lastTimerActionAt < 250) return;
		lastTimerActionAt = now;
		try {
			await fn();
		} catch {
			// Network errors are handled individually inside each handler.
		}
	};

	const startTimer = withTimerLock(async () => {
		if (!speakersList) return;

		const ops: Promise<unknown>[] = [
			client.mutate.updateSpeakersList({
				__args: {
					id: speakersList.id,
					startTimestamp: getServerTime().toDate(),
					// Starting the main speakers list timer always (re)enters the speech phase
					...(type === 'SPEAKERS_LIST' ? { phase: 'SPEECH' } : {})
				},
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

		const results = await Promise.allSettled(ops);
		if (results.some((r) => r.status === 'fulfilled' && !r.value))
			toast.error(m.errorUpdatingTimer());
	});

	const stopTimer = withTimerLock(async () => {
		if (!speakersList) return;

		const mutations: Promise<unknown>[] = [
			client.mutate
				.updateSpeakersList({
					__args: {
						id: speakersList.id,
						stopTimer: true,
						// Stopping the main speakers list timer marks the speech as done
						...(type === 'SPEAKERS_LIST' ? { phase: 'SPEECH_DONE' } : {})
					},
					id: true,
					timeLeft: true,
					startTimestamp: true,
					phase: true
				})
				.then((r) => {
					if (!r) toast.error(m.errorUpdatingTimer());
				})
				.catch(() => {
					// Network error — mutation was queued by the offline exchange;
					// the optimistic update keeps the timer frozen until reconnect.
				})
		];

		// When stopping the comment list timer, transition the speakers list to answer phase
		if (type === 'COMMENT_LIST' && otherList) {
			mutations.push(
				client.mutate
					.updateSpeakersList({
						__args: { id: otherList.id, phase: 'ANSWER' },
						id: true,
						phase: true
					})
					.catch(() => {})
			);
		}

		await Promise.all(mutations);
	});

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
			})
			.catch(() => {});
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
			})
			.catch(() => {});
	};

	const toggleTimer = () => (timerRunning ? stopTimer() : startTimer());
	const removeTime = () => changeTimer(-10);
	const addTime = () => changeTimer(10);

	const isCommentList = $derived(type === 'COMMENT_LIST');
	const timerShortcut = $derived(isCommentList ? 'shift+space' : 'space');
	const resetShortcut = $derived(isCommentList ? 'alt+shift+r' : 'alt+r');
	const hasSpeakers = () => !!speakersList?.speakers?.length;

	registerCommands(() => {
		const { idPrefix, context, keywords } = listCommandScope(type);
		return [
			{
				id: `${idPrefix}.timer`,
				title: timerRunning ? m.commandSpeakersListPauseTimer : m.commandSpeakersListStartTimer,
				context,
				keywords,
				group: 'page',
				icon: timerRunning ? 'pause' : 'play',
				shortcut: timerShortcut,
				enabled: hasSpeakers,
				run: toggleTimer
			},
			{
				id: `${idPrefix}.add-time`,
				title: m.commandSpeakersListAddTime,
				context,
				keywords,
				group: 'page',
				icon: 'plus',
				enabled: hasSpeakers,
				run: addTime
			},
			{
				id: `${idPrefix}.remove-time`,
				title: m.commandSpeakersListRemoveTime,
				context,
				keywords,
				group: 'page',
				icon: 'minus',
				enabled: hasSpeakers,
				run: removeTime
			},
			{
				id: `${idPrefix}.reset-timer`,
				title: m.commandSpeakersListResetTimer,
				context,
				keywords,
				group: 'page',
				icon: 'rotate-left',
				shortcut: resetShortcut,
				enabled: hasSpeakers,
				run: resetTimer
			}
		];
	});
</script>

<div class="flex gap-2">
	<button
		class="btn btn-lg join-item flex flex-1 gap-2
			{!speakersList?.speakers?.length ? 'btn-disabled' : timerRunning ? 'bg-error' : 'bg-success'}"
		onclick={toggleTimer}
	>
		{#if timerRunning}
			<i class="fas fa-pause"></i>
		{:else}
			<i class="fas fa-play"></i>
		{/if}
		{m.timer()}
		<Kbd hotkey={timerShortcut} class="text-base-content" />
	</button>
	<div class="join">
		<button
			class="btn btn-lg join-item flex gap-2
				{!speakersList?.speakers?.length ? 'btn-disabled' : 'btn-square'}"
			aria-label="remove time"
			onclick={removeTime}
		>
			<i class="fas fa-minus"></i>
		</button>
		<button
			class="btn btn-lg join-item flex gap-2
				{!speakersList?.speakers?.length ? 'btn-disabled' : ''}"
			onclick={resetTimer}
		>
			<i class="fas fa-rotate-left"></i>
			<Kbd hotkey={resetShortcut} class="text-base-content" />
		</button>
		<button
			class="btn btn-lg join-item flex gap-2
				{!speakersList?.speakers?.length ? 'btn-disabled' : 'btn-square'}"
			aria-label="add time"
			onclick={addTime}
		>
			<i class="fas fa-plus"></i>
		</button>
	</div>
</div>
