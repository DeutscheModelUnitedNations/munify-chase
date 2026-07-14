<script lang="ts">
	import { onDestroy } from 'svelte';

	export interface TrendPoint {
		date: string;
		uniqueUsersPresent: number;
	}

	interface Props {
		points: TrendPoint[];
	}
	let { points }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		if (typeof window === 'undefined' || !canvas || points.length === 0) return;
		let destroyed = false;
		let localChart: import('chart.js').Chart | undefined;

		(async () => {
			const { Chart } = await import('chart.js/auto');
			if (destroyed || !canvas) return;

			const el = Object.assign(document.createElement('div'), {
				className: 'text-primary bg-transparent',
				style: 'position:absolute;visibility:hidden'
			});
			document.body.appendChild(el);
			const primaryColor = getComputedStyle(el).color;
			el.className = 'text-base-content/20 bg-transparent';
			const gridColor = getComputedStyle(el).color;
			el.className = 'text-base-content/60 bg-transparent';
			const labelColor = getComputedStyle(el).color;
			el.remove();

			localChart = new Chart(canvas, {
				type: 'line',
				data: {
					labels: points.map((p) =>
						new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
					),
					datasets: [
						{
							label: '',
							data: points.map((p) => p.uniqueUsersPresent),
							borderColor: primaryColor,
							backgroundColor: primaryColor.replace('rgb', 'rgba').replace(')', ', 0.1)'),
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
								label: (ctx) => ` ${ctx.parsed.y} present`
							}
						}
					},
					scales: {
						x: {
							grid: { color: gridColor },
							ticks: { color: labelColor }
						},
						y: {
							grid: { color: gridColor },
							ticks: { color: labelColor, precision: 0 },
							beginAtZero: true
						}
					}
				}
			});
		})();

		return () => {
			destroyed = true;
			localChart?.destroy();
		};
	});

	onDestroy(() => {});
</script>

{#if points.length === 0}
	<p class="text-base-content/50 py-8 text-center text-sm">No attendance data yet.</p>
{:else}
	<div style="height:{Math.max(180, Math.min(points.length * 30, 280))}px">
		<canvas bind:this={canvas}></canvas>
	</div>
{/if}
