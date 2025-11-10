<script lang="ts">
import hotkeys from "hotkeys-js";
import { onMount } from "svelte";
import { flip } from "svelte/animate";
import { cubicIn, cubicInOut, cubicOut } from "svelte/easing";
import { blur, crossfade, fly } from "svelte/transition";
import type {
  CommitteePresentationQuery$result,
  RegionalGroupEnum$options,
} from "$houdini";
import Flag from "$lib/components/Flag.svelte";
import type { CommitteeSettings, VotingStage } from "$lib/local-db/localDB";
import { m } from "$lib/paraglide/messages";
import FlagRow from "./FlagRow.svelte";
import ResultChart from "./ResultChart.svelte";

interface Props {
  committeeSettings?: CommitteeSettings;
  committee?: CommitteePresentationQuery$result["findFirstCommittee"];
}
const { committeeSettings, committee }: Props = $props();

const [send, receive] = crossfade({
  duration: 1000,
  easing: cubicInOut,
});

const flipOptions = {
  duration: 500,
  delay: 250,
  easing: cubicInOut,
};

const members = $derived(
  committee?.members.filter(
    (member) => member.present && member.representation?.type === "DELEGATION",
  ),
);

const remainingMembers = $derived(
  members?.filter(
    (member) =>
      [
        ...(committeeSettings?.rollCallVotingPro ?? []),
        ...(committeeSettings?.rollCallVotingCon ?? []),
        ...(committeeSettings?.rollCallVotingAbstain ?? []),
      ].includes(member.id) === false,
  ),
);
const proMembers = $derived(
  members?.filter((member) =>
    committeeSettings?.rollCallVotingPro?.includes(member.id),
  ),
);
const conMembers = $derived(
  members?.filter((member) =>
    committeeSettings?.rollCallVotingCon?.includes(member.id),
  ),
);
const abstainMembers = $derived(
  members?.filter((member) =>
    committeeSettings?.rollCallVotingAbstain?.includes(member.id),
  ),
);
</script>

{#snippet FlagCard(member: NonNullable<typeof members>[number])}
	<div class="card card-bordered bg-base-200 items-center gap-1 p-2 shadow-sm">
		<Flag representation={member.representation} size="sm" />
		<h3 class="font-mono text-lg font-bold uppercase">
			{member.representation?.name || member.representation?.alpha2Code}
		</h3>
	</div>
{/snippet}

{#if committeeSettings && committeeSettings.rollCallVotingActive}
	<div class="modal modal-open">
		<div
			class="modal-box bg-base-200 max-h-11/12 max-w-11/12 relative flex h-full w-full flex-col gap-4"
			in:fly={{ y: 100, duration: 1000, easing: cubicOut }}
			out:fly={{ y: 100, duration: 1000, easing: cubicIn }}
		>
			<h2 class="w-full text-center text-4xl font-bold">
				{committeeSettings.votingVoteName || m.rollCallVoting()}
			</h2>

			<ResultChart
				majorityAmount={committeeSettings.votingMajorityAmount}
				votesAbstain={committeeSettings.rollCallVotingAbstain?.length}
				votesCon={committeeSettings.rollCallVotingCon?.length}
				votesPro={committeeSettings.rollCallVotingPro?.length}
				total={members?.length}
			/>

			<FlagRow faIcon="arrow-right" countValue={remainingMembers?.length}>
				{#each remainingMembers ?? [] as member (member.id)}
					<div
						animate:flip={flipOptions}
						in:receive={{ key: member.id }}
						out:send={{ key: member.id }}
					>
						{@render FlagCard(member)}
					</div>
				{/each}
			</FlagRow>

			<FlagRow color="success" faIcon="circle-plus" countValue={proMembers?.length}>
				{#each proMembers?.toReversed() ?? [] as member (member.id)}
					<div
						animate:flip={flipOptions}
						in:receive={{ key: member.id }}
						out:send={{ key: member.id }}
					>
						{@render FlagCard(member)}
					</div>
				{/each}
			</FlagRow>
			{#if committeeSettings.votingWithAbstentions}
				<FlagRow color="info" faIcon="circle" countValue={abstainMembers?.length}>
					{#each abstainMembers?.toReversed() ?? [] as member (member.id)}
						<div
							animate:flip={flipOptions}
							in:receive={{ key: member.id }}
							out:send={{ key: member.id }}
						>
							{@render FlagCard(member)}
						</div>
					{/each}
				</FlagRow>
			{/if}
			<FlagRow color="error" faIcon="circle-minus" countValue={conMembers?.length}>
				{#each conMembers?.toReversed() ?? [] as member (member.id)}
					<div
						animate:flip={flipOptions}
						in:receive={{ key: member.id }}
						out:send={{ key: member.id }}
					>
						{@render FlagCard(member)}
					</div>
				{/each}
			</FlagRow>
		</div>
	</div>
{/if}
