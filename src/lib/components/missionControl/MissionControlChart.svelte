<script module lang="ts">
	// Loaded once and shared by every chart, so a chart recreated after the
	// first one draws in the same frame instead of waiting on the dynamic import.
	let chartModule: Promise<typeof import('chart.js/auto')> | undefined;
	const loadChartJs = () => (chartModule ??= import('chart.js/auto'));
</script>

<script lang="ts">
	import { untrack } from 'svelte';

	export interface ChartSlice {
		key: string;
		label: string;
		value: number;
		valueLabel?: string;
	}

	export type MissionControlChartKind = 'doughnut' | 'pie' | 'polarArea' | 'bar';

	interface Props {
		slices: ChartSlice[];
		kind?: MissionControlChartKind;
	}

	let { slices, kind = 'doughnut' }: Props = $props();

	let canvas = $state<HTMLCanvasElement>();

	const PALETTE = [
		'#6366f1',
		'#8b5cf6',
		'#ec4899',
		'#f97316',
		'#eab308',
		'#22c55e',
		'#14b8a6',
		'#3b82f6'
	];

	function resolveClass(cls: string, prop: 'backgroundColor' | 'color' | 'borderColor'): string {
		const el = Object.assign(document.createElement('div'), {
			className: cls,
			style: 'position:absolute;visibility:hidden'
		});
		document.body.appendChild(el);
		const v = getComputedStyle(el)[prop];
		el.remove();
		return v;
	}

	let chart = $state.raw<import('chart.js').Chart>();
	// Read by the tooltip callback, kept outside the chart config so in-place
	// data updates don't have to rebuild the options.
	let currentValueLabels: string[] = [];

	// The grid rebuilds its tiles (and so this component's `slices` array) on
	// every server clock tick, not only when the numbers change. Comparing by
	// content keeps the chart untouched until something visible actually differs.
	const dataKey = $derived(JSON.stringify(slices));
	const hasData = $derived(slices.length > 0);

	function chartData() {
		return {
			labels: slices.map((s) => s.label),
			data: slices.map((s) => s.value),
			colors: slices.map((_, i) => PALETTE[i % PALETTE.length]),
			valueLabels: slices.map((s) => s.valueLabel ?? String(s.value))
		};
	}

	// (Re)create the chart only when its type changes or data first appears.
	// The rotation picks a new chart kind every cycle, which needs a fresh
	// instance; plain data refreshes are applied in place by the effect below.
	$effect(() => {
		if (typeof window === 'undefined' || !canvas || !hasData) return;
		const currentKind = kind;
		const target = canvas;

		let localChart: import('chart.js').Chart | undefined;
		let destroyed = false;

		loadChartJs().then(({ default: Chart }) => {
			if (destroyed) return;
			const { labels, data, colors, valueLabels } = untrack(chartData);

			const baseContent = resolveClass('text-base-content', 'color');
			const base100 = resolveClass('bg-base-100', 'backgroundColor');
			const gridColor = resolveClass('border-base-content/10', 'borderColor');
			currentValueLabels = valueLabels;
			const tooltipLabel = (item: { dataIndex: number }) =>
				` ${currentValueLabels[item.dataIndex] ?? ''}`;

			if (currentKind === 'bar') {
				localChart = new Chart(target, {
					type: 'bar',
					data: {
						labels,
						datasets: [
							{
								data,
								backgroundColor: colors,
								borderRadius: 4
							}
						]
					},
					options: {
						indexAxis: 'y',
						animation: false,
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							legend: { display: false },
							tooltip: { callbacks: { label: tooltipLabel } }
						},
						scales: {
							x: {
								beginAtZero: true,
								ticks: { color: baseContent, font: { size: 13 } },
								grid: { color: gridColor }
							},
							y: {
								ticks: { color: baseContent, font: { size: 15, weight: 'bold' } },
								grid: { display: false }
							}
						}
					}
				});
			} else {
				localChart = new Chart(target, {
					type: currentKind,
					data: {
						labels,
						datasets: [
							{
								data,
								backgroundColor: colors,
								borderColor: base100,
								borderWidth: 3,
								hoverOffset: 6
							}
						]
					},
					options: {
						animation: false,
						responsive: true,
						maintainAspectRatio: false,
						cutout: currentKind === 'doughnut' ? '60%' : 0,
						scales:
							currentKind === 'polarArea'
								? {
										r: {
											ticks: { display: false },
											grid: { color: gridColor },
											angleLines: { color: gridColor }
										}
									}
								: undefined,
						plugins: {
							legend: {
								position: 'bottom',
								labels: { color: baseContent, boxWidth: 14, padding: 10, font: { size: 15 } }
							},
							tooltip: { callbacks: { label: tooltipLabel } }
						}
					}
				});
			}
			chart = localChart;
		});

		return () => {
			destroyed = true;
			localChart?.destroy();
			if (chart === localChart) chart = undefined;
		};
	});

	// Data-only changes: swap the numbers into the existing chart without
	// destroying it, so the canvas never goes blank between frames.
	$effect(() => {
		void dataKey;
		const current = chart;
		if (!current) return;
		const { labels, data, colors, valueLabels } = untrack(chartData);
		current.data.labels = labels;
		const dataset = current.data.datasets[0];
		dataset.data = data;
		dataset.backgroundColor = colors;
		currentValueLabels = valueLabels;
		current.update('none');
	});
</script>

<!--
	Chart.js's responsive canvas needs a parent with an actual (non-auto) height
	to size against — the masonry grid this tile sits in sizes columns to their
	content, so nothing above this div provides one. A fixed height here is the
	simplest bounded box that still leaves room for a bottom legend.
-->
<div class="h-72 w-full overflow-hidden" style="position: relative">
	<canvas bind:this={canvas}></canvas>
</div>
