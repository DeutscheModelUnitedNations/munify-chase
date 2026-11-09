<script lang="ts">
	import type { SpeakerslistcategoryEnum } from '#lib/api/rumbleClient/client';
	import { client } from '#lib/api/rumbleClient/client';
	import { alertDialog } from '#lib/components/Alert/alert';
	import Kbd from '#lib/components/Kbd.svelte';
	import { m } from '#lib/paraglide/messages';
	import { promiseToastStrings } from '#lib/utils/toast';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import toast from 'svelte-french-toast';
	import { listCommandScope } from './listCommands';
	import { firstSpeaker, hasSpeakers } from './listOptions';
	import { phaseFor } from './timerArgs';

	type SpeakersList = {
		id: string;
		type: string;
		speakingTime: number;
		speakers: Array<{ id: string; position: number }>;
	} | null;

	interface Props {
		speakersList?: SpeakersList;
		childList?: SpeakersList;
		parentList?: SpeakersList;
		type: SpeakerslistcategoryEnum;
	}

	let { speakersList, type, childList, parentList }: Props = $props();

	type Speaker = { id: string };
	type List = NonNullable<SpeakersList>;

	// Moving on also empties the speaker's comment list, which the chair confirms first
	const advanceClearingComments = async (speaker: Speaker, list: List, comments: List) => {
		if (
			!(await alertDialog({
				title: m.nextSpeaker(),
				description: m.nextSpeakerDescription(),
				confirmText: m.nextSpeaker(),
				cancelText: m.abort(),
				confirmColor: 'error'
			}))
		)
			return;
		toast.promise(
			Promise.all([
				client.mutate.removeSpeakerOnList({
					__args: { speakerOnListId: speaker.id },
					id: true,
					speakers: { id: true, position: true }
				}),
				client.mutate.updateSpeakersList({
					__args: {
						id: list.id,
						timeLeft: list.speakingTime,
						stopTimer: true,
						// Moving to a new speaker resets the phase for the next speech
						phase: 'SPEECH'
					},
					id: true,
					timeLeft: true,
					startTimestamp: true,
					phase: true
				}),
				client.mutate.updateSpeakersList({
					__args: {
						id: comments.id,
						timeLeft: comments.speakingTime,
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
					__args: { id: comments.id },
					id: true,
					speakers: { id: true, position: true }
				})
			]),
			promiseToastStrings(m.nextSpeaker(), 'update')
		);
	};

	const advance = (speaker: Speaker, list: List) => {
		const ops: Promise<unknown>[] = [
			client.mutate.removeSpeakerOnList({
				__args: { speakerOnListId: speaker.id },
				id: true,
				speakers: { id: true, position: true }
			}),
			client.mutate.updateSpeakersList({
				__args: {
					id: list.id,
					timeLeft: list.speakingTime,
					stopTimer: true,
					// Advancing to a new main-list speaker resets the phase for the next speech
					...phaseFor({ type, when: 'SPEAKERS_LIST', phase: 'SPEECH' })
				},
				id: true,
				timeLeft: true,
				startTimestamp: true,
				phase: true
			})
		];
		// When advancing a questioner, put the speakers list back into question phase
		if (type === 'COMMENT_LIST' && parentList) {
			ops.push(
				client.mutate.updateSpeakersList({
					__args: { id: parentList.id, phase: 'QUESTION' },
					id: true,
					phase: true
				})
			);
		}
		toast.promise(Promise.all(ops), promiseToastStrings(m.nextSpeaker(), 'update'));
	};

	const nextSpeaker = async () => {
		const speaker = firstSpeaker(speakersList);
		if (!speakersList || !speaker) return;
		if (childList) await advanceClearingComments(speaker, speakersList, childList);
		else advance(speaker, speakersList);
	};

	const shortcut = $derived(type === 'COMMENT_LIST' ? 'alt+shift+n' : 'alt+n');

	registerCommands(() => {
		const { idPrefix, context, keywords } = listCommandScope(type);
		return [
			{
				id: `${idPrefix}.next-speech`,
				title: m.nextSpeaker,
				context,
				keywords,
				group: 'page',
				icon: 'steps',
				shortcut,
				enabled: () => hasSpeakers(speakersList),
				run: nextSpeaker
			}
		];
	});
</script>

<button
	class="btn btn-lg flex flex-1 gap-2
		{(!speakersList?.speakers?.length && 'btn-disabled') ||
		(type === 'SPEAKERS_LIST' ? 'btn-error' : 'btn-warning')}"
	disabled={!speakersList?.speakers?.length}
	onclick={nextSpeaker}
>
	<i aria-hidden="true" class="ph-fill ph-steps"></i>
	{m.nextSpeaker()}
	<Kbd hotkey={shortcut} class="text-base-content" />
</button>
