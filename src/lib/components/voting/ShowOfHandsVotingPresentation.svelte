<script lang="ts">
import hotkeys from "hotkeys-js";
import { onMount } from "svelte";
import { cubicIn, cubicOut } from "svelte/easing";
import { blur, fly } from "svelte/transition";
import type {
  CommitteePresentationQuery$result,
  RegionalGroupEnum$options,
} from "$houdini";
import Flag from "$lib/components/Flag.svelte";
import type { CommitteeSettings, VotingStage } from "$lib/local-db/localDB";
import { m } from "$lib/paraglide/messages";
import ResultChart from "./ResultChart.svelte";

interface Props {
  committeeSettings?: CommitteeSettings;
}
const { committeeSettings }: Props = $props();

const resultBoxes = $derived.by(() => {
  const boxes = [
    {
      faIcon: "fa-circle-plus",
      value: committeeSettings?.showOfHandsVotingVotesPro || 0,
      classes: "bg-success text-success-content",
    },
  ];
  if (committeeSettings?.votingWithAbstentions) {
    boxes.push({
      faIcon: "fa-circle",
      value: committeeSettings?.showOfHandsVotingVotesAbstain || 0,
      classes: "bg-info text-info-content",
    });
  }

  boxes.push({
    faIcon: "fa-circle-minus",
    value: committeeSettings?.showOfHandsVotingVotesCon || 0,
    classes: "bg-error text-error-content",
  });

  return boxes;
});

const getClasses = (stage: VotingStage) => {
  switch (stage) {
    case "PRO":
      return "bg-success text-success-content";
    case "CON":
      return "bg-error text-error-content";
    case "ABSTAIN":
      return "bg-info text-info-content";
    default:
      return "bg-base-200 text-base-content";
  }
};

const getFaIcon = (stage: VotingStage) => {
  switch (stage) {
    case "PRO":
      return "fa-circle-plus";
    case "CON":
      return "fa-circle-minus";
    case "ABSTAIN":
      return "fa-circle";
    default:
      return "";
  }
};

const getText = (stage: VotingStage) => {
  switch (stage) {
    case "PRO":
      return m.pro();
    case "CON":
      return m.con();
    case "ABSTAIN":
      return m.abstain();
    default:
      return "";
  }
};
</script>

{#snippet VoteNowBox(stage: VotingStage)}
	<div
		class="{getClasses(
			stage
		)} card top-30 absolute inset-10 mb-4 items-center justify-center gap-4 p-10 shadow-sm"
		in:fly={{ duration: 500, delay: 500, easing: cubicOut, x: 10 }}
		out:fly={{ duration: 500, easing: cubicIn, x: -10 }}
	>
		<i class="fas fa-{getFaIcon(stage).replace('fa-', '')} text-7xl"></i>
		<h3 class="text-5xl font-bold">{getText(stage)}</h3>
		<i class="fas fa-spinner fa-spin text-2xl"></i>
	</div>
{/snippet}

{#if committeeSettings && committeeSettings.showOfHandsVotingActive}
	<div class="modal modal-open">
		<div
			class="modal-box bg-base-200 max-h-9/12 max-w-9/12 relative h-full w-full"
			in:fly={{ y: 100, duration: 1000, easing: cubicOut }}
			out:fly={{ y: 100, duration: 1000, easing: cubicIn }}
		>
			<h2 class="mb-8 w-full text-center text-4xl font-bold">
				{committeeSettings.votingVoteName || m.showOfHandsVoting()}
			</h2>

			{#if committeeSettings.showOfHandsVotingStage === 'PRO'}
				{@render VoteNowBox('PRO')}
			{:else if committeeSettings.showOfHandsVotingStage === 'CON'}
				{@render VoteNowBox('CON')}
			{:else if committeeSettings.showOfHandsVotingStage === 'ABSTAIN'}
				{@render VoteNowBox('ABSTAIN')}
			{:else if committeeSettings.showOfHandsVotingStage === 'EVALUATION'}
				<div
					class="top-30 absolute inset-10 mb-4 flex flex-col items-stretch justify-center gap-4 p-10"
					in:fly={{ duration: 500, delay: 500, easing: cubicOut, y: 40 }}
				>
					<ResultChart
						votesPro={committeeSettings.showOfHandsVotingVotesPro}
						votesCon={committeeSettings.showOfHandsVotingVotesCon}
						votesAbstain={committeeSettings.showOfHandsVotingVotesAbstain}
						total={committeeSettings.showOfHandsVotingVotesTotal}
						majorityAmount={committeeSettings.votingMajorityAmount}
					/>

					<div class="flex items-center justify-center gap-6">
						{#each resultBoxes as box, i (box.faIcon)}
							{#if committeeSettings.showOfHandsVotingStage === 'EVALUATION'}
								<div
									class="card {box.classes} min-w-26 items-center justify-center gap-4 px-10 py-4 shadow-sm"
								>
									<i class="fas {box.faIcon} text-3xl"></i>
									<h3 class="text-4xl font-bold">{box.value}</h3>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
