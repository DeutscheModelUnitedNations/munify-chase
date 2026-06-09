<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { flip } from 'svelte/animate';
	import Flag from '../Flag.svelte';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import StripesAlert from './StripesAlert.svelte';
	import { m } from '$lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';

	type Speaker = {
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
	};

	interface Props {
		rawSpeakers?: Speaker[];
		closed?: boolean;
	}

	let { rawSpeakers, closed = false }: Props = $props();

	let speakers = $derived(rawSpeakers?.toSorted((a, b) => a.position - b.position).toSpliced(0, 1));
	let bottomPosition = $derived(speakers?.at(-1)?.position ?? 0);

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
			client.mutate.removeSpeakerOnList({
				__args: { speakerOnListId },
				id: true,
				speakers: { id: true, position: true }
			}),
			promiseToastStrings(m.speaker(), 'delete')
		);
	};

	// Resolve the speaker's CURRENT position at call-time from rawSpeakers to avoid
	// stale-closure bugs when the user clicks rapidly before Svelte re-renders.
	const currentPosition = (id: string) =>
		rawSpeakers?.find((s) => s.id === id)?.position ?? -1;

	const moveSpeaker = (speakerOnListId: string, target: number) => {
		if (!speakerOnListId || target < 0 || target > bottomPosition) return;

		toast.promise(
			client.mutate.moveSpeakerToPosition({
				__args: { id: speakerOnListId, position: target },
				id: true,
				position: true,
				speakersListId: true
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
				animate:flip={{ duration: 200, easing: cubicInOut }}
				in:fly={{ duration: 300, y: 20, easing: cubicOut }}
				out:fly={{ duration: 200, y: -20, easing: cubicOut }}
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
						onclick={() => moveSpeaker(speaker.id, currentPosition(speaker.id) - 1)}
					>
						<i class="fa-solid fa-chevron-up"></i>
					</button>
					{#if i < speakers.length - 1}
						<button
							class="btn btn-sm join-item btn-square btn-soft btn-primary"
							aria-label="Move Speaker Down"
							onclick={() => moveSpeaker(speaker.id, currentPosition(speaker.id) + 1)}
						>
							<i class="fa-solid fa-chevron-down"></i>
						</button>
					{/if}
					<button
						class="btn btn-sm join-item btn-square btn-primary btn-soft"
						aria-label="Move Speaker to Top"
						onclick={() => moveSpeaker(speaker.id, 0)}
					>
						<i class="fa-solid fa-chevrons-up"></i>
					</button>
					{#if i < speakers.length - 1}
						<button
							class="btn btn-sm join-item btn-square btn-primary btn-soft"
							aria-label="Move Speaker to Bottom"
							onclick={() => moveSpeaker(speaker.id, bottomPosition)}
						>
							<i class="fa-solid fa-chevrons-down"></i>
						</button>
					{/if}
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
