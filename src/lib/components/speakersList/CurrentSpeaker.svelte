<script lang="ts">
  import { bounceOut } from 'svelte/easing';
  import { scale } from 'svelte/transition';
  import { m } from '$lib/paraglide/messages';
  import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
  import Flag from '../Flag.svelte';
  import Timer from './Timer.svelte';
  import { committeeTeamQuery } from '$lib/queries/committeeTeamQuery.svelte';
  import type { QueryResponseType } from '$lib/helpers/utilityTypes';

  interface Props {
    speakersList?: NonNullable<
      QueryResponseType<typeof committeeTeamQuery>['activeAgendaItem']
    >['speakersList'][number];
  }

  const { speakersList }: Props = $props();

  const currentSpeaker = $derived(
    speakersList?.speakers.toSorted((a, b) => a.position - b.position).at(0)
  );

  const representation = $derived(
    currentSpeaker?.committeeMember?.representation ||
      currentSpeaker?.conferenceMember?.representation
  );
</script>

<div class="relative flex items-center gap-6">
  <div class="relative">
    {#if currentSpeaker}
      <Flag {representation} size="lg" />
    {:else}
      <Flag placeholder size="lg" />
    {/if}
  </div>
  {#if speakersList?.isClosed}
    <div
      class="text-content-error absolute top-0 left-0 flex h-8 w-8 -translate-x-1/3 -translate-y-1/3 items-center justify-center rounded-full bg-error shadow-md"
      in:scale={{ duration: 800, opacity: 0.5, start: 0, easing: bounceOut }}
      out:scale={{ duration: 500, opacity: 0.5, start: 0 }}
    >
      <i class="fas fa-lock"></i>
    </div>
  {/if}

  <div class="flex flex-1 flex-col {!currentSpeaker && 'opacity-50'}">
    {#if currentSpeaker}
      <h2 class="text-2xl font-bold">
        {currentSpeaker.overwriteName ||
          representation?.name ||
          getTranslatedCountryNameFromAlpha3Code(representation?.alpha3Code)}
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
