<script lang="ts">
	export interface NsaSlice {
		name: string;
		count: number;
	}

	let { distribution }: { distribution: NsaSlice[] } = $props();

	let canvas = $state<HTMLCanvasElement | undefined>();

	const PALETTE = [
		'#6366f1',
		'#8b5cf6',
		'#ec4899',
		'#f97316',
		'#eab308',
		'#22c55e',
		'#14b8a6',
		'#3b82f6',
		'#f43f5e',
		'#a855f7'
	];

	function resolveClass(cls: string, prop: 'backgroundColor' | 'color'): string {
		const el = Object.assign(document.createElement('div'), {
			className: cls,
			style: 'position:absolute;visibility:hidden'
		});
		document.body.appendChild(el);
		const v = getComputedStyle(el)[prop];
		el.remove();
		return v;
	}

	$effect(() => {
		if (typeof window === 'undefined' || !canvas || distribution.length === 0) return;

		const labels = distribution.map((d) => d.name);
		const data = distribution.map((d) => d.count);
		const colors = distribution.map((_, i) => PALETTE[i % PALETTE.length]);

		let localChart: import('chart.js').Chart | undefined;
		let destroyed = false;

		import('chart.js/auto').then(({ default: Chart }) => {
			if (destroyed || !canvas) return;

			const baseContent = resolveClass('text-base-content', 'color');
			const base200 = resolveClass('bg-base-200', 'backgroundColor');

			localChart = new Chart(canvas!, {
				type: 'doughnut',
				data: {
					labels,
					datasets: [
						{
							data,
							backgroundColor: colors,
							borderColor: base200,
							borderWidth: 3,
							hoverOffset: 6
						}
					]
				},
				options: {
					animation: false,
					responsive: true,
					maintainAspectRatio: true,
					cutout: '62%',
					plugins: {
						legend: {
							position: 'bottom',
							labels: {
								color: baseContent,
								boxWidth: 12,
								padding: 10,
								font: { size: 12 }
							}
						},
						tooltip: {
							callbacks: {
								label: (item) => {
									const total = data.reduce((s, v) => s + v, 0);
									const pct = total > 0 ? Math.round(((item.raw as number) / total) * 100) : 0;
									return ` ${item.raw} NSAs (${pct}%)`;
								}
							}
						}
					}
				}
			});
		});

		return () => {
			destroyed = true;
			localChart?.destroy();
		};
	});
</script>

{#if distribution.length > 0}
	<canvas bind:this={canvas}></canvas>
{:else}
	<div class="text-base-content/40 flex h-40 items-center justify-center text-sm">
		No NSA check-ins yet
	</div>
{/if}
