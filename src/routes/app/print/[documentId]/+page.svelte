<script lang="ts">
	import type { PageData } from './$houdini';
	import {
		ResolutionPrintPreview,
		migrateResolution,
		type Resolution,
		type ResolutionHeaderData,
		type OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { getResolutionLabels } from '$lib/utils/resolutionEditorLabels';
	import * as m from '$lib/paraglide/messages';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.PrintPaperQuery);
	let paper = $derived($query.data?.findFirstResolutionPaper);
	let clauseVotes = $derived($query.data?.findManyOperativeClauseVote ?? []);
	let voteResult = $derived($query.data?.findFirstResolutionVoteResult ?? null);

	let resolution = $derived(paper?.content ? migrateResolution(paper.content as Resolution) : null);
	let operativeClauses = $derived((resolution?.operative ?? []) as OperativeClause[]);

	// Map clauseId → vote for quick lookup
	let clauseVoteMap = $derived.by(() => {
		const map = new Map<string, (typeof clauseVotes)[0]>();
		for (const v of clauseVotes) {
			map.set(v.clauseId, v);
		}
		return map;
	});

	let headerData = $derived<ResolutionHeaderData>({
		conferenceTitle: paper?.committee?.conference?.title ?? undefined,
		committeeAbbreviation: paper?.committee?.abbreviation ?? undefined,
		committeeFullName: paper?.committee?.name ?? undefined,
		committeeResolutionHeadline: paper?.committee?.resolutionHeadline ?? undefined,
		documentNumber:
			paper?.documentNumber?.replace(`${paper?.committee?.abbreviation}/`, '') ?? undefined,
		topic: paper?.agendaItem?.title ?? undefined,
		authoringDelegation:
			getTranslatedCountryNameFromAlpha3Code(paper?.creator?.representation?.alpha3Code) ??
			paper?.creator?.representation?.name ??
			undefined,
		sponsoringDelegations: paper?.sponsors
			?.map(
				(s: (typeof paper.sponsors)[number]) =>
					getTranslatedCountryNameFromAlpha3Code(s.committeeMember?.representation?.alpha3Code) ??
					s.committeeMember?.representation?.name ??
					''
			)
			.filter(Boolean)
			.sort((a: string, b: string) => a.localeCompare(b)),
		lastEdited: paper?.updatedAt ?? undefined
	});

	let showVotingResults = $derived(
		paper?.status === 'FINAL' && (clauseVotes.length > 0 || voteResult)
	);
</script>

<div class="p-8 print:p-0">
	{#if resolution}
		<ResolutionPrintPreview {resolution} {headerData} labels={getResolutionLabels()} />

		{#if showVotingResults}
			<div class="mt-8 border-t-2 border-black pt-4">
				<h2 class="text-lg font-bold mb-3">{m.votingResults()}</h2>

				{#if clauseVotes.length > 0}
					<table class="w-full text-sm border-collapse mb-4">
						<thead>
							<tr class="border-b border-black">
								<th class="text-left py-1 pr-4">&nbsp;</th>
								<th class="text-left py-1 pr-4">{m.outcome()}</th>
								<th class="text-left py-1 pr-4">{m.votesFor()}</th>
								<th class="text-left py-1 pr-4">{m.votesAgainst()}</th>
								<th class="text-left py-1">{m.votesAbstain()}</th>
							</tr>
						</thead>
						<tbody>
							{#each operativeClauses as clause, i (clause.id)}
								{@const vote = clauseVoteMap.get(clause.id)}
								{#if vote}
									<tr class="border-b border-gray-300">
										<td class="py-1 pr-4 font-mono">OP {i + 1}</td>
										<td class="py-1 pr-4"
											>{vote.outcome === 'ADOPTED' ? m.adopted() : m.rejected()}</td
										>
										<td class="py-1 pr-4">{vote.votesFor}</td>
										<td class="py-1 pr-4">{vote.votesAgainst}</td>
										<td class="py-1">{vote.votesAbstain}</td>
									</tr>
								{/if}
							{/each}
							{#if voteResult}
								<tr class="border-t-2 border-black font-semibold">
									<td class="py-1 pr-4">{m.finalVote()}</td>
									<td class="py-1 pr-4">
										{voteResult.outcome === 'ADOPTED'
											? m.adopted()
											: voteResult.outcome === 'REJECTED'
												? m.rejected()
												: m.sentBack()}
									</td>
									<td class="py-1 pr-4">{voteResult.votesFor}</td>
									<td class="py-1 pr-4">{voteResult.votesAgainst}</td>
									<td class="py-1">{voteResult.votesAbstain}</td>
								</tr>
							{/if}
						</tbody>
					</table>
				{:else if voteResult}
					<div class="text-sm">
						<span class="font-semibold">{m.finalVote()}:</span>
						{voteResult.outcome === 'ADOPTED'
							? m.adopted()
							: voteResult.outcome === 'REJECTED'
								? m.rejected()
								: m.sentBack()}
						— {m.votesFor()}: {voteResult.votesFor} | {m.votesAgainst()}: {voteResult.votesAgainst}
						{#if voteResult.votesAbstain > 0}
							| {m.votesAbstain()}: {voteResult.votesAbstain}
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="flex justify-center items-center min-h-screen">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{/if}
</div>
