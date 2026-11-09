import type { ChartConfiguration } from 'chart.js';

export type MissionControlChartKind = 'doughnut' | 'pie' | 'polarArea' | 'bar';

export interface ChartTheme {
	baseContent: string;
	base100: string;
	gridColor: string;
}

interface ChartInput {
	kind: MissionControlChartKind;
	labels: string[];
	data: number[];
	colors: string[];
	theme: ChartTheme;
	tooltipLabel: (item: { dataIndex: number }) => string;
}

type RadialKind = Exclude<MissionControlChartKind, 'bar'>;

function barConfig({
	labels,
	data,
	colors,
	theme,
	tooltipLabel
}: ChartInput): ChartConfiguration<'bar'> {
	return {
		type: 'bar',
		data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 4 }] },
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
					ticks: { color: theme.baseContent, font: { size: 13 } },
					grid: { color: theme.gridColor }
				},
				y: {
					ticks: { color: theme.baseContent, font: { size: 15, weight: 'bold' } },
					grid: { display: false }
				}
			}
		}
	};
}

function radialConfig({
	kind,
	labels,
	data,
	colors,
	theme,
	tooltipLabel
}: ChartInput & { kind: RadialKind }): ChartConfiguration<RadialKind> {
	return {
		type: kind,
		data: {
			labels,
			datasets: [
				{
					data,
					backgroundColor: colors,
					borderColor: theme.base100,
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
								grid: { color: theme.gridColor },
								angleLines: { color: theme.gridColor }
							}
						}
					: undefined,
			plugins: {
				legend: {
					position: 'bottom',
					labels: { color: theme.baseContent, boxWidth: 14, padding: 10, font: { size: 15 } }
				},
				tooltip: { callbacks: { label: tooltipLabel } }
			}
		}
	};
}

/** The Chart.js configuration for one mission control chart. */
export function chartConfig(
	input: ChartInput
): ChartConfiguration<'bar'> | ChartConfiguration<RadialKind> {
	const { kind } = input;
	return kind === 'bar' ? barConfig(input) : radialConfig({ ...input, kind });
}
