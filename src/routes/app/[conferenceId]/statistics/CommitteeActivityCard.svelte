<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import { committeesBySpeakingTime, fmtTime, type CommitteeRow } from './conferenceStats';

	interface Props {
		rows: CommitteeRow[];
	}
	let { rows }: Props = $props();
</script>

<BasicCard title={m.committeeActivityStats()}>
	<div class="overflow-x-auto">
		<table class="table table-sm w-full">
			<thead>
				<tr>
					<th>Committee</th>
					<th class="text-right">{m.totalSpeakingTime()}</th>
					<th class="text-right">{m.formalSpeeches()}</th>
					<th class="text-right">Voting sessions</th>
				</tr>
			</thead>
			<tbody>
				{#each committeesBySpeakingTime(rows) as row (row.committeeId)}
					<tr>
						<td>
							<span class="font-medium">{row.committeeAbbreviation}</span>
							<span class="text-base-content/40 ml-1 text-xs">{row.committeeName}</span>
						</td>
						<td class="text-right font-mono text-sm tabular-nums"
							>{fmtTime(row.totalSpeakingSeconds)}</td
						>
						<td class="text-right tabular-nums">{row.speechCount}</td>
						<td class="text-right tabular-nums">{row.voteCount}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</BasicCard>
