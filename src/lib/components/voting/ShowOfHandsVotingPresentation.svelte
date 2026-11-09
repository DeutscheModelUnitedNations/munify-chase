<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { latchWhileDisconnected } from '#lib/state/connection.svelte';
	import { type VotingStage } from './votingModal';
	import { m } from '#lib/paraglide/messages';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import ResultChart from './ResultChart.svelte';
	import PresentationVoteModal from './PresentationVoteModal.svelte';
	import { showOfHandsMajority, showOfHandsResultBoxes, showOfHandsTotal } from './votingMath';

	interface Props {
		committeeId: string;
	}
	let { committeeId }: Props = $props();

	// `committee.activeVotingSession` is the single source of truth for "is a vote
	// happening?" — driving the modal from this FK keeps every tab consistent
	// (including offline popups whose cross-tab synthetic mutations would otherwise
	// roll back a list-based `where: completedAt isNull` query result).
	const committeeWithVote = await client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		activeVotingSession: {
			id: true,
			mode: true,
			currentStage: true,
			votesPro: true,
			votesCon: true,
			votesAbstain: true,
			voteName: true,
			majority: true,
			withAbstentions: true
		}
	});

	// Freeze the last-known session while the WS is confirmed disconnected, so a real
	// outage doesn't close the vote mid-count — only a genuine vote completion does.
	const getSession = latchWhileDisconnected(() => committeeWithVote?.activeVotingSession ?? null);
	let session = $derived(getSession());

	let votesTotal = $derived(
		showOfHandsTotal({
			majority: session?.majority,
			pro: session?.votesPro,
			con: session?.votesCon,
			abstain: session?.votesAbstain
		})
	);
	// Same rule as ShowOfHandsVotingChair, which decides the outcome from the counted votes
	let majorityAmount = $derived(
		showOfHandsMajority({ majority: session?.majority, total: votesTotal })
	);

	let resultBoxes = $derived(showOfHandsResultBoxes(session));

	const getClasses = (stage: VotingStage) => {
		switch (stage) {
			case 'PRO':
				return 'bg-success text-success-content';
			case 'CON':
				return 'bg-error text-error-content';
			case 'ABSTAIN':
				return 'bg-info text-info-content';
			default:
				return 'bg-base-200 text-base-content';
		}
	};

	const getIcon = (stage: VotingStage) => {
		switch (stage) {
			case 'PRO':
				return 'plus-circle';
			case 'CON':
				return 'minus-circle';
			case 'ABSTAIN':
				return 'circle';
			default:
				return '';
		}
	};

	const getText = (stage: VotingStage) => {
		switch (stage) {
			case 'PRO':
				return m.pro();
			case 'CON':
				return m.con();
			case 'ABSTAIN':
				return m.abstain();
			default:
				return '';
		}
	};
</script>

{#snippet VoteNowBox(stage: VotingStage)}
	<div
		class="{getClasses(
			stage
		)} card absolute inset-10 top-30 mb-4 items-center justify-center gap-4 p-10 shadow-sm"
		in:fly={{ duration: 500, delay: 500, easing: cubicOut, x: 10 }}
		out:fly={{ duration: 500, easing: cubicIn, x: -10 }}
	>
		<i
			aria-hidden="true"
			class="ph-fill ph-{getIcon(stage)} icon-beat text-7xl"
			style="--icon-animation-duration: 2s;"
		></i>
		<h3 class="text-5xl font-bold">{getText(stage)}</h3>
	</div>
{/snippet}

{#if session?.mode === 'SHOW_OF_HANDS'}
	<PresentationVoteModal
		title={session.voteName || m.showOfHandsVoting()}
		class="h-full max-h-9/12 w-full max-w-9/12"
		titleClass="mb-8"
	>
		{#if session.currentStage === 'PRO'}
			{@render VoteNowBox('PRO')}
		{:else if session.currentStage === 'CON'}
			{@render VoteNowBox('CON')}
		{:else if session.currentStage === 'ABSTAIN'}
			{@render VoteNowBox('ABSTAIN')}
		{:else if session.currentStage === 'EVALUATION'}
			<div
				class="absolute inset-10 top-30 mb-4 flex flex-col items-stretch justify-center gap-4 p-10"
				in:fly={{ duration: 500, delay: 500, easing: cubicOut, y: 40 }}
			>
				<ResultChart
					votesPro={session.votesPro}
					votesCon={session.votesCon}
					total={votesTotal}
					{majorityAmount}
				/>

				<div class="flex items-center justify-center gap-6">
					{#each resultBoxes as box (box.icon)}
						<div
							class="card {box.classes} min-w-26 items-center justify-center gap-4 px-10 py-4 shadow-sm"
						>
							<i aria-hidden="true" class="ph-fill ph-{box.icon} text-3xl"></i>
							<h3 class="text-4xl font-bold">{box.value}</h3>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</PresentationVoteModal>
{/if}
