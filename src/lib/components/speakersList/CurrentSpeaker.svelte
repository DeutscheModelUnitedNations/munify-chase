<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import Flag from '../Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { m } from '$lib/paraglide/messages';
	import Timer from './Timer.svelte';
	import { blur, scale } from 'svelte/transition';
	import { bounceOut, cubicOut } from 'svelte/easing';

	interface Props {
		speakersList?: NonNullable<
			CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']
		>['speakersList'][number];
	}

	let { speakersList }: Props = $props();

	let currentSpeaker = $derived(
		speakersList?.speakers.toSorted((a, b) => a.position - b.position).at(0)
	);

	let representation = $derived(
		currentSpeaker?.committeeMember?.representation ||
			currentSpeaker?.conferenceMember?.representation
	);
</script>

<div class="relative flex items-center gap-6">
	<div class="relative">
		{#if currentSpeaker}
			<Flag
				alpha2Code={representation?.alpha2Code}
				nsa={representation?.type === 'NSA'}
				un={representation?.type === 'UN'}
				icon={representation?.faIcon}
				size="lg"
			/>
		{:else}
			<Flag placeholder size="lg" />
		{/if}
	</div>
	{#if speakersList?.isClosed}
		<div
			class="bg-error text-content-error absolute top-0 left-0 flex h-8 w-8 -translate-x-1/3 -translate-y-1/3 items-center justify-center rounded-full shadow-md"
			in:scale={{ duration: 800, opacity: 0.5, start: 0, easing: bounceOut }}
			out:scale={{ duration: 500, opacity: 0.5, start: 0 }}
		>
			<i class="fas fa-lock"></i>
		</div>
	{/if}

	<div class="flex flex-1 flex-col {!currentSpeaker && 'opacity-50'}">
		{#if currentSpeaker}
			<h2 class="text-2xl font-bold">
				{representation?.name || getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code)}
			</h2>
		{:else}
			<h2 class="text-2xl font-bold">
				{m.noCurrentSpeaker()}
			</h2>
		{/if}

		<Timer
			noSpeaker={!currentSpeaker}
			speakingTime={speakersList?.speakingTime}
			startTimestamp={speakersList?.startTimestamp}
			timeLeft={speakersList?.timeLeft}
		/>
	</div>
</div>
