<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { isTeam, type ResolutionViewer } from './paperContext';
	import { launchClauseVote } from './resolutionVotes';

	interface Props {
		paperId: string;
		committeeId: string;
		selectedClauseId: string | null;
		viewer: ResolutionViewer;
		/** Simple-majority threshold for the committee, used as the vote target. */
		simpleMajority: number;
		clauseLabel: string;
	}

	let { paperId, committeeId, selectedClauseId, viewer, simpleMajority, clauseLabel }: Props =
		$props();

	const votes = $derived(
		await client.liveQuery.operativeClauseVotes({
			__args: { where: { paper: { id: paperId } } },
			id: true,
			clauseId: true,
			vote: {
				id: true,
				voteName: true,
				votesPro: true,
				votesCon: true,
				votesAbstain: true,
				outcome: true,
				completedAt: true
			}
		})
	);

	const current = $derived((votes ?? []).find((v) => v.clauseId === selectedClauseId));

	let starting = $state(false);
	async function startVote() {
		if (!selectedClauseId) return;
		starting = true;
		try {
			await launchClauseVote({
				committeeId,
				paperId,
				clauseId: selectedClauseId,
				majorityAmount: simpleMajority,
				voteName: clauseLabel
			});
			toast.success(m.voteStarted());
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to start vote');
		} finally {
			starting = false;
		}
	}
</script>

<div class="flex flex-col gap-3">
	{#if !selectedClauseId}
		<p class="text-base-content/50 py-6 text-center text-sm">{m.selectClauseForVote()}</p>
	{:else if current?.vote}
		{@const v = current.vote}
		<div class="bg-base-100 rounded-lg p-3">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm font-semibold">{v.voteName || clauseLabel}</span>
				{#if v.outcome}
					<span class="badge {v.outcome === 'ADOPTED' ? 'badge-success' : 'badge-error'}">
						{v.outcome === 'ADOPTED' ? m.adopted() : m.rejected()}
					</span>
				{:else}
					<span class="badge badge-warning">{m.voteInProgress()}</span>
				{/if}
			</div>
			<div class="grid grid-cols-3 gap-2 text-center">
				<div>
					<div class="text-success text-lg font-bold">{v.votesPro}</div>
					<div class="text-base-content/60 text-xs">{m.votesFor()}</div>
				</div>
				<div>
					<div class="text-error text-lg font-bold">{v.votesCon}</div>
					<div class="text-base-content/60 text-xs">{m.votesAgainst()}</div>
				</div>
				<div>
					<div class="text-lg font-bold">{v.votesAbstain}</div>
					<div class="text-base-content/60 text-xs">{m.votesAbstain()}</div>
				</div>
			</div>
		</div>
	{:else}
		<p class="text-base-content/50 text-sm">{m.noVoteForClause()}</p>
	{/if}

	{#if isTeam(viewer) && selectedClauseId}
		<button class="btn btn-secondary btn-sm" disabled={starting} onclick={startVote}>
			{#if starting}<i class="fas fa-spinner fa-spin"></i>{:else}<i class="fas fa-person-booth"
				></i>{/if}
			{current?.vote ? m.restartVote() : m.startClauseVote()}
		</button>
	{/if}
</div>
