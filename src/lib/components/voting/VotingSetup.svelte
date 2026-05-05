<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import type { VotingMajority } from '$lib/local-db/localDB';
	import RollCallVotingChair from './RollCallVotingChair.svelte';
	import ShowOfHandsVotingChair from './ShowOfHandsVotingChair.svelte';
	import VotingSetupForm from './VotingSetupForm.svelte';

	interface Props {
		committee: CommitteeTeamQuery$result['findFirstCommittee'];
	}

	let { committee }: Props = $props();

	let voteType: 'SHOW_OF_HANDS' | 'ROLL_CALL' = $state('SHOW_OF_HANDS');
	let voteName: string = $state('');
	let majority: VotingMajority = $state('SIMPLE');
	let withAbstentions: boolean = $state(false);

	let showOfHandModalOpen: boolean = $state(false);
	let rollCallModalOpen: boolean = $state(false);
</script>

<VotingSetupForm
	bind:voteType
	bind:voteName
	bind:majority
	bind:withAbstentions
	onstart={() => {
		if (voteType === 'SHOW_OF_HANDS') {
			showOfHandModalOpen = true;
		} else if (voteType === 'ROLL_CALL') {
			rollCallModalOpen = true;
		}
	}}
/>

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
