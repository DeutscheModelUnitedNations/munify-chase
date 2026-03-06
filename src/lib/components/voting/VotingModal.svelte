<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import type { VotingMajority } from '$lib/local-db/localDB';
	import { m } from '$lib/paraglide/messages';
	import { onDestroy, onMount } from 'svelte';
	import hotkeys from 'hotkeys-js';
	import Modal from '../Modal.svelte';
	import VotingSetupForm from './VotingSetupForm.svelte';
	import ShowOfHandsVotingChair from './ShowOfHandsVotingChair.svelte';
	import RollCallVotingChair from './RollCallVotingChair.svelte';
	import { votingModalStore, closeVotingModal, type VotingResult } from './votingModal';

	interface Props {
		committee: CommitteeTeamQuery$result['findFirstCommittee'];
	}

	let { committee }: Props = $props();

	let phase = $state<'SETUP' | 'EXECUTING'>('SETUP');
	let setupOpen = $state(false);
	let executingOpen = $state(false);

	let voteType = $state<'SHOW_OF_HANDS' | 'ROLL_CALL'>('SHOW_OF_HANDS');
	let voteName = $state('');
	let majority = $state<VotingMajority>('SIMPLE');
	let withAbstentions = $state(false);

	let currentOnComplete: ((result: VotingResult) => void) | undefined = $state(undefined);

	votingModalStore.subscribe((state) => {
		if (state) {
			voteType = state.config.voteType ?? 'SHOW_OF_HANDS';
			voteName = state.config.voteName ?? '';
			majority = state.config.majority ?? 'SIMPLE';
			withAbstentions = state.config.withAbstentions ?? false;
			currentOnComplete = state.onComplete;
			phase = 'SETUP';
			setupOpen = true;
			executingOpen = false;
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

	const toggleModal = () => {
		if (setupOpen || executingOpen) {
			closeVotingModal();
		} else {
			phase = 'SETUP';
			setupOpen = true;
			voteType = 'SHOW_OF_HANDS';
			voteName = '';
			majority = 'SIMPLE';
			withAbstentions = false;
			currentOnComplete = undefined;
		}
	};

	const startVote = () => {
		setupOpen = false;
		phase = 'EXECUTING';
		executingOpen = true;
	};

	onMount(() => {
		hotkeys('alt+v', (event) => {
			event.preventDefault();
			toggleModal();
		});
	});

	onDestroy(() => {
		hotkeys.unbind('alt+v');
	});
</script>

{#if setupOpen}
	<Modal bind:open={setupOpen}>
		<h1 class="mb-4 text-2xl font-bold">{m.voting()}</h1>
		<VotingSetupForm
			bind:voteType
			bind:voteName
			bind:majority
			bind:withAbstentions
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
	{:else}
		<RollCallVotingChair
			bind:active={executingOpen}
			{committee}
			{voteName}
			{majority}
			{withAbstentions}
			oncomplete={handleComplete}
		/>
	{/if}
{/if}
