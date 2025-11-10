<script lang="ts">
import hotkeys from "hotkeys-js";
import { onMount } from "svelte";
import type { CommitteeTeamQuery$result } from "$houdini";
import {
  localDB,
  type VotingMajority,
  type VotingStage,
} from "$lib/local-db/localDB";
import { m } from "$lib/paraglide/messages";
import Modal from "../Modal.svelte";
import ResultChart from "./ResultChart.svelte";
import VoteClicker from "./VoteClicker.svelte";

interface Props {
  active: boolean;
  committee?: CommitteeTeamQuery$result["findFirstCommittee"] | null;
  voteName?: string;
  majority: VotingMajority;
  withAbstentions: boolean;
}

let {
  active = $bindable(),
  voteName,
  majority,
  withAbstentions,
  committee,
}: Props = $props();

let currentState = $state<VotingStage>("PRO");

let votesPro = $state(0);
let votesCon = $state(0);
let votesAbstain = $state(0);
const votesOutstanding = $derived(
  committee?.totalPresent ?? 0 - (votesPro + votesCon + votesAbstain),
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

const exit = () => {
  votesPro = 0;
  votesCon = 0;
  votesAbstain = 0;
  currentState = "PRO";
  active = false;
};

const nextState = () => {
  switch (currentState) {
    case "PRO":
      currentState = "CON";
      break;
    case "CON":
      if (withAbstentions) {
        currentState = "ABSTAIN";
      } else {
        currentState = "EVALUATION";
      }
      break;
    case "ABSTAIN":
      currentState = "EVALUATION";
      break;
    case "EVALUATION":
      exit();
      break;
  }
};

const previousState = () => {
  switch (currentState) {
    case "CON":
      currentState = "PRO";
      break;
    case "ABSTAIN":
      currentState = "CON";
      break;
    case "EVALUATION":
      if (withAbstentions) {
        currentState = "ABSTAIN";
      } else {
        currentState = "CON";
      }
      break;
  }
};

onMount(() => {
  hotkeys("enter, esc, backspace", (event, handler) => {
    event.preventDefault();
    switch (handler.key) {
      case "enter":
        nextState();
        break;
      case "esc":
        exit();
        break;
      case "backspace":
        previousState();
        break;
    }
  });
});

$effect(() => {
  if (!committee) return;
  if (active) {
    localDB.committeeSettings.update(committee.id, {
      showOfHandsVotingActive: true,
      showOfHandsVotingStage: currentState,
      showOfHandsVotingVotesPro: votesPro,
      showOfHandsVotingVotesCon: votesCon,
      showOfHandsVotingVotesAbstain: votesAbstain,
      showOfHandsVotingVotesTotal: votesOutstanding,
      votingVoteName: voteName,
      votingMajority: majority,
      votingWithAbstentions: withAbstentions,
      votingMajorityAmount: majorityAmount,
    });
  } else {
    localDB.committeeSettings.update(committee.id, {
      showOfHandsVotingActive: false,
      showOfHandsVotingVotesPro: 0,
      showOfHandsVotingVotesCon: 0,
      showOfHandsVotingVotesAbstain: 0,
      showOfHandsVotingVotesTotal: 0,
      votingVoteName: null,
      votingMajority: null,
      votingWithAbstentions: false,
      votingMajorityAmount: null,
    });
  }
});
</script>

<Modal bind:open={active}>
	<h1 class="mb-2 text-2xl font-bold">{voteName || m.voting()}</h1>
	<h3 class="mb-4 text-lg font-semibold">
		{m.showOfHandsVoting()}
	</h3>

	<ResultChart
		total={committee?.totalPresent}
		{votesPro}
		{votesCon}
		{votesAbstain}
		{majorityAmount}
	/>

	<div class="mt-6 flex gap-4">
		<div
			class="{currentState === 'PRO'
				? 'bg-success text-success-content border-black'
				: 'bg-success/20'} card border-base-100 border-3 mb-4 w-full items-center justify-center gap-4 p-4 shadow-sm"
		>
			<h3 class="text-lg font-bold">{m.pro()}</h3>
			<VoteClicker active={currentState === 'PRO'} bind:value={votesPro} />
		</div>
		<div
			class="{currentState === 'CON'
				? 'bg-error text-error-content border-black'
				: 'bg-error/20'} card border-base-100 border-3 mb-4 w-full items-center justify-center gap-4 p-4 shadow-sm"
		>
			<h3 class="text-lg font-bold">{m.con()}</h3>
			<VoteClicker active={currentState === 'CON'} bind:value={votesCon} />
		</div>
		{#if withAbstentions}
			<div
				class="{currentState === 'ABSTAIN'
					? 'bg-info text-info-content border-black'
					: 'bg-info/20'} card border-base-100 border-3 mb-4 w-full items-center justify-center gap-4 p-4 shadow-sm"
			>
				<h3 class="text-lg font-bold">{m.abstain()}</h3>
				<VoteClicker active={currentState === 'ABSTAIN'} bind:value={votesAbstain} />
			</div>
		{/if}
	</div>

	<div class="modal-action justify-around">
		<button class="btn btn-lg flex gap-2" onclick={previousState} disabled={currentState === 'PRO'}>
			<i class="fas fa-arrow-left"></i>
			{m.back()}
			<span class="kbd">⌫</span>
		</button>
		<button
			class="btn {currentState === 'EVALUATION' ? 'btn-error' : 'btn-success'} btn-lg flex gap-2"
			onclick={() => {
				nextState();
			}}
		>
			{#if currentState === 'EVALUATION'}
				<i class="fas fa-xmark"></i>
				{m.close()}
			{:else if currentState === 'ABSTAIN' || (!withAbstentions && currentState === 'CON')}
				<i class="fas fa-paper-plane"></i>
				{m.publish()}
			{:else}
				<i class="fas fa-arrow-right"></i>
				{m.forward()}
			{/if}
			<span class="kbd">↵</span>
		</button>

		<div class="absolute right-3 top-3">
			<button aria-label="Close modal" class="btn btn-ghost btn-circle btn-sm" onclick={exit}>
				<i class="fa-duotone fa-xmark"></i>
			</button>
		</div>
	</div>
</Modal>
