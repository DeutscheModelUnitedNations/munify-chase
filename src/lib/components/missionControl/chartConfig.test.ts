import { describe, expect, it } from 'vitest';
import { chartConfig, type MissionControlChartKind } from './chartConfig';

const input = (kind: MissionControlChartKind) => ({
	kind,
	labels: ['a'],
	data: [1],
	colors: ['#000'],
	theme: { baseContent: 'black', base100: 'white', gridColor: 'grey' },
	tooltipLabel: () => 'x'
});

describe('chartConfig', () => {
	it('draws bars horizontally without a legend', () => {
		const config = chartConfig(input('bar'));
		expect(config.type).toBe('bar');
		expect(config.options).toMatchObject({
			indexAxis: 'y',
			plugins: { legend: { display: false } }
		});
	});

	it('cuts out the doughnut only', () => {
		expect(chartConfig(input('doughnut')).options).toMatchObject({ cutout: '60%' });
		expect(chartConfig(input('pie')).options).toMatchObject({ cutout: 0, scales: undefined });
	});

	it('gives the polar area a radial grid', () => {
		const config = chartConfig(input('polarArea'));
		expect(config.type).toBe('polarArea');
		expect(config.options).toMatchObject({ scales: { r: { grid: { color: 'grey' } } } });
	});
});
