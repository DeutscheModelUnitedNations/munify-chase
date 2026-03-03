<script lang="ts">
	import {
		graphql,
		type CommitteeTeamQuery$result,
		type SpeakersListCategoryEnum$options
	} from '$houdini';
	import { alertDialog } from '$lib/components/Alert/alert';
	import Kbd from '$lib/components/Kbd.svelte';
	import { m } from '$lib/paraglide/messages';
	import { promiseToastStrings } from '$lib/utils/toast';
	import hotkeys from 'hotkeys-js';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	interface Props {
		speakersList?:
			| NonNullable<
					CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
			  >['speakersList'][number]
			| null;
		childList?:
			| NonNullable<
					CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
			  >['speakersList'][number]
			| null;
		type: SpeakersListCategoryEnum$options;
	}

	let { speakersList, type, childList }: Props = $props();

	const NextSpeakerMutation = graphql(`
		mutation NextSpeaker($speakerOnListId: ID!, $speakersListId: ID!, $speakingTime: Int) {
			removeSpeakerOnList(speakerOnListId: $speakerOnListId) {
				id
			}

			updateSpeakersList(id: $speakersListId, timeLeft: $speakingTime, stopTimer: true) {
				id
			}
		}
	`);

	const NextSpeakerMutationWithChildListClearance = graphql(`
		mutation NextSpeakerWithChildListClearance(
			$speakerOnListId: ID!
			$speakersListId: ID!
			$speakingTime: Int!
			$childSpeakersListId: ID!
			$childSpeakersListSpeakingTime: Int!
		) {
			removeSpeakerOnList(speakerOnListId: $speakerOnListId) {
				id
			}
			updateSpeakersListMain: updateSpeakersList(
				id: $speakersListId
				timeLeft: $speakingTime
				stopTimer: true
			) {
				id
			}

			updateSpeakersListChild: updateSpeakersList(
				id: $childSpeakersListId
				timeLeft: $childSpeakersListSpeakingTime
				stopTimer: true
				isClosed: false
			) {
				id
			}

			clearSpeakersList(id: $childSpeakersListId) {
				id
			}
		}
	`);

	const nextSpeaker = async () => {
		if (speakersList && speakersList?.speakers.length > 0) {
			const speaker = speakersList.speakers.sort((a, b) => a.position - b.position)[0];
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
						NextSpeakerMutationWithChildListClearance.mutate({
							speakerOnListId: speaker.id,
							speakersListId: speakersList.id,
							speakingTime: speakersList.speakingTime,
							childSpeakersListId: childList.id,
							childSpeakersListSpeakingTime: childList.speakingTime
						}),
						promiseToastStrings(m.nextSpeaker(), 'update')
					);
			} else {
				toast.promise(
					NextSpeakerMutation.mutate({
						speakerOnListId: speaker.id,
						speakersListId: speakersList.id,
						speakingTime: speakersList.speakingTime
					}),
					promiseToastStrings(m.nextSpeaker(), 'update')
				);
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
