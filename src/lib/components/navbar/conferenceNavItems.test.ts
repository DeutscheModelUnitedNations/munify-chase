import { beforeEach, describe, expect, it, vi } from 'vitest';

const demo = vi.hoisted(() => ({ active: false }));
vi.mock('#lib/state/localDemo.svelte', () => ({
	isLocalConferenceActive: () => demo.active
}));

import { buildConferenceNavItems, roleBadgeClassFor, roleLabelFor } from './conferenceNavItems';

const keys = (items: { key: string }[]) => items.map((i) => i.key);
const active = (items: { key: string; active: boolean }[]) =>
	items.filter((i) => i.active).map((i) => i.key);

beforeEach(() => {
	demo.active = false;
});

describe('buildConferenceNavItems', () => {
	it('gives admins every page', () => {
		const items = buildConferenceNavItems({ role: 'ADMIN', conferenceId: 'c' });
		expect(keys(items)).toEqual(['mission-control', 'attendance', 'statistics', 'configuration']);
		expect(items[0].href).toBe('/app/c/mission-control');
	});

	it('treats a global admin as admin', () => {
		const items = buildConferenceNavItems({ role: null, conferenceId: 'c', isGlobalAdmin: true });
		expect(keys(items)).toContain('configuration');
	});

	it('gives the team no configuration', () => {
		const items = buildConferenceNavItems({ role: 'TEAM', conferenceId: 'c' });
		expect(keys(items)).toEqual(['mission-control', 'attendance', 'statistics']);
	});

	it('gives participants the statistics only', () => {
		expect(keys(buildConferenceNavItems({ role: 'DELEGATE', conferenceId: 'c' }))).toEqual([
			'statistics'
		]);
		expect(keys(buildConferenceNavItems({ role: 'SPECTATOR', conferenceId: 'c' }))).toEqual([]);
	});

	it('leaves out the live-data pages in the offline demo', () => {
		demo.active = true;
		expect(keys(buildConferenceNavItems({ role: 'ADMIN', conferenceId: 'c' }))).toEqual([
			'mission-control',
			'configuration'
		]);
		expect(keys(buildConferenceNavItems({ role: 'NON_STATE_ACTOR', conferenceId: 'c' }))).toEqual(
			[]
		);
	});

	it('marks the configuration, not mission control, on the config page', () => {
		const items = buildConferenceNavItems({
			role: 'ADMIN',
			conferenceId: 'c',
			activeRouteId: '/app/[conferenceId]/mission-control/config'
		});
		expect(active(items)).toEqual(['configuration']);
	});

	it('marks a page by route id or pathname, on whole segments only', () => {
		expect(
			active(
				buildConferenceNavItems({
					role: 'ADMIN',
					conferenceId: 'c',
					activePathname: '/app/c/mission-control'
				})
			)
		).toEqual(['mission-control']);
		expect(
			active(
				buildConferenceNavItems({
					role: 'ADMIN',
					conferenceId: 'c',
					activePathname: '/app/c/statistics-old/x/statistics/y'
				})
			)
		).toEqual(['statistics']);
		expect(
			active(
				buildConferenceNavItems({
					role: 'ADMIN',
					conferenceId: 'c',
					activePathname: '/app/c/attendancex'
				})
			)
		).toEqual([]);
	});
});

describe('role labels', () => {
	it('names every role', () => {
		for (const role of ['ADMIN', 'TEAM', 'DELEGATE', 'NON_STATE_ACTOR', 'SPECTATOR'] as const) {
			expect(roleLabelFor(role)).toBeTruthy();
		}
		expect(roleLabelFor(null)).toBeUndefined();
	});

	it('colours the team roles', () => {
		expect(roleBadgeClassFor('ADMIN')).toBe('badge-primary');
		expect(roleBadgeClassFor('TEAM')).toBe('badge-secondary');
		expect(roleBadgeClassFor('DELEGATE')).toBe('badge-ghost');
	});
});
