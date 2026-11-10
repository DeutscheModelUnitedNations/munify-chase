import { describe, expect, it } from 'vitest';
import { m } from '#lib/paraglide/messages';
import { formatRequestTime, historyStatusBadge } from './requestQueue';

describe('formatRequestTime', () => {
	it('formats strings and dates the same way', () => {
		const date = new Date(2026, 0, 1, 9, 5);
		expect(formatRequestTime(date.toISOString())).toBe(formatRequestTime(date));
		expect(formatRequestTime(date)).toMatch(/0?9.05/);
	});
});

describe('historyStatusBadge', () => {
	it('greys out withdrawn requests', () => {
		expect(historyStatusBadge('WITHDRAWN')).toEqual({
			badgeClass: 'badge-ghost',
			label: m.withdrawn()
		});
	});

	it('marks everything else resolved', () => {
		expect(historyStatusBadge('RESOLVED')).toEqual({
			badgeClass: 'badge-success',
			label: m.resolved()
		});
		expect(historyStatusBadge(undefined).badgeClass).toBe('badge-success');
	});
});
