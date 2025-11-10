<script lang="ts">
import { liveQuery } from "dexie";
import hotkeys from "hotkeys-js";
import toast from "svelte-french-toast";
import type { CommitteeTeamQuery$result } from "$houdini";
import {
  localDB,
  type VotingMajority,
  type VotingOptions,
} from "$lib/local-db/localDB";
import { m } from "$lib/paraglide/messages";
import {
  getTranslatedCountryNameFromAlpha3Code,
  sortTranslatedCountries,
} from "$lib/utils/nationTranslationHelper.svelte";
import Modal from "../Modal.svelte";
import ScrollingCountryList from "../rollCall/ScrollingCountryList.svelte";
import ResultChart from "./ResultChart.svelte";

interface Props {
  active: boolean;
  committee: CommitteeTeamQuery$result["findFirstCommittee"];
  voteName?: string;
  majority?: VotingMajority;
  withAbstentions?: boolean;
}

let {
  active = $bindable(),
  committee,
  voteName,
  majority,
  withAbstentions,
}: Props = $props();

let currentIndex = $state(0);
let stage = $state<"ROLL_CALL" | "EVALUATION">("ROLL_CALL");

const members = committee?.members
  .filter(
    (member) => member.present && member.representation?.type === "DELEGATION",
  )
  .sort((a, b) =>
    sortTranslatedCountries(a.representation!, b.representation!),
  );

const majorityAmount = $derived.by(() => {
  switch (majority) {
    case "SIMPLE":
      return committee?.simpleMajority ?? 0;
    case "TWO_THIRDS":
      return committee?.twoThirdsMajority ?? 0;
    default:
      return 0;
  }
});

const chairSettings = liveQuery(() =>
  localDB.committeeSettings.get(committee.id),
);
const rollCallVotingAbstain = $derived(
  $chairSettings?.rollCallVotingAbstain ?? [],
);
const rollCallVotingPro = $derived($chairSettings?.rollCallVotingPro ?? []);
const rollCallVotingCon = $derived($chairSettings?.rollCallVotingCon ?? []);

const scrollingListIcons = $derived.by(() => {
  return members.map((member) => {
    let icon: string = "";
    let color: "info" | "success" | "error" = "info";
    if (rollCallVotingAbstain?.includes(member.id)) {
      icon = "fa-circle";
      color = "info";
    } else if (rollCallVotingPro?.includes(member.id)) {
      icon = "fa-circle-plus";
      color = "success";
    } else if (rollCallVotingCon?.includes(member.id)) {
      icon = "fa-circle-minus";
      color = "error";
    } else {
      icon = "fa-question"; // Default icon if no vote is set
    }
    return {
      id: member.id,
      icon,
      color,
    };
  });
});

const changeVote = async (
  member: (typeof members)[number],
  vote: VotingOptions,
) => {
  if (!committee) return;
  if (
    [
      ...rollCallVotingPro,
      ...rollCallVotingCon,
      ...rollCallVotingAbstain,
    ].includes(member.id)
  ) {
    await localDB.committeeSettings.update(committee.id, {
      rollCallVotingPro: rollCallVotingPro?.filter((id) => id !== member.id),
      rollCallVotingCon: rollCallVotingCon?.filter((id) => id !== member.id),
      rollCallVotingAbstain: rollCallVotingAbstain?.filter(
        (id) => id !== member.id,
      ),
    });
  }
  switch (vote) {
    case "PRO": {
      const updatedPro = rollCallVotingPro?.includes(member.id)
        ? rollCallVotingPro
        : [...(rollCallVotingPro ?? []), member.id];
      await localDB.committeeSettings.update(committee.id, {
        rollCallVotingPro: updatedPro,
      });
      break;
    }
    case "CON": {
      const updatedCon = rollCallVotingCon?.includes(member.id)
        ? rollCallVotingCon
        : [...(rollCallVotingCon ?? []), member.id];
      await localDB.committeeSettings.update(committee.id, {
        rollCallVotingCon: updatedCon,
      });
      break;
    }
    case "ABSTAIN": {
      const updatedAbstain = rollCallVotingAbstain?.includes(member.id)
        ? rollCallVotingAbstain
        : [...(rollCallVotingAbstain ?? []), member.id];
      await localDB.committeeSettings.update(committee.id, {
        rollCallVotingAbstain: updatedAbstain,
      });
      break;
    }
  }
};

const setVote = async (vote: VotingOptions) => {
  const member = members[currentIndex];
  if (member) {
    await changeVote(member, vote);

    if (currentIndex === members.length - 1) {
      stage = "EVALUATION";
    }
    currentIndex = (currentIndex + 1) % members.length;
  } else {
    toast.error(m.rollCallError());
  }
};

$effect(() => {
  if (active) {
    hotkeys("j, k, l, esc", "rollCallVote", (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case "k":
          if (stage === "ROLL_CALL" && withAbstentions) {
            setVote("ABSTAIN");
          }
          break;
        case "l":
          if (stage === "ROLL_CALL") {
            setVote("PRO");
          }
          break;
        case "j":
          if (stage === "ROLL_CALL") {
            setVote("CON");
          }
          break;
        case "esc":
          active = false;
          break;
      }
    });
    hotkeys.setScope("rollCallVote");
  } else {
    hotkeys.deleteScope("rollCallVote");
  }
});

$effect(() => {
  if (!committee) return;
  if (active) {
    stage = "ROLL_CALL";
    currentIndex = 0;
    localDB.committeeSettings.update(committee.id, {
      rollCallVotingActive: true,
      votingVoteName: voteName,
      votingMajority: majority,
      rollCallVotingPro: [],
      rollCallVotingCon: [],
      rollCallVotingAbstain: [],
      votingWithAbstentions: withAbstentions,
      votingMajorityAmount: majorityAmount,
    });
  } else {
    localDB.committeeSettings.update(committee.id, {
      rollCallVotingActive: false,
      rollCallVotingPro: [],
      rollCallVotingCon: [],
      rollCallVotingAbstain: [],
      votingVoteName: null,
      votingMajority: null,
      votingWithAbstentions: false,
      votingMajorityAmount: null,
    });
  }
});
</script>

<Modal bind:open={active}>
	<h1 class="mb-4 text-2xl font-bold">{voteName || m.rollCallVoting()}</h1>

	<ResultChart
		{majorityAmount}
		votesAbstain={rollCallVotingAbstain?.length}
		votesCon={rollCallVotingCon?.length}
		votesPro={rollCallVotingPro?.length}
		total={members.length}
		showNumbers
	/>

	{#if stage === 'ROLL_CALL'}
		<div class="h-2"></div>

		<ScrollingCountryList {members} {currentIndex} icons={scrollingListIcons} height="50vh" />

		<div class="modal-action flex-col justify-around">
			<div class="flex flex-row justify-center gap-4">
				<button
					class="btn btn-outline btn-lg join-item"
					aria-label="Move up"
					onclick={() => {
						currentIndex = (currentIndex - 1 + members.length) % members.length;
					}}
				>
					<i class="fas fa-chevron-up"></i>
				</button>
			</div>
			<div class="flex flex-row justify-center gap-4">
				<button
					class="btn btn-error btn-lg flex gap-2"
					onclick={() => {
						setVote('CON');
					}}
				>
					<i class="fas fa-circle-minus"></i>
					{m.con()}
					<span class="kbd">J</span>
				</button>
				{#if withAbstentions}
					<button
						class="btn btn-info btn-lg flex gap-2"
						onclick={() => {
							setVote('ABSTAIN');
						}}
					>
						<i class="fas fa-circle"></i>
						{m.abstain()}
						<span class="kbd">K</span>
					</button>
				{/if}
				<button
					class="btn btn-success btn-lg flex gap-2"
					onclick={() => {
						setVote('PRO');
					}}
				>
					<i class="fas fa-circle-plus"></i>
					{m.pro()}
					<span class="kbd">L</span>
				</button>
			</div>
		</div>
	{:else}
		<div class="modal-action">
			<button
				class="btn btn-lg flex gap-2"
				onclick={() => {
					active = false;
				}}
			>
				<i class="fas fa-xmark"></i>
				{m.close()}
				<span class="kbd">esc</span>
			</button>
		</div>
	{/if}

	<div class="absolute right-3 top-3">
		<button
			aria-label="Close modal"
			class="btn btn-ghost btn-circle btn-sm"
			onclick={() => {
				active = false;
			}}
		>
			<i class="fa-duotone fa-xmark"></i>
		</button>
	</div>
</Modal>
