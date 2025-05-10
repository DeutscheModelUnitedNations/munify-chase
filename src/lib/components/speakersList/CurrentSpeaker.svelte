<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import type { Dayjs } from 'dayjs';
	import Flag from '../Flag.svelte';
	import { getFullTranslatedCountryNameFromISO3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { m } from '$lib/paraglide/messages';
	import Timer from './Timer.svelte';

	interface Props {
		currentSpeaker?: CommitteeTeamQuery$result['findFirstCommittee']['activeAgendaItem']['speakersList'][0]['speakers'][0];
		speakingTime?: number | null;
		startTimestamp?: Dayjs | null;
		timeLeft?: number | null;
	}

	let { currentSpeaker, speakingTime, startTimestamp, timeLeft }: Props = $props();
</script>

<div class="flex gap-6">
	{#if currentSpeaker}
		<Flag
			alpha2Code={currentSpeaker.representation?.alpha2Code}
			nsa={!currentSpeaker.representation?.alpha2Code}
			icon={currentSpeaker.representation?.faIcon}
			size="lg"
		/>
	{:else}
		<Flag placeholder icon="earth" size="lg" />
	{/if}

	<div class="ml-4 flex flex-1 flex-col">
		{#if currentSpeaker}
			<h2 class="truncate text-xl font-bold">
				{currentSpeaker.representation?.name ||
					getFullTranslatedCountryNameFromISO3Code(currentSpeaker.representation?.alpha3Code)}
			</h2>
		{:else}
			<h2 class="text-xl font-bold opacity-50">
				{m.noCurrentSpeaker()}
			</h2>
		{/if}

		<Timer />

		<!-- <div class="text-lg flex items-center gap-3">
          {#if timerState === "active"}
            <i icon="hourglass-half" class="hourglass" />
          {:else if timerState === "paused"}
            <i class="fas fa-hourglass-clock text-primary"></i>
            {:else if timerState === "overtime"}
            <i class="fas fa-bell fa-shake text-error"></i>
          {/if}
          <div class="text-xl">
            {listHasActiveSpeaker ? (
              timeLeft
            ) : (
              <SpeakingTime time={speakersListData?.speakingTime} />
            )}
            <span className="ml-2 text-xs text-primary-300 dark:text-primary-600">
              / <SpeakingTime time={speakersListData?.speakingTime} />
            </span>
          </div> -->
	</div>
</div>
