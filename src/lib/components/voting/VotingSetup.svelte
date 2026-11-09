<script lang="ts">
	import type { VotingMajority } from './votingModal';
	import { m } from '#lib/paraglide/messages';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import RollCallVotingChair from './RollCallVotingChair.svelte';
	import ShowOfHandsVotingChair from './ShowOfHandsVotingChair.svelte';
	import DeviceBasedVotingChair from './DeviceBasedVotingChair.svelte';
	import VotingSetupForm from './VotingSetupForm.svelte';
	import { resumeVotingConfig, type VoteType, type VotingCommittee } from './votingMath';

	interface Props {
		committee: VotingCommittee;
		activeVotingSession?: {
			id: string;
			mode: string;
			voteName?: string | null;
			majority?: string | null;
			withAbstentions?: boolean | null;
			deviceVotingWindowSeconds?: number | null;
		} | null;
	}

	let { committee, activeVotingSession = null }: Props = $props();

	let voteType: 'SHOW_OF_HANDS' | 'ROLL_CALL' | 'DEVICE_BASED' = $state('SHOW_OF_HANDS');
	let voteName: string = $state('');
	let majority: VotingMajority = $state('SIMPLE');
	let withAbstentions: boolean = $state(false);
	let deviceVotingWindowSeconds: number = $state(20);

	let showOfHandModalOpen: boolean = $state(false);
	let rollCallModalOpen: boolean = $state(false);
	let deviceBasedModalOpen: boolean = $state(false);

	const openModal: Record<VoteType, () => void> = {
		SHOW_OF_HANDS: () => (showOfHandModalOpen = true),
		ROLL_CALL: () => (rollCallModalOpen = true),
		DEVICE_BASED: () => (deviceBasedModalOpen = true)
	};

	function startVote() {
		openModal[voteType]();
	}

	registerCommands(() => [
		{
			id: 'voting.start',
			title: m.startVote,
			group: 'page',
			icon: 'box-arrow-down',
			visible: () => !activeVotingSession,
			run: startVote
		},
		{
			id: 'voting.resume',
			title: m.resumeVote,
			group: 'page',
			icon: 'arrow-clockwise',
			visible: () => !!activeVotingSession,
			run: openResume
		}
	]);

	function openResume() {
		if (!activeVotingSession) return;
		const config = resumeVotingConfig(activeVotingSession);
		voteType = config.voteType;
		voteName = config.voteName;
		majority = config.majority;
		withAbstentions = config.withAbstentions;
		deviceVotingWindowSeconds = config.deviceVotingWindowSeconds;
		startVote();
	}
</script>

{#if activeVotingSession}
	<div class="flex flex-col gap-3" data-tour="voting.resume">
		<div class="alert alert-warning p-2 text-sm">
			<i aria-hidden="true" class="ph-fill ph-warning-circle"></i>
			<span>{m.voteInProgress()}</span>
		</div>
		<button class="btn btn-warning btn-xl" onclick={openResume}>
			<i aria-hidden="true" class="ph-fill ph-arrow-clockwise mr-2"></i>
			{m.resumeVote()}
		</button>
	</div>
{:else}
	<VotingSetupForm
		bind:voteType
		bind:voteName
		bind:majority
		bind:withAbstentions
		bind:deviceVotingWindowSeconds
		tourAnchors
		onstart={startVote}
	/>
{/if}

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

<DeviceBasedVotingChair
	bind:active={deviceBasedModalOpen}
	{committee}
	{voteName}
	{majority}
	{withAbstentions}
	{deviceVotingWindowSeconds}
/>
