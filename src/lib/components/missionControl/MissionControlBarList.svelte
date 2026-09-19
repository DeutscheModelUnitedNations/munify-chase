<script lang="ts">
	export interface BarListItem {
		key: string;
		label: string;
		value: number;
		valueLabel: string;
		icon?: string;
	}

	interface Props {
		items: BarListItem[];
		barColorClass?: string;
	}

	let { items, barColorClass = 'bg-primary' }: Props = $props();

	// Bar width relative to the largest value in the list, not an absolute scale —
	// this is a quick leaderboard glance, not a precision chart.
	const max = $derived(Math.max(1, ...items.map((i) => i.value)));
</script>

<!--
	Lightweight CSS bar chart instead of a canvas/Chart.js instance — these
	tiles mount and unmount constantly as the rotation reshuffles every 45s,
	and a plain div bar avoids paying chart (re)construction cost for that.
	The label truncates (never the value) — see MissionControlGrid's region
	tile fix for why that ordering matters.
-->
<div class="flex min-h-0 flex-1 flex-col justify-center gap-3 overflow-hidden">
	{#each items as item (item.key)}
		<div class="flex items-center gap-3">
			{#if item.icon}
				<i class="fas fa-{item.icon} text-primary w-7 flex-none text-center"></i>
			{/if}
			<span class="min-w-0 flex-1 truncate font-bold">{item.label}</span>
			<div class="bg-base-200 h-2.5 w-16 flex-none overflow-hidden rounded-full sm:w-24">
				<div
					class="{barColorClass} h-full rounded-full"
					style="width: {Math.max(6, Math.round((item.value / max) * 100))}%"
				></div>
			</div>
			<span class="text-base-content/70 w-14 flex-none text-right tabular-nums"
				>{item.valueLabel}</span
			>
		</div>
	{/each}
</div>
