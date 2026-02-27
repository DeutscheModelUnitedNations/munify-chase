<script lang="ts">
  import dayjs from 'dayjs';
  import hotkeys from 'hotkeys-js';
  import { onMount } from 'svelte';
  import toast from 'svelte-french-toast';
  import { m } from '$lib/paraglide/messages';
  import { serverTime } from '$lib/state/serverTime.svelte';
  import type { committeeTeamQuery } from '$lib/queries/committeeTeamQuery.svelte';
  import { client, type SpeakerslistcategoryEnum } from '$lib/api/rumbleClient/client';
  import type { QueryResponseType } from '$lib/helpers/utilityTypes';

  type List =
    | NonNullable<
        QueryResponseType<typeof committeeTeamQuery>['activeAgendaItem']
      >['speakersList'][number]
    | null;

  interface Props {
    type: SpeakerslistcategoryEnum;
    speakersList?: List;
    otherList?: List;
  }

  const { speakersList, type, otherList }: Props = $props();

  const timerRunning = $derived(!!speakersList?.startTimestamp);

  const startTimer = async () => {
    if (!speakersList) return;

    if (otherList) {
      // TODO: somehow make optimistic responses work
      await Promise.all([
        // main
        client.mutate.updateSpeakersList({
          __args: {
            id: speakersList.id,
            startTimestamp: serverTime.value.toISOString()
          },
          id: true,
          speakingTime: true,
          startTimestamp: true
        }),
        client.mutate.updateSpeakersList({
          __args: {
            id: otherList.id,
            timeLeft:
              otherList.type === 'SPEAKERS_LIST'
                ? speakersList.speakingTime
                : otherList.speakingTime,
            startTimestamp: serverTime.value.toISOString(),
            stopTimer: true
          },
          id: true,
          speakingTime: true,
          startTimestamp: true
        })
      ]);
    } else {
      await client.mutate.updateSpeakersList({
        __args: {
          id: speakersList.id,
          startTimestamp: serverTime.value.toISOString()
        },
        id: true,
        speakingTime: true,
        startTimestamp: true
      });
    }
  };

  const stopTimer = async () => {
    if (!speakersList) return;
    await client.mutate.updateSpeakersList({
      __args: {
        id: speakersList.id,
        timeLeft:
          dayjs(speakersList.startTimestamp).diff(serverTime.value, 'seconds') +
          speakersList.timeLeft,
        stopTimer: true
      },
      id: true,
      speakingTime: true,
      startTimestamp: true
    });
  };

  const resetTimer = async () => {
    if (!speakersList) return;

    await client.mutate.updateSpeakersList({
      __args: {
        id: speakersList.id,
        timeLeft:
          dayjs(speakersList.startTimestamp).diff(serverTime.value, 'seconds') +
          speakersList.timeLeft,
        stopTimer: !speakersList.startTimestamp,
        startTimestamp: speakersList.startTimestamp ? serverTime.value.toISOString() : undefined
      },
      id: true,
      speakingTime: true,
      startTimestamp: true
    });
  };

  const changeTimer = async (delta: number) => {
    if (!speakersList) return;

    await client.mutate.updateSpeakersList({
      __args: {
        id: speakersList.id,
        timeLeft: speakersList.timeLeft + delta
      },
      id: true,
      speakingTime: true,
      startTimestamp: true
    });
  };

  onMount(() => {
    hotkeys('space, shift+space, alt+r, alt+shift+r', (event, handler) => {
      event.preventDefault();
      if (!speakersList?.speakers?.length) return;
      switch (handler.key) {
        case 'space':
          if (type === 'SPEAKERS_LIST') {
            if (timerRunning) {
              stopTimer();
            } else {
              startTimer();
            }
          }
          break;
        case 'shift+space':
          if (type === 'COMMENT_LIST') {
            console.log('Start /Stop Timer Comment List');
            if (timerRunning) {
              stopTimer();
            } else {
              startTimer();
            }
          }
          break;
        case 'alt+r':
          if (type === 'SPEAKERS_LIST') {
            console.log('Reset Timer Speakers List');
            resetTimer();
          }
          break;
        case 'alt+shift+r':
          if (type === 'COMMENT_LIST') {
            console.log('Reset Timer Comment List');
            resetTimer();
          }
          break;
      }
    });
  });
</script>

<div class="flex gap-2">
  <button
    class="btn join-item flex flex-1 gap-2 btn-lg
			{(!speakersList?.speakers?.length && 'btn-disabled') || (timerRunning ? 'bg-error' : 'bg-success')}"
    onclick={timerRunning ? stopTimer : startTimer}
  >
    {#if timerRunning}
      <i class="fas fa-pause"></i>
    {:else}
      <i class="fas fa-play"></i>
    {/if}
    {m.timer()}
    <span class="kbd text-base-content">
      {#if type === 'COMMENT_LIST'}
        ⇧ ␣
      {:else if type === 'SPEAKERS_LIST'}
        ␣
      {/if}
    </span>
  </button>
  <div class="join">
    <button
      class="btn join-item flex gap-2 btn-lg
				{!speakersList?.speakers?.length ? 'btn-disabled' : 'btn-square'}"
      aria-label="remove time"
      onclick={() => changeTimer(-10)}
    >
      <i class="fas fa-minus"></i>
    </button>
    <button
      class="btn join-item flex gap-2 btn-lg
				{!speakersList?.speakers?.length ? 'btn-disabled' : ''}"
      onclick={resetTimer}
    >
      <i class="fas fa-rotate-left"></i>
      <span class="kbd text-base-content">
        {#if type === 'COMMENT_LIST'}
          ⌥ ⇧ R
        {:else if type === 'SPEAKERS_LIST'}
          ⌥ R
        {/if}
      </span>
    </button>
    <button
      class="btn join-item flex gap-2 btn-lg
				{!speakersList?.speakers?.length ? 'btn-disabled' : 'btn-square'}"
      aria-label="add time"
      onclick={() => changeTimer(10)}
    >
      <i class="fas fa-plus"></i>
    </button>
  </div>
</div>
