<script lang="ts">
	import { type VotingMajority } from './votingModal';
	import { m } from '#lib/paraglide/messages';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import Modal from '../Modal.svelte';
	import VotingSetupForm from './VotingSetupForm.svelte';
	import ShowOfHandsVotingChair from './ShowOfHandsVotingChair.svelte';
	import RollCallVotingChair from './RollCallVotingChair.svelte';
	import DeviceBasedVotingChair from './DeviceBasedVotingChair.svelte';
	import {
		votingModalStore,
		closeVotingModal,
		type VotingConfig,
		type VotingResult
	} from './votingModal';
	import { votingConfigWithDefaults, type VotingCommittee } from './votingMath';

	interface Props {
		committee: VotingCommittee & {
			status: string;
			statusHeadline: string;
			statusUntil: Date;
		};
	}

	let { committee }: Props = $props();

	let phase = $state<'SETUP' | 'EXECUTING'>('SETUP');
	let setupOpen = $state(false);
	let executingOpen = $state(false);

	let voteType = $state<'SHOW_OF_HANDS' | 'ROLL_CALL' | 'DEVICE_BASED'>('SHOW_OF_HANDS');
	let voteName = $state('');
	let majority = $state<VotingMajority>('SIMPLE');
	let withAbstentions = $state(false);
	let deviceVotingWindowSeconds = $state(20);

	let currentOnComplete: ((result: VotingResult) => void) | undefined = $state(undefined);

	const applyConfig = (config: VotingConfig) => {
		const filled = votingConfigWithDefaults(config);
		voteType = filled.voteType;
		voteName = filled.voteName;
		majority = filled.majority;
		withAbstentions = filled.withAbstentions;
		deviceVotingWindowSeconds = filled.deviceVotingWindowSeconds;
	};

	votingModalStore.subscribe((state) => {
		if (state) {
			applyConfig(state.config);
			currentOnComplete = state.onComplete;
			const resume = !!state.resume;
			phase = resume ? 'EXECUTING' : 'SETUP';
			setupOpen = !resume;
			executingOpen = resume;
		} else {
			setupOpen = false;
			executingOpen = false;
			currentOnComplete = undefined;
		}
	});

	const handleComplete = (result: VotingResult) => {
		executingOpen = false;
		if (currentOnComplete) {
			const cb = currentOnComplete;
			currentOnComplete = undefined;
			votingModalStore.set(null);
			cb(result);
		} else {
			votingModalStore.set(null);
		}
	};

	// A quick vote (Alt+V) opens without an entry in votingModalStore, so clearing the store
	// alone would not notify anyone. Close locally and let a waiting caller know as well.
	const close = () => {
		setupOpen = false;
		executingOpen = false;
		closeVotingModal();
	};

	const toggleModal = () => {
		if (setupOpen || executingOpen) {
			close();
		} else {
			phase = 'SETUP';
			setupOpen = true;
			applyConfig({});
			currentOnComplete = undefined;
		}
	};

	const startVote = () => {
		setupOpen = false;
		phase = 'EXECUTING';
		executingOpen = true;
	};

	registerCommands(() => [
		{
			id: 'chair.quick-vote',
			title: m.commandQuickVote,
			group: 'page',
			icon: 'box-arrow-down',
			shortcut: 'alt+v',
			run: toggleModal
		}
	]);
</script>

{#if setupOpen}
	<Modal bind:open={setupOpen}>
		<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" onclick={close}>✕</button
		>
		<h1 class="mb-4 text-2xl font-bold">{m.voting()}</h1>
		<VotingSetupForm
			bind:voteType
			bind:voteName
			bind:majority
			bind:withAbstentions
			bind:deviceVotingWindowSeconds
			onstart={startVote}
		/>
	</Modal>
{/if}

{#if phase === 'EXECUTING' && executingOpen}
	{#if voteType === 'SHOW_OF_HANDS'}
		<ShowOfHandsVotingChair
			bind:active={executingOpen}
			{committee}
			{voteName}
			{majority}
			{withAbstentions}
			oncomplete={handleComplete}
		/>
	{:else if voteType === 'ROLL_CALL'}
		<RollCallVotingChair
			bind:active={executingOpen}
			{committee}
			{voteName}
			{majority}
			{withAbstentions}
			oncomplete={handleComplete}
		/>
	{:else}
		<DeviceBasedVotingChair
			bind:active={executingOpen}
			{committee}
			{voteName}
			{majority}
			{withAbstentions}
			{deviceVotingWindowSeconds}
			oncomplete={handleComplete}
		/>
	{/if}
{/if}
