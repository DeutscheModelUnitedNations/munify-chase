<script lang="ts">
	import {
		graphql,
		type CommitteeTeamQuery$result,
		type SpeakersListCategoryEnum$options
	} from '$houdini';
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
		childListId?: string;
		type: SpeakersListCategoryEnum$options;
	}

	let { speakersList, childListId, type }: Props = $props();

	const NextSpeakerMutation = graphql(`
		mutation NextSpeaker($speakerOnListId: ID!) {
			removeSpeakerOnList(speakerOnListId: $speakerOnListId) {
				id
			}
		}
	`);

	const NextSpeakerMutationWithChildListClearance = graphql(`
		mutation NextSpeakerWithChildListClearance($speakerOnListId: ID!, $childSpeakersListId: ID!) {
			removeSpeakerOnList(speakerOnListId: $speakerOnListId) {
				id
			}

			clearSpeakersList(id: $childSpeakersListId) {
				id
			}
		}
	`);

	const nextSpeaker = async () => {
		if (speakersList && speakersList?.speakers.length > 0) {
			const speaker = speakersList.speakers[0];
			toast.promise(
				childListId
					? NextSpeakerMutationWithChildListClearance.mutate({
							speakerOnListId: speaker.id,
							childSpeakersListId: childListId
						})
					: NextSpeakerMutation.mutate({
							speakerOnListId: speaker.id
						}),
				promiseToastStrings(m.nextSpeaker(), 'update')
			);
		}
	};

	onMount(() => {
		hotkeys('cmd+n, cmd+shift+n', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'cmd+s':
					if (type === 'SPEAKERS_LIST') {
						nextSpeaker();
					}
					break;
				case 'cmd+shift+s':
					if (type === 'COMMENT_LIST') {
						nextSpeaker();
					}
			}
		});
	});
</script>

<button
	class="btn {type === 'SPEAKERS_LIST' ? 'btn-error' : 'btn-warning'} btn-lg flex flex-1 gap-2"
	onclick={nextSpeaker}
>
	<i class="fas fa-diagram-next"></i>
	{m.nextSpeaker()}
	<span class="kbd text-base-content">
		{#if type === 'COMMENT_LIST'}
			⌘ ⇧ N
		{:else if type === 'SPEAKERS_LIST'}
			⌘ N
		{/if}
	</span>
</button>
