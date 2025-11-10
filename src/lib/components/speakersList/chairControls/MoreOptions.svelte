<script lang="ts">
import dayjs from "dayjs";
import toast from "svelte-french-toast";
import {
  type CommitteeTeamQuery$result,
  graphql,
  type SpeakersListCategoryEnum$options,
} from "$houdini";
import { alertDialog } from "$lib/components/Alert/alert";
import Modal from "$lib/components/Modal.svelte";
import Popover from "$lib/components/Popover.svelte";
import Tabs from "$lib/components/Tabs.svelte";
import { m } from "$lib/paraglide/messages";
import { promiseToastStrings } from "$lib/utils/toast";

interface Props {
  speakersList?:
    | NonNullable<
        CommitteeTeamQuery$result["findFirstCommittee"]["activeAgendaItem"]
      >["speakersList"][number]
    | null;
  type: SpeakersListCategoryEnum$options;
}

const { speakersList, type }: Props = $props();

let isOpen = $state(false);

let changeSpeakersNameModalOpen = $state(false);
let changeSpeakersNameValue = $state("");
let changeSpeakingTimeModalOpen = $state(false);
const changeSpeakingTimeValue = $state(speakersList?.speakingTime ?? 0);
const chageSpeakingTimeDisplayValue = $derived(
  dayjs.duration(changeSpeakingTimeValue, "seconds").format("mm:ss"),
);

const closeListTabs = [
  {
    id: false,
    faIcon: "lock-open",
  },
  {
    id: true,
    faIcon: "lock",
  },
];

const OpenOrCloseListMutation = graphql(`
		mutation OpenOrCloseList($speakersListId: ID!, $isClosed: Boolean!) {
			updateSpeakersList(id: $speakersListId, isClosed: $isClosed) {
				id
				isClosed
			}
		}
	`);

const openOrCloseList = async (isClosed: boolean) => {
  if (!speakersList?.id) return;
  await toast.promise(
    OpenOrCloseListMutation.mutate({
      speakersListId: speakersList.id,
      isClosed,
    }),
    promiseToastStrings(
      speakersList.type === "COMMENT_LIST" ? m.commentList() : m.speakersList(),
      "update",
    ),
  );
};

const ClearListMutation = graphql(`
		mutation ClearList($speakersListId: ID!) {
			clearSpeakersList(id: $speakersListId) {
				id
				speakers {
					id
				}
			}
		}
	`);

const clearList = async () => {
  if (!speakersList?.id) return;
  isOpen = false;
  if (
    await alertDialog({
      title: m.clearList(),
      description: m.clearListDescription(),
      confirmText: m.yes(),
      cancelText: m.abort(),
      confirmColor: "error",
    })
  ) {
    await toast.promise(
      ClearListMutation.mutate({
        speakersListId: speakersList.id,
      }),
      promiseToastStrings(
        speakersList.type === "COMMENT_LIST"
          ? m.commentList()
          : m.speakersList(),
        "delete",
      ),
    );
  }
};

const updateSpeakerOnListMutation = graphql(`
		mutation UpdateSpeakerOnList($speakerOnListId: ID!, $overwriteName: String) {
			updateSpeakerOnList(id: $speakerOnListId, overwriteName: $overwriteName) {
				id
				overwriteName
			}
		}
	`);

const changeSpeakersName = async () => {
  if (!speakersList?.id || !changeSpeakersNameValue) return;

  const existingSpeakerId = speakersList.speakers
    .sort((a, b) => a.position - b.position)
    .at(0)?.id;

  if (!existingSpeakerId) {
    toast.error(m.noCurrentSpeaker());
    return;
  }
  await toast.promise(
    updateSpeakerOnListMutation.mutate({
      speakerOnListId: existingSpeakerId,
      overwriteName: changeSpeakersNameValue,
    }),
    promiseToastStrings(
      speakersList.type === "COMMENT_LIST" ? m.commentList() : m.speakersList(),
      "update",
    ),
  );
  changeSpeakersNameModalOpen = false;
};

const updateSpeakersListMutation = graphql(`
		mutation UpdateSpeakersList($speakersListId: ID!, $speakingTime: Int) {
			updateSpeakersList(
				id: $speakersListId
				speakingTime: $speakingTime
				timeLeft: $speakingTime
			) {
				id
				speakingTime
			}
		}
	`);

const changeSpeakersTime = async () => {
  if (!speakersList?.id || changeSpeakingTimeValue < 0) return;

  await toast.promise(
    updateSpeakersListMutation.mutate({
      speakersListId: speakersList.id,
      speakingTime: changeSpeakingTimeValue,
    }),
    promiseToastStrings(
      speakersList.type === "COMMENT_LIST" ? m.commentList() : m.speakersList(),
      "update",
    ),
  );
  changeSpeakingTimeModalOpen = false;
};

$effect(() => {
  if (speakersList && speakersList?.speakers.length > 0) {
    const overwriteName = speakersList.speakers
      .toSorted((a, b) => a.position - b.position)
      .at(0)?.overwriteName;
    changeSpeakersNameValue = overwriteName || "";
  }
});
</script>

<Popover bind:open={isOpen}>
	{#snippet Trigger()}
		<button class="btn btn-lg" aria-label="More options" tabindex="-1">
			<i class="fas fa-gears"> </i>
		</button>
	{/snippet}
	{#snippet Content()}
		<div class="flex flex-col gap-2">
			<Tabs
				tabs={closeListTabs}
				activeTab={!!speakersList?.isClosed}
				onTabChange={(newStatus) => openOrCloseList(newStatus)}
			/>
			<button
				class={speakersList?.speakers?.length ? 'btn' : 'btn btn-disabled'}
				onclick={() => {
					if (!speakersList?.speakers?.length) return;
					changeSpeakersNameModalOpen = true;
					isOpen = false;
				}}
			>
				<i class="fas fa-pencil"></i>
				{m.changeSpeakersName()}
			</button>
			<button
				class="btn"
				onclick={() => {
					changeSpeakingTimeModalOpen = true;
					isOpen = false;
				}}
			>
				<i class="fas fa-timer"></i>
				{m.changeSpeakersTime()}
			</button>
			<button class="btn btn-error" onclick={clearList}>
				<i class="fas fa-trash"></i>
				{m.clearList()}
			</button>
		</div>
	{/snippet}
</Popover>

<Modal bind:open={changeSpeakersNameModalOpen}>
	<h1 class="mb-2 text-2xl font-bold">{m.changeSpeakersName()}</h1>
	<input
		type="text"
		class="input input-lg w-full"
		bind:value={changeSpeakersNameValue}
		placeholder={m.speakersListNamePlaceholder()}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				changeSpeakersName();
			} else if (e.key === 'Escape') {
				changeSpeakersNameModalOpen = false;
			}
		}}
	/>
	<div class="modal-action">
		<button class="btn" onclick={() => (changeSpeakersNameModalOpen = false)}>
			{m.abort()}
		</button>
		<button class="btn btn-primary" onclick={changeSpeakersName}>
			{m.save()}
		</button>
	</div>
</Modal>

<Modal bind:open={changeSpeakingTimeModalOpen}>
	<h1 class="mb-2 text-2xl font-bold">{m.changeSpeakersTime()}</h1>
	<input
		class="input input-lg w-full"
		value={chageSpeakingTimeDisplayValue}
		type="time"
		onchange={(e: Event) => {
			const target = e.target as HTMLInputElement;
			const [minutes, seconds] = target.value.split(':').map(Number);
			changeSpeakingTimeValue = minutes * 60 + seconds;
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				changeSpeakersTime();
			} else if (e.key === 'Escape') {
				changeSpeakingTimeModalOpen = false;
			}
		}}
	/>
	<div class="modal-action">
		<button class="btn" onclick={() => (changeSpeakingTimeModalOpen = false)}>
			{m.abort()}
		</button>
		<button class="btn btn-primary" onclick={changeSpeakersTime}>
			{m.save()}
		</button>
	</div>
</Modal>
