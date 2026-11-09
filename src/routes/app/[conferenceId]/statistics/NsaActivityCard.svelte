<script lang="ts">
	import SpeakingCells from './SpeakingCells.svelte';
	import SpeakingHeadCells from './SpeakingHeadCells.svelte';
	import StatsTableCard from './StatsTableCard.svelte';
	import { repLabel, type SpeakingRow } from './conferenceStats';

	interface Props {
		rows: SpeakingRow[];
	}
	let { rows }: Props = $props();
</script>

<StatsTableCard title="Non-State Actor Activity">
	{#snippet head()}
		<th>#</th>
		<th>Organization</th>
		<SpeakingHeadCells />
	{/snippet}
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
			<SpeakingCells {row} />
		</tr>
	{/each}
</StatsTableCard>
