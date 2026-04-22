<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { flip } from 'svelte/animate';
	import Flag from '../Flag.svelte';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { blur, fly } from 'svelte/transition';
	import StripesAlert from './StripesAlert.svelte';
	import { m } from '$lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';

	interface Props {
		rawSpeakers?: any[];
		closed?: boolean;
	}

	let { rawSpeakers, closed = false }: Props = $props();

	let speakers = $derived(rawSpeakers?.toSorted((a, b) => a.position - b.position).toSpliced(0, 1));

	const getRepresentation = (speaker: NonNullable<Props['rawSpeakers']>[number]) => {
		return speaker.committeeMember
			? speaker.committeeMember.representation
			: speaker.conferenceMember
				? speaker.conferenceMember.representation
				: null;
	};

	const removeSpeaker = (speakerOnListId: string) => {
		if (!speakerOnListId) return;

		toast.promise(
			client.mutate.removeSpeakerOnList({ __args: { speakerOnListId }, id: true, speakers: { id: true } }),
			promiseToastStrings(m.speaker(), 'delete')
		);
	};

	const moveSpeaker = (speakerOnListId: string, position: number) => {
		if (!speakerOnListId || position < 0) return;

		toast.promise(
			client.mutate.moveSpeakerToPosition({
				__args: { id: speakerOnListId, position },
				id: true,
				position: true,
				speakersListId: true,
				speakersList: {
					id: true,
					speakers: {
						id: true,
						position: true
					}
				}
			}),
			promiseToastStrings(m.speaker(), 'update')
		);
	};
</script>

<div class="flex w-full flex-col">
	{#if speakers && speakers.length > 0}
		{#each speakers as speaker, i (speaker.id)}
			{@const representation = getRepresentation(speaker)}
			<div
				class="hover:border-primary/30 border-base-100 card group relative flex flex-row items-center gap-4 border-1 p-4 transition-colors duration-300"
				animate:flip={{ duration: 500, easing: cubicInOut }}
				in:fly={{ duration: 500, y: 20, easing: cubicOut }}
				out:fly={{ duration: 500, y: -20, easing: cubicOut }}
			>
				<div class="w-4 text-sm opacity-50">{i + 1}.</div>
				<Flag representation={representation ?? undefined} size="sm" />
				<h2 class="flex-1 text-lg font-bold">
					{representation?.name ||
						getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code)}
				</h2>
				<div
					class="join invisible absolute right-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100"
				>
					<button
						class="btn btn-sm join-item btn-square btn-error btn-soft"
						aria-label="Delete Speaker"
						onclick={() => removeSpeaker(speaker.id)}
					>
						<i class="fa-solid fa-trash"></i>
					</button>
					<button
						class="btn btn-sm join-item btn-square btn-soft btn-primary"
						aria-label="Move Speaker Up"
						onclick={() => moveSpeaker(speaker.id, speaker.position - 1)}
					>
						<i class="fa-solid fa-chevron-up"></i>
					</button>
					<button
						class="btn btn-sm join-item btn-square btn-soft btn-primary"
						aria-label="Move Speaker Down"
						onclick={() => moveSpeaker(speaker.id, speaker.position + 1)}
					>
						<i class="fa-solid fa-chevron-down"></i>
					</button>
					<button
						class="btn btn-sm join-item btn-square btn-primary btn-soft"
						aria-label="Move Speaker to Top"
						onclick={() => moveSpeaker(speaker.id, 0)}
					>
						<i class="fa-solid fa-chevrons-up"></i>
					</button>
				</div>
			</div>
		{/each}
	{:else}
		<StripesAlert badgeText={m.listEmpty()} />
	{/if}
	{#if closed}
		<StripesAlert badgeColor="error" stripeColor="error" faIcon="lock" badgeText={m.listClosed()} />
	{/if}
</div>
