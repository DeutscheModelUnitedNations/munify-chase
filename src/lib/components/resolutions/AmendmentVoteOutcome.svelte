<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import type { VotingResult } from '#lib/components/voting/votingModal';

	interface Props {
		result: VotingResult;
		/** What applying the amendment will do. */
		summary: { headline: string; body?: string | null };
		onapply: () => void;
		onreject: () => void;
		oncancel: () => void;
	}

	let { result, summary, onapply, onreject, oncancel }: Props = $props();

	const adopted = $derived(result.outcome === 'ADOPTED');
	const tallies = $derived([
		{ icon: 'check text-success', count: result.votesFor, label: m.votesFor() },
		{ icon: 'x text-error', count: result.votesAgainst, label: m.votesAgainst() },
		{ icon: 'minus', count: result.votesAbstain, label: m.votesAbstain() }
	]);
</script>

<!-- After an amendment vote: the chair applies or rejects, pre-selected by the result -->
<div class="modal modal-open">
	<div class="modal-box">
		<div class="flex items-center justify-between gap-2">
			<h3 class="text-lg font-bold">{m.voteResult()}</h3>
			<span class="badge {adopted ? 'badge-success' : 'badge-error'}">
				{adopted ? m.amendmentStatusAccepted() : m.amendmentStatusRejected()}
			</span>
		</div>

		<div class="text-base-content/70 mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
			{#each tallies as tally (tally.icon)}
				<span
					><i aria-hidden="true" class="ph-fill ph-{tally.icon}"></i>
					{tally.count}
					{tally.label}</span
				>
			{/each}
		</div>

		<div class="bg-base-200 mt-4 rounded-lg p-3">
			<p class="text-base-content/60 text-xs">{m.proposedAmendmentPresentation()}</p>
			<p class="mt-1 font-semibold">{summary.headline}</p>
			{#if summary.body}
				<p class="bg-base-100 mt-2 rounded p-2 font-mono text-xs whitespace-pre-wrap">
					{summary.body}
				</p>
			{/if}
		</div>

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={oncancel}>{m.cancel()}</button>
			<button class="btn btn-error" class:btn-outline={adopted} onclick={onreject}
				>{m.reject()}</button
			>
			<button class="btn btn-success" class:btn-outline={!adopted} onclick={onapply}
				>{m.applyAmendment()}</button
			>
		</div>
	</div>
	<button class="modal-backdrop" aria-label={m.cancel()} onclick={oncancel}></button>
</div>
