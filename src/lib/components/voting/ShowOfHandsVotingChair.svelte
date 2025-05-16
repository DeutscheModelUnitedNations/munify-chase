<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import { localDB, type VotingStage } from '$lib/local-db/localDB';
	import VoteClicker from './VoteClicker.svelte';
	import ResultChart from './ResultChart.svelte';

	export type MajorityType = 'SIMPLE' | 'TWO_THIRDS';

	interface Props {
		active: boolean;
		committee?: CommitteeTeamQuery$result['findFirstCommittee'] | null;
		voteName?: string;
		majority: MajorityType;
		withAbstentions: boolean;
	}

	let { active = $bindable(), voteName, majority, withAbstentions, committee }: Props = $props();

	let currentState = $state<VotingStage>('PRO');

	let votesPro = $state(0);
	let votesCon = $state(0);
	let votesAbstain = $state(0);
	let votesOutstanding = $derived(
		committee?.totalPresent ?? 0 - (votesPro + votesCon + votesAbstain)
	);
	let majorityAmount = $derived.by(() => {
		switch (majority) {
			case 'SIMPLE':
				return committee?.simpleMajority ?? 0;
			case 'TWO_THIRDS':
				return committee?.twoThirdsMajority ?? 0;
			default:
				return 0;
		}
	});

	const exit = () => {
		votesPro = 0;
		votesCon = 0;
		votesAbstain = 0;
		currentState = 'PRO';
		active = false;
	};

	const nextState = () => {
		switch (currentState) {
			case 'PRO':
				currentState = 'CON';
				break;
			case 'CON':
				if (withAbstentions) {
					currentState = 'ABSTAIN';
				} else {
					currentState = 'EVALUATION';
				}
				break;
			case 'ABSTAIN':
				currentState = 'EVALUATION';
				break;
			case 'EVALUATION':
				exit();
				break;
		}
	};

	const previousState = () => {
		switch (currentState) {
			case 'CON':
				currentState = 'PRO';
				break;
			case 'ABSTAIN':
				currentState = 'CON';
				break;
			case 'EVALUATION':
				if (withAbstentions) {
					currentState = 'ABSTAIN';
				} else {
					currentState = 'CON';
				}
				break;
		}
	};

	onMount(() => {
		hotkeys('enter, esc', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'enter':
					nextState();
					break;
				case 'esc':
					exit();
			}
		});
	});

	$effect(() => {
		if (!committee) return;
		if (active) {
			localDB.committeeSettings.update(committee.id, {
				showOfHandsVotingActive: true,
				showOfHandsVotingVoteName: voteName,
				showOfHandsVotingStage: currentState,
				showOfHandsVotingMajority: majority,
				showOfHandsVotingWithAbstentions: withAbstentions,
				showOfHandsVotingVotesPro: votesPro,
				showOfHandsVotingVotesCon: votesCon,
				showOfHandsVotingVotesAbstain: votesAbstain,
				showOfHandsVotingVotesTotal: votesOutstanding,
				showOfHandsVotingMajorityAmount: majorityAmount
			});
		} else {
			localDB.committeeSettings.update(committee.id, {
				showOfHandsVotingActive: false,
				showOfHandsVotingVoteName: null,
				showOfHandsVotingMajority: null,
				showOfHandsVotingWithAbstentions: false,
				showOfHandsVotingVotesPro: 0,
				showOfHandsVotingVotesCon: 0,
				showOfHandsVotingVotesAbstain: 0,
				showOfHandsVotingVotesTotal: 0,
				showOfHandsVotingMajorityAmount: null
			});
		}
	});
</script>

<Modal bind:open={active}>
	<h1 class="mb-2 text-2xl font-bold">{voteName || m.voting()}</h1>
	<h3 class="mb-4 text-lg font-semibold">
		{m.showOfHandsVoting()}
	</h3>

	<ResultChart
		total={committee?.totalPresent}
		{votesPro}
		{votesCon}
		{votesAbstain}
		{majorityAmount}
	/>

	<div class="mt-6 flex gap-4">
		<div
			class="{currentState === 'PRO'
				? 'bg-success text-success-content border-black'
				: 'bg-success/20'} card border-base-100 mb-4 w-full items-center justify-center gap-4 border-3 p-4 shadow-sm"
		>
			<h3 class="text-lg font-bold">{m.pro()}</h3>
			<VoteClicker active={currentState === 'PRO'} bind:value={votesPro} />
		</div>
		<div
			class="{currentState === 'CON'
				? 'bg-error text-error-content border-black'
				: 'bg-error/20'} card border-base-100 mb-4 w-full items-center justify-center gap-4 border-3 p-4 shadow-sm"
		>
			<h3 class="text-lg font-bold">{m.con()}</h3>
			<VoteClicker active={currentState === 'CON'} bind:value={votesCon} />
		</div>
		{#if withAbstentions}
			<div
				class="{currentState === 'ABSTAIN'
					? 'bg-info text-info-content border-black'
					: 'bg-info/20'} card border-base-100 mb-4 w-full items-center justify-center gap-4 border-3 p-4 shadow-sm"
			>
				<h3 class="text-lg font-bold">{m.abstain()}</h3>
				<VoteClicker active={currentState === 'ABSTAIN'} bind:value={votesAbstain} />
			</div>
		{/if}
	</div>

	<div class="modal-action justify-around">
		<button
			class="btn btn-error btn-lg flex gap-2"
			onclick={previousState}
			disabled={currentState === 'PRO'}
		>
			<i class="fas fa-arrow-left"></i>
			{m.back()}
		</button>
		<button
			class="btn btn-success btn-lg flex gap-2"
			onclick={() => {
				nextState();
			}}
		>
			<i class="fas fa-arrow-right"></i>
			{m.forward()}
			<kbd class="kbd">↵</kbd>
		</button>

		<div class="absolute top-3 right-3">
			<button aria-label="Close modal" class="btn btn-ghost btn-circle btn-sm" onclick={exit}>
				<i class="fa-duotone fa-xmark"></i>
			</button>
		</div>
	</div>
</Modal>
