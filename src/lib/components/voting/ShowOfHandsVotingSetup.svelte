<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import Tabs from '../Tabs.svelte';
	import ShowOfHandsVotingChair, { type MajorityType } from './ShowOfHandsVotingChair.svelte';

	interface Props {
		members: CommitteeTeamQuery$result['findFirstCommittee']['members'];
	}

	let { members }: Props = $props();

	let voteName: string = $state('');
	let majority: MajorityType = $state('SIMPLE');
	let withAbstentions: boolean = $state(false);

	let modalOpen: boolean = $state(false);

	const majorityTabs: {
		id: MajorityType;
		label: string;
	}[] = [
		{ id: 'SIMPLE', label: m.simpleMajority() },
		{ id: 'ABSOLUTE', label: m.absoluteMajority() },
		{ id: 'TWO_THIRDS', label: m.twoThirdsMajority() }
	];

	const withAbstentionsTabs = [
		{ id: false, label: m.withoutAbstentions() },
		{ id: true, label: m.withAbstentions() }
	];
</script>

<div class="flex flex-col gap-2">
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
		<legend class="fieldset-legend">{m.voteTitel()}</legend>
		<input type="text" class="input w-full" placeholder={m.voting()} bind:value={voteName} />
		<p class="label whitespace-normal">{m.voteTitleDescription()}</p>
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

	<button class="btn btn-primary w-full" onclick={() => (modalOpen = true)}>
		<i class="fas fa-box-ballot"></i>
		{m.startVote()}
	</button>
</div>

<ShowOfHandsVotingChair bind:active={modalOpen} {members} {voteName} {majority} {withAbstentions} />
