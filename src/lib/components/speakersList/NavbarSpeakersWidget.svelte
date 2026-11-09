<script lang="ts">
	import dayjs from 'dayjs';
	import { client } from '#lib/api/rumbleClient/client';
	import Flag from '#lib/components/Flag.svelte';
	import { m } from '#lib/paraglide/messages';
	import { getServerTime } from '#lib/state/serverTime.svelte';
	import {
		formatTimeLeft,
		showsQuestioner,
		speakerDisplayName,
		widgetAction,
		widgetButton,
		widgetStateFor,
		type WidgetAction
	} from './speakersWidget';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import Kbd from '#lib/components/Kbd.svelte';
	import { compareSpeakers } from '#lib/helpers/speakerSort';
	import type { SpeakersListData } from './types';

	/** The list as the navbar reads it: no closed flag, but the speech/question/answer phase */
	type SpeakersList =
		(Omit<SpeakersListData, 'isClosed'> & { phase?: string | null }) | null | undefined;

	interface Props {
		speakersList?: SpeakersList;
		commentList?: SpeakersList;
	}

	let { speakersList, commentList }: Props = $props();

	let currentSpeaker = $derived(speakersList?.speakers.toSorted(compareSpeakers).at(0));
	let currentQuestioner = $derived(commentList?.speakers.toSorted(compareSpeakers).at(0));

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

	let widgetState = $derived(
		widgetStateFor({ phase: speakersList?.phase, speechRunning, questionRunning })
	);
	const commentCount = $derived(commentList?.speakers.length ?? 0);

	let button = $derived(widgetButton({ state: widgetState, hasQuestioner, commentCount }));
	// The message itself, so the command palette can also search the English label
	let buttonMessage = $derived(button.message);
	let buttonLabel = $derived(buttonMessage());
	let buttonIcon = $derived(button.icon);
	let buttonClass = $derived(button.class);

	let showQuestioner = $derived(hasQuestioner && showsQuestioner(widgetState));

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

	let timeFormatted = $derived(formatTimeLeft(timeLeft));

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
				startTimestamp: true,
				phase: true
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
				startTimestamp: true,
				phase: true
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
				startTimestamp: true,
				phase: true
			})
		]);
	};

	const advanceToNextSpeaker = async () => {
		if (!speakersList || !currentSpeaker) return;
		const promises: Promise<unknown>[] = [
			client.mutate.removeSpeakerOnList({
				__args: { speakerOnListId: currentSpeaker.id },
				id: true,
				speakers: { id: true, position: true }
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
					isClosed: true,
					phase: true
				}),
				client.mutate.clearSpeakersList({
					__args: { id: commentList.id },
					id: true,
					speakers: { id: true, position: true }
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
				speakers: { id: true, position: true }
			}),
			client.mutate.updateSpeakersList({
				__args: { id: commentList.id, timeLeft: commentList.speakingTime, stopTimer: true },
				id: true,
				timeLeft: true,
				startTimestamp: true,
				phase: true
			}),
			client.mutate.updateSpeakersList({
				__args: { id: speakersList.id, phase: 'QUESTION' },
				id: true,
				phase: true
			})
		]);
	};

	const stopAnswerTimer = async () => {
		if (!speakersList) return;
		await client.mutate.updateSpeakersList({
			__args: {
				id: speakersList.id,
				timeLeft: speakersList.speakingTime,
				stopTimer: true,
				phase: 'ANSWER_DONE'
			},
			id: true,
			timeLeft: true,
			startTimestamp: true,
			phase: true
		});
	};

	const actionHandlers: Record<WidgetAction, () => Promise<void>> = {
		startSpeech: startSpeakersListTimer,
		stopSpeech: stopSpeakersListTimer,
		startQuestion: startCommentListTimer,
		stopQuestion: stopCommentListTimer,
		startAnswer: startAnswerTimer,
		stopAnswer: stopAnswerTimer,
		nextQuestioner: advanceQuestioner,
		nextSpeaker: advanceToNextSpeaker
	};

	const handleButton = () => actionHandlers[widgetAction({ state: widgetState, commentCount })]();

	registerCommands(() => [
		{
			id: 'speakers-list.widget.action',
			title: buttonMessage,
			context: m.speakersList,
			group: 'page',
			icon: buttonIcon,
			shortcut: 'shift+space',
			// The widget only shows while someone is speaking
			visible: () => hasSpeaker,
			run: handleButton
		}
	]);
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
				{speakerDisplayName(currentSpeaker)}
			</span>
			<Flag representation={speakerRepresentation} size="xs" />
		</div>

		<!-- Timer + Button (center) -->
		<div class="flex shrink-0 flex-col items-center gap-1">
			<span class="font-mono text-sm {overtime ? 'text-error' : ''}">{timeFormatted}</span>
			<button class="btn btn-xs {buttonClass} gap-1" onclick={handleButton}>
				<i aria-hidden="true" class="ph-fill ph-{buttonIcon} text-xs"></i>
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
				{speakerDisplayName(currentQuestioner)}
			</span>
		</div>
	</div>
{/if}
