<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import RepCell from './RepCell.svelte';
	import StatsTableCard from './StatsTableCard.svelte';
	import { hasRows, pct, repLabel, type AlignmentRow, type ContrarianRow } from './conferenceStats';

	interface Props {
		contrarian: ContrarianRow[] | null | undefined;
		alignment: AlignmentRow[] | null | undefined;
	}
	let { contrarian, alignment }: Props = $props();
</script>

<div class="grid gap-4 lg:grid-cols-2" data-tour="statistics.voting">
	{#if hasRows(contrarian)}
		<StatsTableCard title={m.mostContrarianVoters()}>
			{#snippet head()}
				<th>#</th>
				<th>{m.delegation()}</th>
				<th class="text-right">{m.contraryVotes()}</th>
				<th class="text-right">Rate</th>
			{/snippet}
			{#each (contrarian ?? []).slice(0, 10) as row, i (row.representationId)}
				<tr>
					<td class="text-base-content/40 tabular-nums">{i + 1}</td>
					<RepCell {row} truncate />
					<td class="text-right tabular-nums">{row.contraryVotes}</td>
					<td class="text-right tabular-nums"
						>{pct({ part: row.contraryVotes, whole: row.totalVotes })}</td
					>
				</tr>
			{/each}
		</StatsTableCard>
	{/if}

	{#if hasRows(alignment)}
		<StatsTableCard title={m.votingAlignmentLeaderboard()}>
			{#snippet head()}
				<th>#</th>
				<th>Pair</th>
				<th class="text-right">Agreement</th>
				<th class="text-right">Votes</th>
			{/snippet}
			{#each (alignment ?? []).slice(0, 10) as row, i (`${row.representation1Id}-${row.representation2Id}`)}
				<tr>
					<td class="text-base-content/40 tabular-nums">{i + 1}</td>
					<td class="text-sm">
						{repLabel({
							name: row.representation1Name,
							alpha2: row.representation1Alpha2Code,
							id: row.representation1Id
						})}
						<span class="text-base-content/30 mx-1">×</span>
						{repLabel({
							name: row.representation2Name,
							alpha2: row.representation2Alpha2Code,
							id: row.representation2Id
						})}
					</td>
					<td class="text-right">
						<span class="font-mono tabular-nums">{Math.round(row.agreementRate * 100)}%</span>
					</td>
					<td class="text-right tabular-nums">{row.votesCompared}</td>
				</tr>
			{/each}
		</StatsTableCard>
	{/if}
</div>
