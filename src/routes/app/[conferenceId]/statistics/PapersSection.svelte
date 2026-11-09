<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import RepCell from './RepCell.svelte';
	import StatsTableCard from './StatsTableCard.svelte';
	import { hasRows, pct, type AmendmentRow, type SponsorRow } from './conferenceStats';

	interface Props {
		amendments: AmendmentRow[] | null | undefined;
		sponsors: SponsorRow[] | null | undefined;
	}
	let { amendments, sponsors }: Props = $props();
</script>

<div class="grid gap-4 lg:grid-cols-2" data-tour="statistics.papers">
	{#if hasRows(amendments)}
		<StatsTableCard title={m.amendmentSuccessRate()}>
			{#snippet head()}
				<th>{m.delegation()}</th>
				<th class="text-right">Proposed</th>
				<th class="text-right">{m.amendmentStatusAccepted()}</th>
				<th class="text-right">Rate</th>
			{/snippet}
			{#each (amendments ?? []).slice(0, 15) as row (row.representationId)}
				<tr>
					<RepCell {row} truncate />
					<td class="text-right tabular-nums">{row.total}</td>
					<td class="text-right tabular-nums text-success">{row.accepted}</td>
					<td class="text-right tabular-nums">{pct({ part: row.accepted, whole: row.total })}</td>
				</tr>
			{/each}
		</StatsTableCard>
	{/if}

	{#if hasRows(sponsors)}
		<StatsTableCard title={m.topPaperSponsors()}>
			{#snippet head()}
				<th>#</th>
				<th>{m.delegation()}</th>
				<th class="text-right">{m.papersSponsored()}</th>
			{/snippet}
			{#each (sponsors ?? []).slice(0, 15) as row, i (row.representationId)}
				<tr>
					<td class="text-base-content/40 tabular-nums">{i + 1}</td>
					<RepCell {row} truncate />
					<td class="text-right tabular-nums">{row.sponsorships}</td>
				</tr>
			{/each}
		</StatsTableCard>
	{/if}
</div>
