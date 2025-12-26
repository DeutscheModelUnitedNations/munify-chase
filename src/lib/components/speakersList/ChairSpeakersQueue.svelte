<script lang="ts">
  import { flip } from 'svelte/animate';
  import { cubicInOut, cubicOut } from 'svelte/easing';
  import { blur, fly } from 'svelte/transition';
  import toast from 'svelte-french-toast';
  import { m } from '$lib/paraglide/messages';
  import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
  import { promiseToastStrings } from '$lib/utils/toast';
  import Flag from '../Flag.svelte';
  import StripesAlert from './StripesAlert.svelte';
  import type { committeeTeamQuery } from '$lib/queries/committeeTeamQuery.svelte';
  import { client } from '$lib/api/rumbleClient/client';

  interface Props {
    rawSpeakers?: NonNullable<
      Awaited<ReturnType<typeof committeeTeamQuery>>['activeAgendaItem']
    >['speakersList'][number]['speakers'];
    closed?: boolean;
  }

  const { rawSpeakers, closed = false }: Props = $props();

  const speakers = $derived(
    rawSpeakers?.toSorted((a, b) => a.position - b.position).toSpliced(0, 1)
  );

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
        __args: {
          speakerOnListId
        },
        id: true,
        speakers: {
          id: true,
          position: true
        }
      }),
      promiseToastStrings(m.speaker(), 'delete')
    );
  };

  const moveSpeaker = (speakerOnListId: string, position: number) => {
    if (!speakerOnListId || position < 0) return;

    toast.promise(
      client.mutate.moveSpeakerToPosition({
        __args: {
          id: speakerOnListId,
          position
        },
        id: true,
        position: true
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
        class="group card relative flex flex-row items-center gap-4 border-1 border-base-100 p-4 transition-colors duration-300 hover:border-primary/30"
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
          class="invisible absolute right-4 join opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100"
        >
          <button
            class="btn join-item btn-square btn-soft btn-sm btn-error"
            aria-label="Delete Speaker"
            onclick={() => removeSpeaker(speaker.id)}
          >
            <i class="fa-solid fa-trash"></i>
          </button>
          <button
            class="btn join-item btn-square btn-soft btn-sm btn-primary"
            aria-label="Move Speaker Up"
            onclick={() => moveSpeaker(speaker.id, speaker.position - 1)}
          >
            <i class="fa-solid fa-chevron-up"></i>
          </button>
          <button
            class="btn join-item btn-square btn-soft btn-sm btn-primary"
            aria-label="Move Speaker Down"
            onclick={() => moveSpeaker(speaker.id, speaker.position + 1)}
          >
            <i class="fa-solid fa-chevron-down"></i>
          </button>
          <button
            class="btn join-item btn-square btn-soft btn-sm btn-primary"
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
