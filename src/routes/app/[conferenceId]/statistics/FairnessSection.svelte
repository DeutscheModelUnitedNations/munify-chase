<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import {
		fmtTime,
		hasRows,
		regionLabel,
		type FairnessData,
		type RegionRow
	} from './conferenceStats';

	interface Props {
		regions: RegionRow[] | null | undefined;
		fairness: FairnessData | null | undefined;
	}
	let { regions, fairness }: Props = $props();
</script>

<div class="grid items-stretch gap-4 lg:grid-cols-5" data-tour="statistics.fairness">
	{#if hasRows(regions)}
		<div class="lg:col-span-3">
			<BasicCard title={m.speakingByRegion()} className="h-full">
				<div class="overflow-x-auto">
					<table class="table table-sm w-full">
						<thead>
							<tr>
								<th>Region</th>
								<th class="text-right">{m.totalSpeakingTime()}</th>
								<th class="text-right">Delegations</th>
								<th class="text-right">{m.formalSpeeches()}</th>
							</tr>
						</thead>
						<tbody>
							{#each regions ?? [] as row (row.group)}
								<tr>
									<td class="text-sm">{regionLabel(row.group)}</td>
									<td class="text-right font-mono text-sm tabular-nums"
										>{fmtTime(row.totalSeconds)}</td
									>
									<td class="text-right tabular-nums">{row.delegationCount}</td>
									<td class="text-right tabular-nums">{row.speechCount}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</BasicCard>
		</div>
	{/if}

	<div class="lg:col-span-2">
		<BasicCard title={m.speakingDistributionFairness()} className="h-full">
			<div class="flex flex-col gap-3 py-2">
				<div class="flex items-start justify-between gap-4">
					<div>
						<p class="text-base-content/60 text-sm">{m.giniCoefficient()}</p>
						<p class="font-mono text-3xl font-bold">
							{(fairness?.gini ?? 0).toFixed(3)}
						</p>
					</div>
					<div class="text-right shrink-0">
						<p class="text-base-content/60 text-sm">Std. deviation</p>
						<p class="font-mono text-3xl font-bold">
							{fmtTime(fairness?.stdDevSeconds ?? 0)}
						</p>
					</div>
				</div>
				<p class="text-base-content/40 text-xs">
					The Gini coefficient measures speaking-time inequality across all delegations — like an
					economic inequality index, but for floor time.
					<span class="font-medium">0</span> means every delegation spoke for exactly the same amount
					of time;
					<span class="font-medium">1</span> means a single delegation took all the floor time. A value
					below 0.4 is generally considered healthy debate participation.
				</p>
			</div>
		</BasicCard>
	</div>
</div>
