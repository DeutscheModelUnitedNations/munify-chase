<script lang="ts">
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

	// Mission control's rotation destroys and recreates this component every
	// time its tile cycles out and back in — a fresh Chart instance each time
	// is intentional here, matching how the statistics page's own charts work.
	$effect(() => {
		if (typeof window === 'undefined' || !canvas || slices.length === 0) return;

		const labels = slices.map((s) => s.label);
		const data = slices.map((s) => s.value);
		const colors = slices.map((_, i) => PALETTE[i % PALETTE.length]);
		const valueLabels = slices.map((s) => s.valueLabel ?? String(s.value));

		let localChart: import('chart.js').Chart | undefined;
		let destroyed = false;

		import('chart.js/auto').then(({ default: Chart }) => {
			if (destroyed || !canvas) return;

			const baseContent = resolveClass('text-base-content', 'color');
			const base100 = resolveClass('bg-base-100', 'backgroundColor');
			const gridColor = resolveClass('border-base-content/10', 'borderColor');

			if (kind === 'bar') {
				localChart = new Chart(canvas, {
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
							tooltip: { callbacks: { label: (item) => ` ${valueLabels[item.dataIndex]}` } }
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
				return;
			}

			localChart = new Chart(canvas, {
				type: kind,
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
					cutout: kind === 'doughnut' ? '60%' : 0,
					scales:
						kind === 'polarArea'
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
						tooltip: {
							callbacks: {
								label: (item) => ` ${valueLabels[item.dataIndex]}`
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

<div class="min-h-0 w-full flex-1 overflow-hidden" style="position: relative">
	<canvas bind:this={canvas}></canvas>
</div>
