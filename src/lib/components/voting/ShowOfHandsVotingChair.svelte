<script lang="ts">
	import Kbd from '#lib/components/Kbd.svelte';
	import { m } from '#lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import { untrack } from 'svelte';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { type VotingMajority, type VotingStage } from './votingModal';
	import VoteClicker from './VoteClicker.svelte';
	import ResultChart from './ResultChart.svelte';
	import CloseCornerButton from './CloseCornerButton.svelte';
	import HandsCountProgress from './HandsCountProgress.svelte';
	import { completeVotingSession } from './votingSession';
	import {
		finishVote,
		handsCountState,
		handsProgress,
		nextShowOfHandsStage,
		previousShowOfHandsStage,
		resumedShowOfHands,
		showOfHandsForwardAction,
		showOfHandsMajority,
		showOfHandsTotal
	} from './votingMath';
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

	let votesTotal = $derived(
		showOfHandsTotal({ majority, pro: votesPro, con: votesCon, abstain: votesAbstain })
	);
	let majorityAmount = $derived(showOfHandsMajority({ majority, total: votesTotal }));
	let presentDelegations = $derived(committee?.totalPresent ?? 0);
	let votesCast = $derived(votesPro + votesCon + votesAbstain);
	let votesProgress = $derived(handsProgress({ votesCast, presentDelegations }));
	let countState = $derived(handsCountState({ votesCast, votesTotal, presentDelegations }));
	let forwardAction = $derived(showOfHandsForwardAction({ stage: currentState, withAbstentions }));

	const syncToServer = () => {
		if (!sessionId) return;
		// Select the stage/tally fields we write so they actually land in the cache:
		// graphcache only persists an optimistic mutation's selected fields, so a bare
		// `{ id }` selection would leave the presentation popup frozen on PRO with zeroed
		// tallies offline (no network round-trip to fill them).
		client.mutate
			.updateVotingSession({
				__args: { id: sessionId, currentStage: currentState, votesPro, votesCon, votesAbstain },
				id: true,
				currentStage: true,
				votesPro: true,
				votesCon: true,
				votesAbstain: true
			})
			.catch(() => {});
	};

	const reset = () => {
		votesPro = 0;
		votesCon = 0;
		votesAbstain = 0;
		currentState = 'PRO';
	};

	const closeSession = (outcome: 'ADOPTED' | 'REJECTED' | null) => {
		completeVotingSession({ id: sessionId, outcome });
		sessionId = null;
	};

	const exit = (completed: boolean = false) => {
		const { outcome, result } = finishVote({
			completed,
			majorityAmount,
			votesFor: votesPro,
			votesAgainst: votesCon,
			votesAbstain
		});
		closeSession(outcome);
		oncomplete?.(result);
		reset();
		active = false;
	};

	const nextState = () => {
		const next = nextShowOfHandsStage({ stage: currentState, withAbstentions });
		if (next === 'DONE') {
			exit(true);
			return;
		}
		currentState = next;
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
		currentState = previousShowOfHandsStage({ stage: currentState, withAbstentions });
		syncToServer();
	};

	const hotkeyActions: Record<string, () => void> = {
		enter: nextState,
		esc: () => exit(),
		backspace: previousState,
		up: () => adjustCurrentVote(1),
		space: () => adjustCurrentVote(1),
		down: () => adjustCurrentVote(-1)
	};

	const startSession = () => {
		if (!committee) return;
		// Mint the session id client-side and adopt it synchronously so the chair can
		// drive (and later complete) the vote without waiting for a server response —
		// offline the mutation promise never resolves, so relying on `.then()` to set
		// `sessionId` would leave every follow-up mutation a no-op. Passing the id
		// through also keeps the optimistic entity key identical in the chair and the
		// presentation popup (same broadcast variables), so the committee's
		// activeVotingSession FK resolves to one shared row. Mirrors the roll-call chair.
		const id = nanoid();
		sessionId = id;
		client.mutate
			.startVotingSession({
				__args: {
					id,
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
					completeVotingSession({ id: result.id });
					return;
				}
				// Server may resume an existing session under a different id; adopt it.
				sessionId = result.id;
				const resumed = resumedShowOfHands(result);
				if (resumed.stage) currentState = resumed.stage;
				votesPro = resumed.pro;
				votesCon = resumed.con;
				votesAbstain = resumed.abstain;
			})
			.catch(() => {});
	};

	$effect(() => {
		if (active) {
			(document.activeElement as HTMLElement | null)?.blur();
			hotkeys('enter, esc, backspace, up, down, space', 'showOfHandsVote', (event, handler) => {
				event.preventDefault();
				hotkeyActions[handler.key]?.();
			});
			hotkeys.setScope('showOfHandsVote');

			untrack(startSession);

			return () => {
				hotkeys.deleteScope('showOfHandsVote');
			};
		} else {
			untrack(() => {
				closeSession(null);
				reset();
			});
		}
	});
</script>

{#snippet stageCard({
	stage,
	label,
	activeClasses,
	idleClasses
}: {
	stage: VotingStage;
	label: string;
	activeClasses: string;
	idleClasses: string;
})}
	<div
		class="{currentState === stage
			? activeClasses
			: idleClasses} card border-base-100 mb-4 w-full items-center justify-center gap-4 border-3 p-4 shadow-sm"
	>
		<h3 class="text-lg font-bold">{label}</h3>
		{#if stage === 'PRO'}
			<VoteClicker active={currentState === stage} bind:value={votesPro} />
		{:else if stage === 'CON'}
			<VoteClicker active={currentState === stage} bind:value={votesCon} />
		{:else}
			<VoteClicker active={currentState === stage} bind:value={votesAbstain} />
		{/if}
	</div>
{/snippet}

<Modal bind:open={active} closeOnEsc={false}>
	<h1 class="mb-2 text-2xl font-bold">{voteName || m.voting()}</h1>
	<h3 class="mb-4 text-lg font-semibold">
		{m.showOfHandsVoting()}
	</h3>

	<ResultChart total={votesTotal} {votesPro} {votesCon} {majorityAmount} />

	{#if presentDelegations > 0}
		<HandsCountProgress {countState} {votesCast} {votesProgress} {presentDelegations} />
	{/if}

	<div class="mt-6 flex gap-4">
		{@render stageCard({
			stage: 'PRO',
			label: m.pro(),
			activeClasses: 'bg-success text-success-content border-black',
			idleClasses: 'bg-success/20'
		})}
		{@render stageCard({
			stage: 'CON',
			label: m.con(),
			activeClasses: 'bg-error text-error-content border-black',
			idleClasses: 'bg-error/20'
		})}
		{#if withAbstentions}
			{@render stageCard({
				stage: 'ABSTAIN',
				label: m.abstain(),
				activeClasses: 'bg-info text-info-content border-black',
				idleClasses: 'bg-info/20'
			})}
		{/if}
	</div>

	<div class="modal-action justify-around">
		<button class="btn btn-lg flex gap-2" onclick={previousState} disabled={currentState === 'PRO'}>
			<i aria-hidden="true" class="ph-fill ph-arrow-left"></i>
			{m.back()}
			<Kbd hotkey="backspace" />
		</button>
		<button
			class="btn {forwardAction === 'close' ? 'btn-error' : 'btn-success'} btn-lg flex gap-2"
			onclick={nextState}
		>
			{#if forwardAction === 'close'}
				<i aria-hidden="true" class="ph-fill ph-x"></i>
				{m.close()}
			{:else if forwardAction === 'publish'}
				<i aria-hidden="true" class="ph-fill ph-paper-plane-tilt"></i>
				{m.publish()}
			{:else}
				<i aria-hidden="true" class="ph-fill ph-arrow-right"></i>
				{m.forward()}
			{/if}
			<Kbd hotkey="enter" />
		</button>

		<CloseCornerButton onclick={() => exit()} />
	</div>
</Modal>
