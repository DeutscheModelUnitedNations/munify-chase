<script lang="ts">
	import LineChart, { type ThemeColors } from './LineChart.svelte';
	import { speakingMinutesLabel, timelineLabels } from './conferenceStats';

	export interface TimelineBucket {
		bucket: string;
		totalSeconds: number;
	}

	interface Props {
		buckets: TimelineBucket[];
	}
	let { buckets }: Props = $props();

	let build = $derived((colors: ThemeColors) => ({
		type: 'line' as const,
		data: {
			labels: timelineLabels(buckets.map((b) => new Date(b.bucket))),
			datasets: [
				{
					label: '',
					data: buckets.map((b) => Math.round(b.totalSeconds / 60)),
					borderColor: colors.primary,
					backgroundColor: colors.primary.replace('rgb', 'rgba').replace(')', ', 0.12)'),
					borderWidth: 2,
					pointRadius: buckets.length > 100 ? 0 : 3,
					pointHoverRadius: 5,
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
						label: (ctx: { parsed: { y: number | null } }) => speakingMinutesLabel(ctx.parsed.y ?? 0)
					}
				}
			},
			scales: {
				x: {
					grid: { color: colors.grid },
					ticks: {
						color: colors.label,
						maxTicksLimit: 12,
						maxRotation: 45
					}
				},
				y: {
					grid: { color: colors.grid },
					ticks: {
						color: colors.label,
						callback: (v: string | number) => `${v}m`
					},
					beginAtZero: true,
					title: {
						display: true,
						text: 'Speaking time (min)',
						color: colors.label
					}
				}
			}
		}
	}));
</script>

{#if buckets.length === 0}
	<p class="text-base-content/50 py-8 text-center text-sm">No speaking data yet.</p>
{:else}
	<LineChart {build} height={260} />
{/if}
