<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import { fmtTime, repLabel, type SpeakingRow } from './conferenceStats';

	interface Props {
		rows: SpeakingRow[];
	}
	let { rows }: Props = $props();
</script>

<BasicCard title="Non-State Actor Activity">
	<div class="overflow-x-auto">
		<table class="table table-sm w-full">
			<thead>
				<tr>
					<th>#</th>
					<th>Organization</th>
					<th class="text-right">{m.totalSpeakingTime()}</th>
					<th class="text-right">{m.formalSpeeches()}</th>
					<th class="text-right">{m.commentInterventions()}</th>
				</tr>
			</thead>
			<tbody>
				{#each rows.slice(0, 15) as row, i (row.representationId)}
					<tr>
						<td class="text-base-content/40 tabular-nums">{i + 1}</td>
						<td class="truncate text-sm"
							>{repLabel({
								name: row.representationName,
								alpha2: row.alpha2Code,
								id: row.representationId
							})}</td
						>
						<td class="text-right font-mono text-sm tabular-nums">{fmtTime(row.totalSeconds)}</td>
						<td class="text-right tabular-nums">{row.speechCount}</td>
						<td class="text-right tabular-nums">{row.commentCount}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</BasicCard>
