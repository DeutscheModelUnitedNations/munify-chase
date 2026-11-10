import { describe, expect, it } from 'vitest';
import {
	amendmentStatusLabel,
	chartTypeFor,
	fmtDuration,
	paperStatusLabel,
	percentOf,
	representationTypeLabel,
	shuffled
} from './missionControlFormat';

describe('fmtDuration', () => {
	it('shows minutes, and hours once there are some', () => {
		expect(fmtDuration(59)).toBe('0m');
		expect(fmtDuration(125)).toBe('2m');
		expect(fmtDuration(3600 + 5 * 60)).toBe('1h 05m');
	});
});

describe('percentOf', () => {
	it('is 0 for an empty total', () => {
		expect(percentOf(3, 0)).toBe(0);
		expect(percentOf(1, 4)).toBe(25);
	});
});

describe('labels', () => {
	it('translates known values and passes unknown ones through', () => {
		expect(paperStatusLabel('FINAL')).not.toBe('FINAL');
		expect(paperStatusLabel('ODD')).toBe('ODD');
		expect(representationTypeLabel('NSA')).not.toBe('NSA');
		expect(representationTypeLabel('toString')).toBe('toString');
		expect(amendmentStatusLabel('WITHDRAWN')).not.toBe('WITHDRAWN');
		expect(amendmentStatusLabel('ODD')).toBe('ODD');
	});
});

describe('shuffled', () => {
	it('keeps every item and depends only on the seed', () => {
		const items = [1, 2, 3, 4, 5, 6];
		const a = shuffled(items, 3);
		expect(a.toSorted()).toEqual(items);
		expect(shuffled(items, 3)).toEqual(a);
		expect(items).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('handles a negative seed', () => {
		expect(shuffled([1, 2], -5)).toHaveLength(2);
	});
});

describe('chartTypeFor', () => {
	it('picks from the pool of the tile kind and rotates with the tick', () => {
		const first = chartTypeFor({ kind: 'resolutionFunnel', key: 'k', tick: 0 });
		const pool = ['bar', 'doughnut', 'polarArea'];
		expect(pool).toContain(first);
		expect(chartTypeFor({ kind: 'resolutionFunnel', key: 'k', tick: 1 })).not.toBe(first);
		expect(chartTypeFor({ kind: 'other', key: 'k', tick: 7 })).toBe('doughnut');
	});
});
