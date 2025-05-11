<script lang="ts">
	import {
		graphql,
		type CommitteeTeamQuery$result,
		type SpeakersListCategoryEnum$options
	} from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import { serverTime } from '$lib/state/serverTime.svelte';
	import dayjs from 'dayjs';
	import hotkeys from 'hotkeys-js';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	interface Props {
		type: SpeakersListCategoryEnum$options;
		speakersList?:
			| NonNullable<
					CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
			  >['speakersList'][number]
			| null;
	}

	let { speakersList, type }: Props = $props();

	let timerRunning = $derived(!!speakersList?.startTimestamp);

	$inspect(timerRunning);
	$inspect(speakersList);

	const UpdateSpeakersListTimingsMutation = graphql(`
		mutation UpdateSpeakersListTimings(
			$speakersListId: ID!
			$startTimestamp: DateTime
			$timeLeft: Int
			$stopTimer: Boolean
		) {
			updateSpeakersList(
				id: $speakersListId
				timeLeft: $timeLeft
				startTimestamp: $startTimestamp
				stopTimer: $stopTimer
			) {
				speakingTime
				startTimestamp
			}
		}
	`);

	const startTimer = async () => {
		if (!speakersList) return;

		await UpdateSpeakersListTimingsMutation.mutate({
			speakersListId: speakersList.id,
			startTimestamp: $serverTime.toDate()
		}).then((r) => {
			if (r.error) {
				toast.error(m.errorUpdatingTimer());
				console.error('Error starting timer:', r.error);
			}
		});
	};

	const stopTimer = async () => {
		if (!speakersList) return;

		await UpdateSpeakersListTimingsMutation.mutate({
			speakersListId: speakersList.id,
			timeLeft:
				dayjs(speakersList.startTimestamp).diff($serverTime, 'seconds') + speakersList.timeLeft,
			stopTimer: true
		}).then((r) => {
			if (r.errors) {
				toast.error(m.errorUpdatingTimer());
				console.error('Error starting timer:', r.errors);
			}
		});
	};

	const resetTimer = async () => {
		if (!speakersList) return;

		await UpdateSpeakersListTimingsMutation.mutate({
			speakersListId: speakersList.id,
			timeLeft: speakersList.speakingTime,
			startTimestamp: speakersList.startTimestamp ? $serverTime.toDate() : undefined,
			stopTimer: !speakersList.startTimestamp
		}).then((r) => {
			if (r.errors) {
				toast.error(m.errorUpdatingTimer());
				console.error('Error starting timer:', r.errors);
			}
		});
	};

	const changeTimer = async (delta: number) => {
		if (!speakersList) return;

		await UpdateSpeakersListTimingsMutation.mutate({
			speakersListId: speakersList.id,
			timeLeft: speakersList.timeLeft + delta
		}).then((r) => {
			if (r.errors) {
				toast.error(m.errorUpdatingTimer());
				console.error('Error starting timer:', r.errors);
			}
		});
	};

	onMount(() => {
		hotkeys('cmd+s, cmd+shift+s, cmd+r, cmd+shift+r', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'cmd+s':
					if (type === 'SPEAKERS_LIST') {
						if (timerRunning) {
							stopTimer();
						} else {
							startTimer();
						}
					}
					break;
				case 'cmd+shift+s':
					if (type === 'COMMENT_LIST') {
						console.log('Start /Stop Timer Comment List');
						if (timerRunning) {
							stopTimer();
						} else {
							startTimer();
						}
					}
					break;
				case 'cmd+r':
					if (type === 'SPEAKERS_LIST') {
						console.log('Reset Timer Speakers List');
						resetTimer();
					}
					break;
				case 'cmd+shift+r':
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
		class="btn {timerRunning ? 'bg-error' : 'bg-primary'} btn-lg join-item flex flex-1 gap-2"
		onclick={timerRunning ? stopTimer : startTimer}
	>
		{#if timerRunning}
			<i class="fas fa-pause"></i>
		{:else}
			<i class="fas fa-play"></i>
		{/if}
		{m.timer()}
		<span class="kbd text-base-content">
			{#if type === 'COMMENT_LIST'}
				⌘ ⇧ S
			{:else if type === 'SPEAKERS_LIST'}
				⌘ S
			{/if}
		</span>
	</button>
	<div class="join">
		<button
			class="btn btn-square btn-lg join-item flex gap-2"
			aria-label="remove time"
			onclick={() => changeTimer(-10)}
		>
			<i class="fas fa-minus"></i>
		</button>
		<button class="btn btn-lg join-item flex gap-2" onclick={resetTimer}>
			<i class="fas fa-rotate-left"></i>
			<span class="kbd text-base-content">
				{#if type === 'COMMENT_LIST'}
					⌘ ⇧ R
				{:else if type === 'SPEAKERS_LIST'}
					⌘ R
				{/if}
			</span>
		</button>
		<button
			class="btn btn-square btn-lg join-item flex gap-2"
			aria-label="add time"
			onclick={() => changeTimer(10)}
		>
			<i class="fas fa-plus"></i>
		</button>
	</div>
</div>
