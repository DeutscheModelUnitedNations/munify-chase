<script lang="ts">
import type { CommitteeTeamQuery$result } from "$houdini";
import type { VotingMajority } from "$lib/local-db/localDB";
import { m } from "$lib/paraglide/messages";
import Tabs from "../Tabs.svelte";
import RollCallVotingChair from "./RollCallVotingChair.svelte";
import ShowOfHandsVotingChair from "./ShowOfHandsVotingChair.svelte";

interface Props {
  committee: CommitteeTeamQuery$result["findFirstCommittee"];
}

const { committee }: Props = $props();

const voteType: "SHOW_OF_HANDS" | "ROLL_CALL" = $state("SHOW_OF_HANDS");
const voteName: string = $state("");
const majority: VotingMajority = $state("SIMPLE");
const withAbstentions: boolean = $state(false);

const showOfHandModalOpen: boolean = $state(false);
const rollCallModalOpen: boolean = $state(false);

const voteTypeTabs: {
  id: "SHOW_OF_HANDS" | "ROLL_CALL";
  label: string;
  faIcon: string;
}[] = [
  { id: "SHOW_OF_HANDS", label: m.showOfHandsVoting(), faIcon: "hand-wave" },
  { id: "ROLL_CALL", label: m.rollCallVoting(), faIcon: "list-check" },
];

const majorityTabs: {
  id: VotingMajority;
  label: string;
}[] = [
  { id: "SIMPLE", label: m.simpleMajority() },
  { id: "TWO_THIRDS", label: m.twoThirdsMajority() },
];

const withAbstentionsTabs = [
  { id: false, label: m.withoutAbstentions() },
  { id: true, label: m.withAbstentions() },
];
</script>

<div class="flex flex-col gap-2">
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
		<legend class="fieldset-legend">{m.typeOfVoting()}</legend>
		<Tabs activeTab={voteType} tabs={voteTypeTabs} onTabChange={(tab) => (voteType = tab)} />
	</fieldset>
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
		<legend class="fieldset-legend">{m.majoritySettings()}</legend>
		<p class="label whitespace-normal">{m.majoritySettingsDescriptions()}</p>
		<Tabs activeTab={majority} tabs={majorityTabs} onTabChange={(tab) => (majority = tab)} />
		<Tabs
			activeTab={withAbstentions}
			tabs={withAbstentionsTabs}
			onTabChange={(tab) => (withAbstentions = tab)}
		/>
	</fieldset>
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
		<legend class="fieldset-legend">{m.voteTitel()}</legend>
		<input type="text" class="input w-full" placeholder={m.voting()} bind:value={voteName} />
		<p class="label whitespace-normal">{m.voteTitleDescription()}</p>
	</fieldset>

	<button
		class="btn btn-primary w-full"
		onclick={() => {
			if (voteType === 'SHOW_OF_HANDS') {
				showOfHandModalOpen = true;
			} else if (voteType === 'ROLL_CALL') {
				rollCallModalOpen = true;
			}
		}}
	>
		<i class="fas fa-box-ballot"></i>
		{m.startVote()}
	</button>
</div>

<ShowOfHandsVotingChair
	bind:active={showOfHandModalOpen}
	{committee}
	{voteName}
	{majority}
	{withAbstentions}
/>

<RollCallVotingChair
	bind:active={rollCallModalOpen}
	{committee}
	{voteName}
	{majority}
	{withAbstentions}
/>
