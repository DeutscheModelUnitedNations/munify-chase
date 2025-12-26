<script lang="ts">
  import hotkeys from "hotkeys-js";
  import { onMount } from "svelte";
  import toast from "svelte-french-toast";
  import { alertDialog } from "$lib/components/Alert/alert";
  import { m } from "$lib/paraglide/messages";
  import { promiseToastStrings } from "$lib/utils/toast";
  import type { committeeTeamQuery } from "$lib/queries/committeeTeamQuery.svelte";
  import {
    client,
    type SpeakerslistcategoryEnum,
  } from "$lib/api/rumbleClient/client";

  interface Props {
    speakersList?:
      | NonNullable<
          Awaited<ReturnType<typeof committeeTeamQuery>>["activeAgendaItem"]
        >["speakersList"][number]
      | null;
    childList?:
      | NonNullable<
          Awaited<ReturnType<typeof committeeTeamQuery>>["activeAgendaItem"]
        >["speakersList"][number]
      | null;
    type: SpeakerslistcategoryEnum;
  }

  const { speakersList, type, childList }: Props = $props();

  const nextSpeaker = async () => {
    if (speakersList && speakersList?.speakers.length > 0) {
      const speaker = speakersList.speakers.sort(
        (a, b) => a.position - b.position,
      )[0];
      if (childList) {
        if (
          await alertDialog({
            title: m.nextSpeaker(),
            description: m.nextSpeakerDescription(),
            confirmText: m.nextSpeaker(),
            cancelText: m.abort(),
            confirmColor: "error",
          })
        )
          toast.promise(
            Promise.all([
              client.mutate.removeSpeakerOnList({
                __args: {
                  speakerOnListId: speaker.id,
                },
                id: true,
              }),
              // update main speakers list
              client.mutate.updateSpeakersList({
                __args: {
                  id: speakersList.id,
                  timeLeft: speakersList.speakingTime,
                  stopTimer: true,
                },
                id: true,
              }),
              // update child list
              client.mutate.updateSpeakersList({
                __args: {
                  id: childList.id,
                  timeLeft: childList.speakingTime,
                  stopTimer: true,
                  isClosed: false,
                },
                id: true,
              }),
              client.mutate.clearSpeakersList({
                __args: {
                  id: childList.id,
                },
                id: true,
              }),
            ]),

            promiseToastStrings(m.nextSpeaker(), "update"),
          );
      } else {
        toast.promise(
          Promise.all([
            client.mutate.removeSpeakerOnList({
              __args: {
                speakerOnListId: speaker.id,
              },
              id: true,
            }),
            client.mutate.updateSpeakersList({
              __args: {
                id: speakersList.id,
                timeLeft: speakersList.speakingTime,
                stopTimer: true,
              },
              id: true,
            }),
          ]),
          promiseToastStrings(m.nextSpeaker(), "update"),
        );
      }
    }
  };

  onMount(() => {
    hotkeys("alt+n, alt+shift+n", (event, handler) => {
      event.preventDefault();
      if (!speakersList?.speakers?.length) return;
      switch (handler.key) {
        case "alt+n":
          if (type === "SPEAKERS_LIST") {
            nextSpeaker();
          }
          break;
        case "alt+shift+n":
          if (type === "COMMENT_LIST") {
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
  <span class="kbd text-base-content">
    {#if type === "COMMENT_LIST"}
      ⌥ ⇧ N
    {:else if type === "SPEAKERS_LIST"}
      ⌥ N
    {/if}
  </span>
</button>
