<script lang="ts">
import dayjs from "dayjs";
import toast from "svelte-french-toast";
import { type CommitteeStatusEnum$options, graphql } from "$houdini";
import Tabs from "$lib/components/Tabs.svelte";
import { m } from "$lib/paraglide/messages";
import { serverTime } from "$lib/state/serverTime.svelte";
import { promiseToastStrings } from "$lib/utils/toast";

type Props = {
  committeeId: string;
  oldStatus?: CommitteeStatusEnum$options;
  oldUntil?: Date;
  oldCustomName?: string;
  abort?: () => void;
};
const {
  committeeId,
  oldStatus,
  oldUntil,
  oldCustomName = "",
  abort,
}: Props = $props();

const categories: {
  id: CommitteeStatusEnum$options;
  faIcon: string;
}[] = [
  { id: "FORMAL", faIcon: "podium" },
  { id: "INFORMAL", faIcon: "comments" },
  { id: "PAUSE", faIcon: "mug-saucer" },
  { id: "SUSPENSION", faIcon: "forward-step" },
];

const absoluteTimes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const relativeTimes = [3, 5, 10, 15, 20, 25, 30];

let activeCategory: CommitteeStatusEnum$options = $state("INFORMAL");
const until = $state(dayjs(oldUntil) ?? $serverTime);
const untilFormatted = $derived(dayjs(until).format("HH:mm:ss"));
const customName = $state(oldCustomName);

let customNameOpen = $state(false);

const StatusChangerMutation = graphql(`
		mutation StatusChanger(
			$status: CommitteeStatusEnum!
			$until: DateTime!
			$customName: String!
			$committeeId: ID!
		) {
			updateCommittee(
				id: $committeeId
				status: $status
				statusUntil: $until
				statusHeadline: $customName
			) {
				id
			}
		}
	`);

const submitStatus = async () => {
  if (until.isBefore($serverTime)) {
    toast.error(m.dateCannotBeInPast());
  }
  await toast.promise(
    StatusChangerMutation.mutate({
      status: activeCategory,
      until: until.toDate(),
      customName: customName,
      committeeId: committeeId,
    }),
    promiseToastStrings(m.committeeStatus(), "update"),
  );
};

$effect(() => {
  if (customName) {
    customNameOpen = true;
  }
});

$effect(() => {
  if (oldStatus) {
    switch (oldStatus) {
      case "FORMAL":
        activeCategory = "INFORMAL";
        break;
      default:
        activeCategory = "FORMAL";
        break;
    }
  }
});
</script>

<div class="flex flex-col gap-4">
	<Tabs tabs={categories} bind:activeTab={activeCategory} />
	<div class="card bg-base-200 flex flex-row items-center gap-2 p-2">
		<i class="fa-duotone fa-clock w-8 text-center text-2xl"></i>
		<div
			class="grid flex-1 grid-cols-4 items-center gap-1 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-12"
		>
			{#each absoluteTimes as time}
				<button
					class="btn bg-base-100 flex-1"
					onclick={() =>
						(until = $serverTime.minute(time).second(0).isBefore($serverTime)
							? $serverTime.add(1, 'hour').minute(time).second(0)
							: $serverTime.minute(time).second(0))}
				>
					{time}
				</button>
			{/each}
		</div>
	</div>
	<div class="card bg-base-200 flex flex-row items-center gap-2 p-2">
		<i class="fa-duotone fa-timer w-8 text-center text-2xl"></i>
		<div class="grid flex-1 grid-cols-4 items-center gap-1 md:grid-cols-5 lg:grid-cols-7">
			{#each relativeTimes as time}
				<button
					class="btn bg-base-100 flex-1"
					onclick={() => (until = $serverTime.add(time, 'minute'))}
				>
					{time}
				</button>
			{/each}
		</div>
	</div>
	<div class="flex w-full gap-2">
		<input
			type="time"
			class="input input-xl w-full flex-1 text-center font-mono"
			value={untilFormatted}
			onchange={(e) => {
				const inputValue = (e.target as HTMLInputElement).value;
				const parts = inputValue.split(':');
				until = $serverTime
					.hour(parseInt(parts[0], 10))
					.minute(parseInt(parts[1], 10))
					.second(parseInt(parts[2], 10));
			}}
			step="1"
		/>
		<button
			class="btn btn-square btn-xl"
			aria-label="Decrease time"
			onclick={() => (until = dayjs(until).subtract(1, 'minute'))}
		>
			<i class="fa-solid fa-minus"></i>
		</button>
		<button
			class="btn btn-square btn-xl"
			onclick={() => (until = dayjs(until).add(1, 'minute'))}
			aria-label="Increase time"
		>
			<i class="fa-solid fa-plus"></i>
		</button>
		<button
			class="btn btn-square btn-xl {customNameOpen ? 'btn-primary' : ''}"
			onclick={() => {
				if (customNameOpen) {
					customNameOpen = false;
					customName = '';
				} else {
					customNameOpen = true;
				}
			}}
			aria-label="Increase time"
		>
			<i class="fa-solid fa-tag"></i>
		</button>
	</div>
	{#if customNameOpen}
		<input
			type="text"
			class="input w-full flex-1 py-2 text-center"
			bind:value={customName}
			placeholder={m.customName()}
		/>
	{/if}
	<div class="flex w-full gap-2">
		{#if abort}
			<button
				class="btn btn-error btn-lg"
				onclick={() => {
					abort();
				}}
			>
				<i class="fas fa-xmark mr-2"></i>
				{m.abort()}
			</button>
		{/if}
		<button
			class="btn btn-primary btn-lg w-full flex-1 {until.isBefore($serverTime)
				? 'btn-disabled'
				: ''}"
			onclick={() => {
				submitStatus();
				if (abort) {
					abort();
				}
			}}
		>
			<i class="fas fa-save mr-2"></i>
			{m.submitStatus()}
		</button>
	</div>
</div>
