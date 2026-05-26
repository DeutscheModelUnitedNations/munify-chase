<script lang="ts">
	import type { VotingMajority } from '$lib/local-db/localDB';
	import { m } from '$lib/paraglide/messages';
	import Tabs from '../Tabs.svelte';
	import Combobox from '../Combobox.svelte';
	import votingNameTemplates from '$lib/data/votingNameTemplates';

	interface Props {
		voteType: 'SHOW_OF_HANDS' | 'ROLL_CALL';
		voteName: string;
		majority: VotingMajority;
		withAbstentions: boolean;
		onstart: () => void;
	}

	let {
		voteType = $bindable(),
		voteName = $bindable(),
		majority = $bindable(),
		withAbstentions = $bindable(),
		onstart
	}: Props = $props();

	const voteTypeTabs: {
		id: 'SHOW_OF_HANDS' | 'ROLL_CALL';
		label: string;
		faIcon: string;
	}[] = [
		{ id: 'SHOW_OF_HANDS', label: m.showOfHandsVoting(), faIcon: 'hand-wave' },
		{ id: 'ROLL_CALL', label: m.rollCallVoting(), faIcon: 'list-check' }
	];

	const majorityTabs: {
		id: VotingMajority;
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

	const voteNamePresets = votingNameTemplates.map((preset) => ({
		label: preset
	}));
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
		<Combobox
			bind:value={voteName}
			options={voteNamePresets}
			side="top"
			placeholder={m.voting()}
			getStringValue={({ label }) => label}
			filter={(options, v) =>
				options.filter(({ label }) => label.toLowerCase().includes(v.toLowerCase()))}
		>
			{#snippet ListItem(option)}
				<div class="flex items-center gap-2">
					<i class="fas fa-box-ballot"></i>
					<span>{option.label}</span>
				</div>
			{/snippet}

			{#snippet AdditionalButtons()}
				<button
					class="btn btn-square input-lg join-item"
					aria-label="Clear selection"
					onclick={() => (voteName = '')}
				>
					<i class="fas fa-trash"></i>
				</button>
			{/snippet}
		</Combobox>
		<p class="label whitespace-normal">{m.voteTitleDescription()}</p>
	</fieldset>

	<button class="btn btn-primary w-full" onclick={onstart}>
		<i class="fas fa-box-ballot"></i>
		{m.startVote()}
	</button>
</div>
