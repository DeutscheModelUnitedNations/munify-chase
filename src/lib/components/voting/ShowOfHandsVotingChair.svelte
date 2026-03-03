<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import Kbd from '$lib/components/Kbd.svelte';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import { localDB, type VotingMajority, type VotingStage } from '$lib/local-db/localDB';
	import VoteClicker from './VoteClicker.svelte';
	import ResultChart from './ResultChart.svelte';
	import { calculateMajority } from '$lib/utils/majorities';

	interface Props {
		active: boolean;
		committee?: CommitteeTeamQuery$result['findFirstCommittee'] | null;
		voteName?: string;
		majority: VotingMajority;
		withAbstentions: boolean;
	}

	let { active = $bindable(), voteName, majority, withAbstentions, committee }: Props = $props();

	let currentState = $state<VotingStage>('PRO');

	let votesPro = $state(0);
	let votesCon = $state(0);
	let votesAbstain = $state(0);
	let votesTotal = $derived.by(() => {
		switch (majority) {
			case 'SIMPLE':
			case 'TWO_THIRDS':
				return votesPro + votesCon;
			case 'ABSOLUTE':
				return votesPro + votesCon + votesAbstain;
			default:
				return 0;
		}
	});
	let majorityAmount = $derived.by(() => {
		switch (majority) {
			case 'SIMPLE':
			case 'ABSOLUTE':
				return calculateMajority(votesTotal, 'simple');
			case 'TWO_THIRDS':
				return calculateMajority(votesTotal, 'twoThirds');
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
		hotkeys('enter, esc, backspace', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'enter':
					nextState();
					break;
				case 'esc':
					exit();
					break;
				case 'backspace':
					previousState();
					break;
			}
		});
	});

	$effect(() => {
		if (!committee) return;
		if (active) {
			localDB.committeeSettings.update(committee.id, {
				showOfHandsVotingActive: true,
				showOfHandsVotingStage: currentState,
				showOfHandsVotingVotesPro: votesPro,
				showOfHandsVotingVotesCon: votesCon,
				showOfHandsVotingVotesAbstain: votesAbstain,
				showOfHandsVotingVotesTotal: votesTotal,
				votingVoteName: voteName,
				votingMajority: majority,
				votingWithAbstentions: withAbstentions,
				votingMajorityAmount: majorityAmount
			});
		} else {
			localDB.committeeSettings.update(committee.id, {
				showOfHandsVotingActive: false,
				showOfHandsVotingVotesPro: 0,
				showOfHandsVotingVotesCon: 0,
				showOfHandsVotingVotesAbstain: 0,
				showOfHandsVotingVotesTotal: 0,
				votingVoteName: null,
				votingMajority: null,
				votingWithAbstentions: false,
				votingMajorityAmount: null
			});
		}
	});
</script>

<Modal bind:open={active}>
	<h1 class="mb-2 text-2xl font-bold">{voteName || m.voting()}</h1>
	<h3 class="mb-4 text-lg font-semibold">
		{m.showOfHandsVoting()}
	</h3>

	<ResultChart total={votesTotal} {votesPro} {votesCon} {majorityAmount} />

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
		<button class="btn btn-lg flex gap-2" onclick={previousState} disabled={currentState === 'PRO'}>
			<i class="fas fa-arrow-left"></i>
			{m.back()}
			<Kbd hotkey="backspace" />
		</button>
		<button
			class="btn {currentState === 'EVALUATION' ? 'btn-error' : 'btn-success'} btn-lg flex gap-2"
			onclick={() => {
				nextState();
			}}
		>
			{#if currentState === 'EVALUATION'}
				<i class="fas fa-xmark"></i>
				{m.close()}
			{:else if currentState === 'ABSTAIN' || (!withAbstentions && currentState === 'CON')}
				<i class="fas fa-paper-plane"></i>
				{m.publish()}
			{:else}
				<i class="fas fa-arrow-right"></i>
				{m.forward()}
			{/if}
			<Kbd hotkey="enter" />
		</button>

		<div class="absolute top-3 right-3">
			<button aria-label="Close modal" class="btn btn-ghost btn-circle btn-sm" onclick={exit}>
				<i class="fa-duotone fa-xmark"></i>
			</button>
		</div>
	</div>
</Modal>
