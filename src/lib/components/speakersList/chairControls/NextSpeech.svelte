<script lang="ts">
	import type { SpeakerslistcategoryEnum } from '$lib/api/rumbleClient/client';
	import { client } from '$lib/api/rumbleClient/client';
	import { alertDialog } from '$lib/components/Alert/alert';
	import Kbd from '$lib/components/Kbd.svelte';
	import { m } from '$lib/paraglide/messages';
	import { promiseToastStrings } from '$lib/utils/toast';
	import hotkeys from 'hotkeys-js';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { compareSpeakers } from '$lib/helpers/speakerSort';

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

	const nextSpeaker = async () => {
		if (speakersList && speakersList?.speakers.length > 0) {
			const speaker = speakersList.speakers.toSorted(compareSpeakers)[0];
			if (childList) {
				if (
					await alertDialog({
						title: m.nextSpeaker(),
						description: m.nextSpeakerDescription(),
						confirmText: m.nextSpeaker(),
						cancelText: m.abort(),
						confirmColor: 'error'
					})
				)
					toast.promise(
						Promise.all([
							client.mutate.removeSpeakerOnList({
								__args: { speakerOnListId: speaker.id },
								id: true,
								speakers: { id: true, position: true }
							}),
							client.mutate.updateSpeakersList({
								__args: {
									id: speakersList.id,
									timeLeft: speakersList.speakingTime,
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
									id: childList.id,
									timeLeft: childList.speakingTime,
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
								__args: { id: childList.id },
								id: true,
								speakers: { id: true, position: true }
							})
						]),
						promiseToastStrings(m.nextSpeaker(), 'update')
					);
			} else {
				const ops: Promise<unknown>[] = [
					client.mutate.removeSpeakerOnList({
						__args: { speakerOnListId: speaker.id },
						id: true,
						speakers: { id: true, position: true }
					}),
					client.mutate.updateSpeakersList({
						__args: {
							id: speakersList.id,
							timeLeft: speakersList.speakingTime,
							stopTimer: true,
							// Advancing to a new main-list speaker resets the phase for the next speech
							...(type === 'SPEAKERS_LIST' ? { phase: 'SPEECH' } : {})
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
			}
		}
	};

	onMount(() => {
		hotkeys('alt+n, alt+shift+n', (event, handler) => {
			event.preventDefault();
			if (!speakersList?.speakers?.length) return;
			switch (handler.key) {
				case 'alt+n':
					if (type === 'SPEAKERS_LIST') {
						nextSpeaker();
					}
					break;
				case 'alt+shift+n':
					if (type === 'COMMENT_LIST') {
						nextSpeaker();
					}
			}
		});
	});
</script>

<button
	class="btn btn-lg flex flex-1 gap-2
		{(!speakersList?.speakers?.length && 'btn-disabled') ||
		(type === 'SPEAKERS_LIST' ? 'btn-error' : 'btn-warning')}"
	onclick={nextSpeaker}
>
	<i class="fas fa-diagram-next"></i>
	{m.nextSpeaker()}
	{#if type === 'COMMENT_LIST'}
		<Kbd hotkey="alt+shift+N" class="text-base-content" />
	{:else if type === 'SPEAKERS_LIST'}
		<Kbd hotkey="alt+N" class="text-base-content" />
	{/if}
</button>
