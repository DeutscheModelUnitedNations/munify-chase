<script lang="ts">
	import Kbd from '$lib/components/Kbd.svelte';
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import { untrack } from 'svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { type VotingMajority, type VotingStage } from '$lib/local-db/localDB';
	import VoteClicker from './VoteClicker.svelte';
	import ResultChart from './ResultChart.svelte';
	import { calculateMajority } from '$lib/utils/majorities';
	import type { VotingResult } from './votingModal';

	interface Props {
		active: boolean;
		committee?: {
			id: string;
			totalPresent: number;
			simpleMajority: number;
			twoThirdsMajority: number;
		} | null;
		voteName?: string;
		majority: VotingMajority;
		withAbstentions: boolean;
		oncomplete?: (result: VotingResult) => void;
	}

	let {
		active = $bindable(),
		voteName,
		majority,
		withAbstentions,
		committee,
		oncomplete
	}: Props = $props();

	let currentState = $state<VotingStage>('PRO');
	let votesPro = $state(0);
	let votesCon = $state(0);
	let votesAbstain = $state(0);
	let sessionId = $state<string | null>(null);

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
	let presentDelegations = $derived(committee?.totalPresent ?? 0);
	let votesCast = $derived(votesPro + votesCon + votesAbstain);
	let votesProgress = $derived(
		presentDelegations > 0 ? Math.min((votesCast / presentDelegations) * 100, 100) : 0
	);
	let votesOvershot = $derived(presentDelegations > 0 && votesCast > presentDelegations);

	const syncToServer = () => {
		if (!sessionId) return;
		client.mutate
			.updateVotingSession({
				__args: { id: sessionId, currentStage: currentState, votesPro, votesCon, votesAbstain },
				id: true
			})
			.catch(() => {});
	};

	const exit = (completed: boolean = false) => {
		const outcome: 'ADOPTED' | 'REJECTED' | null = completed
			? votesPro >= majorityAmount
				? 'ADOPTED'
				: 'REJECTED'
			: null;

		if (sessionId) {
			const id = sessionId;
			sessionId = null;
			client.mutate.completeVotingSession({ __args: { id, outcome } }).catch(() => {});
		}

		if (oncomplete) {
			if (completed) {
				oncomplete({
					outcome: outcome!,
					votesFor: votesPro,
					votesAgainst: votesCon,
					votesAbstain: votesAbstain,
					cancelled: false
				});
			} else {
				oncomplete({ votesFor: 0, votesAgainst: 0, votesAbstain: 0, cancelled: true });
			}
		}
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
				exit(true);
				return;
		}
		syncToServer();
	};

	const adjustCurrentVote = (delta: number) => {
		switch (currentState) {
			case 'PRO':
				votesPro = Math.max(0, votesPro + delta);
				break;
			case 'CON':
				votesCon = Math.max(0, votesCon + delta);
				break;
			case 'ABSTAIN':
				votesAbstain = Math.max(0, votesAbstain + delta);
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
		syncToServer();
	};

	$effect(() => {
		if (active) {
			(document.activeElement as HTMLElement | null)?.blur();
			hotkeys('enter, esc, backspace, up, down, space', 'showOfHandsVote', (event, handler) => {
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
					case 'up':
					case 'space':
						adjustCurrentVote(1);
						break;
					case 'down':
						adjustCurrentVote(-1);
						break;
				}
			});
			hotkeys.setScope('showOfHandsVote');

			untrack(() => {
				if (!committee) return;
				client.mutate
					.startVotingSession({
						__args: {
							committeeId: committee.id,
							mode: 'SHOW_OF_HANDS',
							majority,
							majorityAmount: 0,
							withAbstentions,
							voteName: voteName ?? null,
							currentStage: 'PRO'
						},
						id: true,
						currentStage: true,
						votesPro: true,
						votesCon: true,
						votesAbstain: true
					})
					.then((result) => {
						if (!active) {
							client.mutate
								.completeVotingSession({ __args: { id: result.id, outcome: null } })
								.catch(() => {});
							return;
						}
						sessionId = result.id;
						if (result.currentStage) currentState = result.currentStage as VotingStage;
						votesPro = result.votesPro ?? 0;
						votesCon = result.votesCon ?? 0;
						votesAbstain = result.votesAbstain ?? 0;
					})
					.catch(() => {});
			});

			return () => {
				hotkeys.deleteScope('showOfHandsVote');
			};
		} else {
			untrack(() => {
				if (sessionId) {
					const id = sessionId;
					sessionId = null;
					client.mutate.completeVotingSession({ __args: { id, outcome: null } }).catch(() => {});
				}
				votesPro = 0;
				votesCon = 0;
				votesAbstain = 0;
				currentState = 'PRO';
			});
		}
	});
</script>

<Modal bind:open={active} closeOnEsc={false}>
	<h1 class="mb-2 text-2xl font-bold">{voteName || m.voting()}</h1>
	<h3 class="mb-4 text-lg font-semibold">
		{m.showOfHandsVoting()}
	</h3>

	<ResultChart total={votesTotal} {votesPro} {votesCon} {majorityAmount} />

	{#if presentDelegations > 0}
		<div class="mt-3 flex flex-col gap-1">
			<progress
				class="progress w-full {votesOvershot
					? 'progress-error'
					: votesTotal === presentDelegations
						? 'progress-success'
						: 'progress-warning'}"
				value={votesProgress}
				max="100"
			></progress>
			<div class="flex justify-between text-sm">
				<span class={votesOvershot ? 'text-error font-semibold' : 'text-base-content/60'}>
					{votesCast} / {presentDelegations}
				</span>
				{#if votesOvershot}
					<span class="text-error font-semibold">
						<i class="fas fa-triangle-exclamation"></i>
						+{votesCast - presentDelegations}
						{m.over()}
					</span>
				{:else if votesTotal === presentDelegations}
					<span class="text-success font-semibold">
						<i class="fas fa-circle-check"></i>
						{m.matching()}
					</span>
				{/if}
			</div>
		</div>
	{/if}

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
			<button
				aria-label="Close modal"
				class="btn btn-ghost btn-circle btn-sm"
				onclick={() => exit()}
			>
				<i class="fa-duotone fa-xmark"></i>
			</button>
		</div>
	</div>
</Modal>
