<script lang="ts">
	import LineChart, { type ThemeColors } from './LineChart.svelte';
	import { trendChartHeight } from './conferenceStats';

	export interface TrendPoint {
		date: string;
		uniqueUsersPresent: number;
	}

	interface Props {
		points: TrendPoint[];
	}
	let { points }: Props = $props();

	let build = $derived((colors: ThemeColors) => ({
		type: 'line' as const,
		data: {
			labels: points.map((p) =>
				new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
			),
			datasets: [
				{
					label: '',
					data: points.map((p) => p.uniqueUsersPresent),
					borderColor: colors.primary,
					backgroundColor: colors.primary.replace('rgb', 'rgba').replace(')', ', 0.1)'),
					borderWidth: 2,
					pointRadius: 4,
					pointHoverRadius: 6,
					fill: true,
					tension: 0.3
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: { display: false },
				tooltip: {
					callbacks: {
						label: (ctx: { parsed: { y: number | null } }) => ` ${ctx.parsed.y} present`
					}
				}
			},
			scales: {
				x: {
					grid: { color: colors.grid },
					ticks: { color: colors.label }
				},
				y: {
					grid: { color: colors.grid },
					ticks: { color: colors.label, precision: 0 },
					beginAtZero: true
				}
			}
		}
	}));
</script>

{#if points.length === 0}
	<p class="text-base-content/50 py-8 text-center text-sm">No attendance data yet.</p>
{:else}
	<LineChart {build} height={trendChartHeight(points.length)} />
{/if}
