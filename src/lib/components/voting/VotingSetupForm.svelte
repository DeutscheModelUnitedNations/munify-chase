<script lang="ts">
	import type { VotingMajority } from './votingModal';
	import { m } from '$lib/paraglide/messages';
	import Tabs from '../Tabs.svelte';
	import Combobox from '../Combobox.svelte';
	import votingNameTemplates from '$lib/data/votingNameTemplates';
	import { isLocalConferenceActive } from '$lib/state/localDemo.svelte';

	interface Props {
		voteType: 'SHOW_OF_HANDS' | 'ROLL_CALL' | 'DEVICE_BASED';
		voteName: string;
		majority: VotingMajority;
		withAbstentions: boolean;
		deviceVotingWindowSeconds: number;
		onstart: () => void;
	}

	let {
		voteType = $bindable(),
		voteName = $bindable(),
		majority = $bindable(),
		withAbstentions = $bindable(),
		deviceVotingWindowSeconds = $bindable(),
		onstart
	}: Props = $props();

	// Device-based voting has each participant vote from their own device — meaningless in
	// the offline demo, where there's only ever the one device in front of the chair.
	const voteTypeTabs: {
		id: 'SHOW_OF_HANDS' | 'ROLL_CALL' | 'DEVICE_BASED';
		label: string;
		faIcon: string;
	}[] = $derived(
		[
			{ id: 'SHOW_OF_HANDS' as const, label: m.showOfHandsVoting(), faIcon: 'hand-wave' },
			{ id: 'ROLL_CALL' as const, label: m.rollCallVoting(), faIcon: 'list-check' },
			{ id: 'DEVICE_BASED' as const, label: m.deviceBasedVoting(), faIcon: 'mobile' }
		].filter((tab) => tab.id !== 'DEVICE_BASED' || !isLocalConferenceActive())
	);

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
	{#if voteType === 'DEVICE_BASED'}
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
			<legend class="fieldset-legend">{m.deviceVotingWindowSeconds()}</legend>
			<input
				type="number"
				min="5"
				max="300"
				class="input w-full"
				bind:value={deviceVotingWindowSeconds}
			/>
			<p class="label whitespace-normal">{m.deviceVotingWindowSecondsDescription()}</p>
		</fieldset>
	{/if}
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
