<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { translateRegionalGroupEnum } from '#lib/utils/enumTranslationHelper';
	import type { RegionalgroupEnum } from '#lib/api/rumbleClient/client';
	import MissionControlTile from './MissionControlTile.svelte';
	import MissionControlChart from './MissionControlChart.svelte';
	import type { ChartTile } from './insights';
	import {
		amendmentStatusLabel,
		chartTypeFor,
		fmtDuration,
		paperStatusLabel,
		percentOf,
		representationTypeLabel
	} from './missionControlFormat';

	/** `tick` reseeds the chart type on every rotation */
	let { tile, tick }: { tile: ChartTile; tick: number } = $props();

	const kind = $derived(chartTypeFor({ kind: tile.kind, key: tile.key, tick }));
	const countSlices = (
		entries: { status: string; count: number }[],
		label: (s: string) => string
	) =>
		entries.map((entry) => ({
			key: entry.status,
			label: label(entry.status),
			value: entry.count,
			valueLabel: String(entry.count)
		}));
</script>

{#if tile.kind === 'speakingByRegion'}
	<MissionControlTile title={m.missionControlSpeakingByRegion()}>
		<MissionControlChart
			{kind}
			slices={tile.entries.slice(0, 5).map((entry) => ({
				key: entry.group,
				label: translateRegionalGroupEnum(entry.group as RegionalgroupEnum) || m.unknown(),
				value: entry.totalSeconds,
				valueLabel: fmtDuration(entry.totalSeconds)
			}))}
		/>
	</MissionControlTile>
{:else if tile.kind === 'resolutionFunnel'}
	<MissionControlTile title={m.missionControlResolutionFunnel()}>
		<MissionControlChart {kind} slices={countSlices(tile.entries, paperStatusLabel)} />
	</MissionControlTile>
{:else if tile.kind === 'speakingByRepresentationType'}
	<MissionControlTile title={m.missionControlSpeakingByType()}>
		<MissionControlChart
			{kind}
			slices={tile.entries.map((entry) => ({
				key: entry.representationType,
				label: representationTypeLabel(entry.representationType),
				value: entry.totalSeconds,
				valueLabel: fmtDuration(entry.totalSeconds)
			}))}
		/>
	</MissionControlTile>
{:else if tile.kind === 'amendmentActivity'}
	<MissionControlTile title={m.missionControlAmendmentActivity()}>
		<MissionControlChart {kind} slices={countSlices(tile.entries, amendmentStatusLabel)} />
	</MissionControlTile>
{:else}
	{@const total = tile.entries.reduce((acc, entry) => acc + entry.count, 0)}
	<MissionControlTile title={m.missionControlVoteOutcomesToday()}>
		<div class="flex min-h-0 flex-1 flex-col justify-center gap-5">
			<div class="bg-base-200 flex h-4 w-full overflow-hidden rounded-full">
				{#each tile.entries as entry (entry.outcome)}
					{@const adopted = entry.outcome === 'ADOPTED'}
					<div
						class:bg-success={adopted}
						class:bg-error={!adopted}
						style="width: {percentOf(entry.count, total)}%"
					></div>
				{/each}
			</div>
			<div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-2xl">
				{#each tile.entries as entry (entry.outcome)}
					{@const adopted = entry.outcome === 'ADOPTED'}
					<div class="flex items-center gap-2">
						<span
							class="h-3 w-3 flex-none rounded-full"
							class:bg-success={adopted}
							class:bg-error={!adopted}
						></span>
						<span class="font-bold">{adopted ? m.adopted() : m.rejected()}</span>
						<span class="text-base-content/70">{entry.count}</span>
					</div>
				{/each}
			</div>
		</div>
	</MissionControlTile>
{/if}
