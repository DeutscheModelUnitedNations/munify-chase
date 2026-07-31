<script lang="ts">
	import type { VotingMajority } from './votingModal';
	import { m } from '$lib/paraglide/messages';
	import RollCallVotingChair from './RollCallVotingChair.svelte';
	import ShowOfHandsVotingChair from './ShowOfHandsVotingChair.svelte';
	import DeviceBasedVotingChair from './DeviceBasedVotingChair.svelte';
	import VotingSetupForm from './VotingSetupForm.svelte';

	interface Props {
		committee: {
			id: string;
			totalPresent: number;
			simpleMajority: number;
			twoThirdsMajority: number;
			members: Array<{
				id: string;
				present: boolean;
				representation?: {
					name?: string | null;
					alpha2Code?: string | null;
					alpha3Code?: string | null;
					faIcon?: string | null;
					type?: string | null;
				} | null;
			}>;
		};
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

	function openResume() {
		if (!activeVotingSession) return;
		const mode = activeVotingSession.mode as 'SHOW_OF_HANDS' | 'ROLL_CALL' | 'DEVICE_BASED';
		voteType = mode;
		voteName = activeVotingSession.voteName ?? '';
		majority = (activeVotingSession.majority ?? 'SIMPLE') as VotingMajority;
		withAbstentions = activeVotingSession.withAbstentions ?? false;
		deviceVotingWindowSeconds = activeVotingSession.deviceVotingWindowSeconds ?? 20;
		if (mode === 'SHOW_OF_HANDS') {
			showOfHandModalOpen = true;
		} else if (mode === 'ROLL_CALL') {
			rollCallModalOpen = true;
		} else {
			deviceBasedModalOpen = true;
		}
	}
</script>

{#if activeVotingSession}
	<div class="flex flex-col gap-3">
		<div class="alert alert-warning p-2 text-sm">
			<i class="fas fa-circle-exclamation"></i>
			<span>{m.voteInProgress()}</span>
		</div>
		<button class="btn btn-warning btn-xl" onclick={openResume}>
			<i class="fas fa-rotate-right mr-2"></i>
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
		onstart={() => {
			if (voteType === 'SHOW_OF_HANDS') {
				showOfHandModalOpen = true;
			} else if (voteType === 'ROLL_CALL') {
				rollCallModalOpen = true;
			} else {
				deviceBasedModalOpen = true;
			}
		}}
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
