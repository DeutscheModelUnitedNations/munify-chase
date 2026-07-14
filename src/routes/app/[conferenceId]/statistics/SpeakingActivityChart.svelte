<script lang="ts">
	import { onDestroy } from 'svelte';

	export interface TimelineBucket {
		bucket: string;
		totalSeconds: number;
	}

	interface Props {
		buckets: TimelineBucket[];
	}
	let { buckets }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		if (typeof window === 'undefined' || !canvas || buckets.length === 0) return;
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
					labels: buckets.map((b, i) => {
						const d = new Date(b.bucket);
						const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
						const isNewDay =
							i === 0 || new Date(buckets[i - 1].bucket).toDateString() !== d.toDateString();
						if (isNewDay) {
							const date = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
							return `${date} ${time}`;
						}
						return time;
					}),
					datasets: [
						{
							label: '',
							data: buckets.map((b) => Math.round(b.totalSeconds / 60)),
							borderColor: primaryColor,
							backgroundColor: primaryColor.replace('rgb', 'rgba').replace(')', ', 0.12)'),
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
								label: (ctx) => {
									const mins = ctx.parsed.y ?? 0;
									const h = Math.floor(mins / 60);
									const m = mins % 60;
									return h > 0
										? ` ${h}h ${String(m).padStart(2, '0')}m speaking`
										: ` ${m}m speaking`;
								}
							}
						}
					},
					scales: {
						x: {
							grid: { color: gridColor },
							ticks: {
								color: labelColor,
								maxTicksLimit: 12,
								maxRotation: 45
							}
						},
						y: {
							grid: { color: gridColor },
							ticks: {
								color: labelColor,
								callback: (v) => `${v}m`
							},
							beginAtZero: true,
							title: {
								display: true,
								text: 'Speaking time (min)',
								color: labelColor
							}
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

{#if buckets.length === 0}
	<p class="text-base-content/50 py-8 text-center text-sm">No speaking data yet.</p>
{:else}
	<div style="height:260px">
		<canvas bind:this={canvas}></canvas>
	</div>
{/if}
