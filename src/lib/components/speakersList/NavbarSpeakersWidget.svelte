<script lang="ts">
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import Flag from '$lib/components/Flag.svelte';
	import { m } from '$lib/paraglide/messages';
	import { getServerTime } from '$lib/state/serverTime.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import hotkeys from 'hotkeys-js';
	import Kbd from '$lib/components/Kbd.svelte';

	type SpeakersList =
		| {
				id: string;
				type: string;
				speakingTime: number;
				startTimestamp?: Date | null;
				timeLeft: number;
				phase?: string | null;
				speakers: Array<{
					id: string;
					position: number;
					overwriteName?: string | null;
					committeeMember?: {
						id: string;
						representation?: {
							name?: string | null;
							alpha2Code?: string | null;
							alpha3Code?: string | null;
							faIcon?: string | null;
							type?: string | null;
						} | null;
					} | null;
					conferenceMember?: {
						id: string;
						representation?: {
							name?: string | null;
							alpha2Code?: string | null;
							alpha3Code?: string | null;
							faIcon?: string | null;
							type?: string | null;
						} | null;
					} | null;
				}>;
		  }
		| null
		| undefined;

	interface Props {
		speakersList?: SpeakersList;
		commentList?: SpeakersList;
	}

	let { speakersList, commentList }: Props = $props();

	let currentSpeaker = $derived(
		speakersList?.speakers.toSorted((a, b) => a.position - b.position).at(0)
	);
	let currentQuestioner = $derived(
		commentList?.speakers.toSorted((a, b) => a.position - b.position).at(0)
	);

	let speakerRepresentation = $derived(
		currentSpeaker?.committeeMember?.representation ??
			currentSpeaker?.conferenceMember?.representation
	);
	let questionerRepresentation = $derived(
		currentQuestioner?.committeeMember?.representation ??
			currentQuestioner?.conferenceMember?.representation
	);

	let speechRunning = $derived(!!speakersList?.startTimestamp);
	let questionRunning = $derived(!!commentList?.startTimestamp);
	let hasSpeaker = $derived(currentSpeaker != null);
	let hasQuestioner = $derived(currentQuestioner != null);

	type WidgetState =
		| 'speech_idle'
		| 'speech_running'
		| 'speech_stopped'
		| 'question_idle'
		| 'question_running'
		| 'answer_idle'
		| 'answer_running'
		| 'answer_stopped';

	let widgetState = $derived.by((): WidgetState => {
		const phase = speakersList?.phase ?? 'SPEECH';
		if (phase === 'SPEECH_DONE') return 'speech_stopped';
		if (phase === 'ANSWER_DONE') return 'answer_stopped';
		if (phase === 'SPEECH') return speechRunning ? 'speech_running' : 'speech_idle';
		if (phase === 'QUESTION') return questionRunning ? 'question_running' : 'question_idle';
		if (phase === 'ANSWER') return speechRunning ? 'answer_running' : 'answer_idle';
		return 'speech_idle';
	});

	let buttonLabel = $derived.by(() => {
		switch (widgetState) {
			case 'speech_running':
				return m.stopSpeech();
			case 'speech_stopped':
				return hasQuestioner ? m.startQuestion() : m.nextSpeaker();
			case 'question_idle':
				return m.startQuestion();
			case 'question_running':
				return m.stopQuestion();
			case 'answer_idle':
				return m.startAnswer();
			case 'answer_running':
				return m.stopAnswer();
			case 'answer_stopped':
				return (commentList?.speakers.length ?? 0) > 1 ? m.nextQuestion() : m.nextSpeaker();
			case 'speech_idle':
			default:
				return m.startSpeech();
		}
	});

	let buttonIcon = $derived.by(() => {
		switch (widgetState) {
			case 'speech_running':
			case 'question_running':
			case 'answer_running':
				return 'fa-pause';
			case 'speech_stopped':
			case 'answer_stopped':
				return 'fa-diagram-next';
			default:
				return 'fa-play';
		}
	});

	let buttonClass = $derived.by(() => {
		switch (widgetState) {
			case 'speech_running':
			case 'question_running':
			case 'answer_running':
				return 'btn-error';
			case 'speech_stopped':
			case 'answer_stopped':
				return 'btn-info';
			default:
				return 'btn-success';
		}
	});

	let showQuestioner = $derived(
		hasQuestioner &&
			(widgetState === 'speech_stopped' ||
				widgetState === 'question_idle' ||
				widgetState === 'question_running' ||
				widgetState === 'answer_idle' ||
				widgetState === 'answer_running' ||
				widgetState === 'answer_stopped')
	);

	let activeTimerList = $derived(
		speechRunning ? speakersList : questionRunning ? commentList : speakersList
	);

	let timeLeft = $derived.by(() => {
		const list = activeTimerList;
		if (!list) return null;
		if (list.startTimestamp) {
			return Math.round(dayjs(list.startTimestamp).diff(getServerTime()) / 1000) + list.timeLeft;
		}
		return list.timeLeft;
	});

	let timeFormatted = $derived.by(() => {
		if (timeLeft === null) return '-:--';
		const abs = Math.abs(timeLeft);
		const d = dayjs.duration(abs, 'seconds');
		const prefix = timeLeft < 0 ? '+' : '';
		return `${prefix}${d.hours() ? d.format('H:mm:ss') : d.format('m:ss')}`;
	});

	let overtime = $derived((timeLeft ?? 0) < 0);

	const startSpeakersListTimer = async () => {
		if (!speakersList) return;
		await client.mutate.updateSpeakersList({
			__args: { id: speakersList.id, startTimestamp: getServerTime().toDate(), phase: 'SPEECH' },
			id: true,
			startTimestamp: true,
			phase: true
		});
	};

	const stopSpeakersListTimer = async () => {
		if (!speakersList) return;
		await client.mutate.updateSpeakersList({
			__args: { id: speakersList.id, stopTimer: true, phase: 'SPEECH_DONE' },
			id: true,
			timeLeft: true,
			startTimestamp: true,
			phase: true
		});
	};

	const startCommentListTimer = async () => {
		if (!commentList || !speakersList) return;
		await Promise.all([
			client.mutate.updateSpeakersList({
				__args: { id: commentList.id, startTimestamp: getServerTime().toDate() },
				id: true,
				startTimestamp: true
			}),
			client.mutate.updateSpeakersList({
				__args: { id: speakersList.id, phase: 'QUESTION' },
				id: true,
				phase: true
			})
		]);
	};

	const stopCommentListTimer = async () => {
		if (!commentList || !speakersList) return;
		await Promise.all([
			client.mutate.updateSpeakersList({
				__args: { id: commentList.id, stopTimer: true },
				id: true,
				timeLeft: true,
				startTimestamp: true
			}),
			client.mutate.updateSpeakersList({
				__args: { id: speakersList.id, phase: 'ANSWER' },
				id: true,
				phase: true
			})
		]);
	};

	const startAnswerTimer = async () => {
		if (!speakersList || !commentList) return;
		await Promise.all([
			client.mutate.updateSpeakersList({
				__args: {
					id: speakersList.id,
					timeLeft: commentList.speakingTime,
					startTimestamp: getServerTime().toDate(),
					phase: 'ANSWER'
				},
				id: true,
				timeLeft: true,
				startTimestamp: true,
				phase: true
			}),
			client.mutate.updateSpeakersList({
				__args: { id: commentList.id, stopTimer: true },
				id: true,
				timeLeft: true,
				startTimestamp: true
			})
		]);
	};

	const advanceToNextSpeaker = async () => {
		if (!speakersList || !currentSpeaker) return;
		const promises: Promise<unknown>[] = [
			client.mutate.removeSpeakerOnList({
				__args: { speakerOnListId: currentSpeaker.id },
				id: true,
				speakers: { id: true }
			}),
			client.mutate.updateSpeakersList({
				__args: {
					id: speakersList.id,
					timeLeft: speakersList.speakingTime,
					stopTimer: true,
					phase: 'SPEECH'
				},
				id: true,
				timeLeft: true,
				startTimestamp: true,
				phase: true
			})
		];
		if (commentList) {
			promises.push(
				client.mutate.updateSpeakersList({
					__args: {
						id: commentList.id,
						timeLeft: commentList.speakingTime,
						stopTimer: true,
						isClosed: false
					},
					id: true,
					timeLeft: true,
					startTimestamp: true,
					isClosed: true
				}),
				client.mutate.clearSpeakersList({
					__args: { id: commentList.id },
					id: true,
					speakers: { id: true }
				})
			);
		}
		await Promise.all(promises);
	};

	const advanceQuestioner = async () => {
		if (!commentList || !currentQuestioner || !speakersList) return;
		await Promise.all([
			client.mutate.removeSpeakerOnList({
				__args: { speakerOnListId: currentQuestioner.id },
				id: true,
				speakers: { id: true }
			}),
			client.mutate.updateSpeakersList({
				__args: { id: commentList.id, timeLeft: commentList.speakingTime, stopTimer: true },
				id: true,
				timeLeft: true,
				startTimestamp: true
			}),
			client.mutate.updateSpeakersList({
				__args: { id: speakersList.id, phase: 'QUESTION' },
				id: true,
				phase: true
			})
		]);
	};

	const handleButton = async () => {
		switch (widgetState) {
			case 'speech_idle':
				await startSpeakersListTimer();
				break;
			case 'speech_running':
				await stopSpeakersListTimer();
				break;
			case 'speech_stopped':
				if (hasQuestioner) {
					await startCommentListTimer();
				} else {
					await advanceToNextSpeaker();
				}
				break;
			case 'question_idle':
				await startCommentListTimer();
				break;
			case 'question_running':
				await stopCommentListTimer();
				break;
			case 'answer_idle':
				await startAnswerTimer();
				break;
			case 'answer_running':
				await client.mutate.updateSpeakersList({
					__args: {
						id: speakersList!.id,
						timeLeft: speakersList!.speakingTime,
						stopTimer: true,
						phase: 'ANSWER_DONE'
					},
					id: true,
					timeLeft: true,
					startTimestamp: true,
					phase: true
				});
				break;
			case 'answer_stopped':
				if ((commentList?.speakers.length ?? 0) > 1) {
					await advanceQuestioner();
				} else {
					await advanceToNextSpeaker();
				}
				break;
		}
	};

	const speakerName = (speaker: typeof currentSpeaker) => {
		if (!speaker) return '';
		const rep = speaker.committeeMember?.representation ?? speaker.conferenceMember?.representation;
		return (
			speaker.overwriteName ||
			rep?.name ||
			getTranslatedCountryNameFromAlpha3Code(rep?.alpha3Code) ||
			''
		);
	};

	onMount(() => {
		hotkeys('shift+space', (event) => {
			if (!hasSpeaker) return;
			event.preventDefault();
			handleButton();
		});
		return () => hotkeys.unbind('shift+space');
	});
</script>

{#if hasSpeaker}
	<div class="flex items-center gap-3 px-2">
		<!-- Speaker (left, fixed width) -->
		<div
			class="flex w-36 items-center justify-end gap-2 rounded-lg px-2 py-1 transition-all duration-300 {speechRunning
				? 'bg-success/15 shadow-[0_0_8px_2px_oklch(var(--su)/0.25)]'
				: ''}"
		>
			<span class="hidden min-w-0 truncate text-right text-sm font-medium lg:block">
				{speakerName(currentSpeaker)}
			</span>
			<Flag representation={speakerRepresentation} size="xs" />
		</div>

		<!-- Timer + Button (center) -->
		<div class="flex shrink-0 flex-col items-center gap-1">
			<span class="font-mono text-sm {overtime ? 'text-error' : ''}">{timeFormatted}</span>
			<button class="btn btn-xs {buttonClass} gap-1" onclick={handleButton}>
				<i class="fas {buttonIcon} text-xs"></i>
				{buttonLabel}
				<Kbd hotkey="shift+space" size="xs" class=" opacity-60" />
			</button>
		</div>

		<!-- Questioner (right, fixed width) -->
		<div
			class="flex w-36 items-center gap-2 rounded-lg px-2 py-1 transition-all duration-300 {showQuestioner
				? 'visible'
				: 'invisible'} {questionRunning
				? 'bg-warning/15 shadow-[0_0_8px_2px_oklch(var(--wa)/0.25)]'
				: ''}"
		>
			<Flag representation={questionerRepresentation} size="xs" />
			<span class="hidden min-w-0 truncate text-sm font-medium lg:block">
				{speakerName(currentQuestioner)}
			</span>
		</div>
	</div>
{/if}
