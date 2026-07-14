<script lang="ts">
	export interface CommitteeBar {
		id: string;
		name: string | null;
		abbreviation: string | null;
		present: number;
		total: number;
	}

	let { committees }: { committees: CommitteeBar[] } = $props();

	let canvas = $state<HTMLCanvasElement | undefined>();

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
		if (typeof window === 'undefined' || !canvas) return;

		const sorted = [...committees].sort((a, b) => a.total - a.present - (b.total - b.present));
		const labels = sorted.map((c) => c.abbreviation ?? c.name ?? c.id);
		const presentData = sorted.map((c) => c.present);
		const absentData = sorted.map((c) => Math.max(0, c.total - c.present));

		let localChart: import('chart.js').Chart | undefined;
		let destroyed = false;

		import('chart.js/auto').then(({ default: Chart }) => {
			if (destroyed || !canvas) return;

			const primaryColor = resolveClass('bg-primary', 'backgroundColor');
			const base200 = resolveClass('bg-base-200', 'backgroundColor');
			const baseContent = resolveClass('text-base-content', 'color');
			const base300 = resolveClass('bg-base-300', 'backgroundColor');

			localChart = new Chart(canvas!, {
				type: 'bar',
				data: {
					labels,
					datasets: [
						{
							label: 'Present',
							data: presentData,
							backgroundColor: primaryColor,
							borderRadius: 4,
							borderSkipped: false
						},
						{
							label: 'Absent',
							data: absentData,
							backgroundColor: base200,
							borderRadius: 4,
							borderSkipped: false
						}
					]
				},
				options: {
					indexAxis: 'y',
					animation: false,
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: true,
							labels: { color: baseContent, boxWidth: 12, padding: 16 }
						},
						tooltip: {
							callbacks: {
								footer: (items) => {
									const c = sorted[items[0].dataIndex];
									if (!c || c.total === 0) return '';
									return `${Math.round((c.present / c.total) * 100)}% present`;
								}
							}
						}
					},
					scales: {
						x: {
							stacked: true,
							ticks: { color: baseContent, stepSize: 1 },
							grid: { color: base300 }
						},
						y: {
							stacked: true,
							ticks: { color: baseContent },
							grid: { display: false }
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

	let chartHeight = $derived(Math.max(180, committees.length * 44));
</script>

<div style="position: relative; height: {chartHeight}px;">
	<canvas bind:this={canvas}></canvas>
</div>
