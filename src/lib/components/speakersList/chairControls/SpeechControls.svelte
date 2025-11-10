<script lang="ts">
import dayjs from "dayjs";
import hotkeys from "hotkeys-js";
import { onMount } from "svelte";
import toast from "svelte-french-toast";
import {
  type CommitteeTeamQuery$result,
  graphql,
  type SpeakersListCategoryEnum$options,
} from "$houdini";
import { m } from "$lib/paraglide/messages";
import { serverTime } from "$lib/state/serverTime.svelte";

type List =
  | NonNullable<
      CommitteeTeamQuery$result["findFirstCommittee"]["activeAgendaItem"]
    >["speakersList"][number]
  | null;

interface Props {
  type: SpeakersListCategoryEnum$options;
  speakersList?: List;
  otherList?: List;
}

const { speakersList, type, otherList }: Props = $props();

const timerRunning = $derived(!!speakersList?.startTimestamp);

const UpdateSpeakersListTimingsMutation = graphql(`
		mutation UpdateSpeakersListTimings(
			$speakersListId: ID!
			$startTimestamp: DateTime
			$timeLeft: Int
			$stopTimer: Boolean
		) {
			updateSpeakersList(
				id: $speakersListId
				timeLeft: $timeLeft
				startTimestamp: $startTimestamp
				stopTimer: $stopTimer
			) {
				speakingTime
				startTimestamp
			}
		}
	`);

const UpdateSpeakersListTimingsWithOtherListMutation = graphql(`
		mutation UpdateSpeakersListWithOtherListTimings(
			$speakersListId: ID!
			$startTimestamp: DateTime
			$timeLeft: Int
			$stopTimer: Boolean
			$otherListId: ID!
			$otherListStartTimestamp: DateTime
			$otherListTimeLeft: Int
			$otherListStopTimer: Boolean
		) {
			MainUpdateSpeakersList: updateSpeakersList(
				id: $speakersListId
				timeLeft: $timeLeft
				startTimestamp: $startTimestamp
				stopTimer: $stopTimer
			) {
				speakingTime
				startTimestamp
			}

			OtherUpdateSpeakersList: updateSpeakersList(
				id: $otherListId
				timeLeft: $otherListTimeLeft
				startTimestamp: $otherListStartTimestamp
				stopTimer: $otherListStopTimer
			) {
				speakingTime
				startTimestamp
			}
		}
	`);

const startTimer = async () => {
  if (!speakersList) return;

  if (otherList) {
    await UpdateSpeakersListTimingsWithOtherListMutation.mutate(
      {
        speakersListId: speakersList.id,
        startTimestamp: $serverTime.toDate(),
        otherListId: otherList.id,
        otherListStopTimer: true,
        otherListTimeLeft:
          otherList.type === "SPEAKERS_LIST"
            ? speakersList.speakingTime
            : otherList.speakingTime,
      },
      {
        optimisticResponse: {
          MainUpdateSpeakersList: {
            speakingTime: speakersList.speakingTime,
            startTimestamp: $serverTime.toDate(),
          },
          OtherUpdateSpeakersList: {
            speakingTime: otherList.speakingTime,
          },
        },
      },
    );
  } else {
    await UpdateSpeakersListTimingsMutation.mutate(
      {
        speakersListId: speakersList.id,
        startTimestamp: $serverTime.toDate(),
      },
      {
        optimisticResponse: {
          updateSpeakersList: {
            speakingTime: speakersList.speakingTime,
            startTimestamp: $serverTime.toDate(),
          },
        },
      },
    );
  }
};

const stopTimer = async () => {
  if (!speakersList) return;

  await UpdateSpeakersListTimingsMutation.mutate({
    speakersListId: speakersList.id,
    timeLeft:
      dayjs(speakersList.startTimestamp).diff($serverTime, "seconds") +
      speakersList.timeLeft,
    stopTimer: true,
  }).then((r) => {
    if (r.errors) {
      toast.error(m.errorUpdatingTimer());
      console.error("Error starting timer:", r.errors);
    }
  });
};

const resetTimer = async () => {
  if (!speakersList) return;

  await UpdateSpeakersListTimingsMutation.mutate({
    speakersListId: speakersList.id,
    timeLeft: speakersList.speakingTime,
    startTimestamp: speakersList.startTimestamp
      ? $serverTime.toDate()
      : undefined,
    stopTimer: !speakersList.startTimestamp,
  }).then((r) => {
    if (r.errors) {
      toast.error(m.errorUpdatingTimer());
      console.error("Error starting timer:", r.errors);
    }
  });
};

const changeTimer = async (delta: number) => {
  if (!speakersList) return;

  await UpdateSpeakersListTimingsMutation.mutate({
    speakersListId: speakersList.id,
    timeLeft: speakersList.timeLeft + delta,
  }).then((r) => {
    if (r.errors) {
      toast.error(m.errorUpdatingTimer());
      console.error("Error starting timer:", r.errors);
    }
  });
};

onMount(() => {
  hotkeys("space, shift+space, alt+r, alt+shift+r", (event, handler) => {
    event.preventDefault();
    if (!speakersList?.speakers?.length) return;
    switch (handler.key) {
      case "space":
        if (type === "SPEAKERS_LIST") {
          if (timerRunning) {
            stopTimer();
          } else {
            startTimer();
          }
        }
        break;
      case "shift+space":
        if (type === "COMMENT_LIST") {
          console.log("Start /Stop Timer Comment List");
          if (timerRunning) {
            stopTimer();
          } else {
            startTimer();
          }
        }
        break;
      case "alt+r":
        if (type === "SPEAKERS_LIST") {
          console.log("Reset Timer Speakers List");
          resetTimer();
        }
        break;
      case "alt+shift+r":
        if (type === "COMMENT_LIST") {
          console.log("Reset Timer Comment List");
          resetTimer();
        }
        break;
    }
  });
});
</script>

<div class="flex gap-2">
	<button
		class="btn btn-lg join-item flex flex-1 gap-2
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
			class="btn btn-lg join-item flex gap-2
				{!speakersList?.speakers?.length ? 'btn-disabled' : 'btn-square'}"
			aria-label="remove time"
			onclick={() => changeTimer(-10)}
		>
			<i class="fas fa-minus"></i>
		</button>
		<button
			class="btn btn-lg join-item flex gap-2
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
			class="btn btn-lg join-item flex gap-2
				{!speakersList?.speakers?.length ? 'btn-disabled' : 'btn-square'}"
			aria-label="add time"
			onclick={() => changeTimer(10)}
		>
			<i class="fas fa-plus"></i>
		</button>
	</div>
</div>
