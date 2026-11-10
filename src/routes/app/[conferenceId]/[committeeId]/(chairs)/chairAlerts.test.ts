import { describe, expect, it } from 'vitest';
import { alertTick, isDockItemActive, requestToastChanges } from './chairAlerts';

const quiet = { status: false, speakersList: false, commentList: false };

describe('alertTick', () => {
	it('alerts once when the status runs out and rearms afterwards', () => {
		const first = alertTick({ state: quiet, statusExpired: true, lists: [] });
		expect(first.alerts).toEqual(['statusExpired']);
		const second = alertTick({ state: first.state, statusExpired: true, lists: [] });
		expect(second.alerts).toEqual([]);
		const rearmed = alertTick({ state: second.state, statusExpired: false, lists: [] });
		expect(rearmed.state.status).toBe(false);
	});

	it('alerts once per overtime list', () => {
		const lists = [{ type: 'SPEAKERS_LIST', overtime: true }];
		const first = alertTick({ state: quiet, statusExpired: false, lists });
		expect(first.alerts).toEqual(['listOvertime']);
		expect(first.state.speakersList).toBe(true);
		expect(alertTick({ state: first.state, statusExpired: false, lists }).alerts).toEqual([]);
		const back = alertTick({
			state: first.state,
			statusExpired: false,
			lists: [{ type: 'SPEAKERS_LIST', overtime: false }]
		});
		expect(back.state.speakersList).toBe(false);
	});

	it('does not alert for a second list while the first one is alerted', () => {
		const tick = alertTick({
			state: quiet,
			statusExpired: false,
			lists: [
				{ type: 'SPEAKERS_LIST', overtime: true },
				{ type: 'COMMENT_LIST', overtime: true }
			]
		});
		expect(tick.alerts).toEqual(['listOvertime']);
		expect(tick.state).toEqual({ status: false, speakersList: true, commentList: false });
	});

	it('alerts for lists of other types without remembering them', () => {
		const tick = alertTick({
			state: quiet,
			statusExpired: false,
			lists: [{ type: 'X', overtime: true }]
		});
		expect(tick.alerts).toEqual(['listOvertime']);
		expect(tick.state).toEqual(quiet);
		const calm = alertTick({
			state: quiet,
			statusExpired: false,
			lists: [{ type: 'X', overtime: false }]
		});
		expect(calm.state).toEqual(quiet);
	});
});

describe('requestToastChanges', () => {
	it('shows new requests and closes the toasts of gone ones', () => {
		const changes = requestToastChanges({
			pending: [{ id: 'a' }, { id: 'b' }],
			notified: new Set(['a', 'c']),
			open: new Map([
				['a', 't1'],
				['c', 't3']
			])
		});
		expect(changes.show).toEqual([{ id: 'b' }]);
		expect(changes.dismiss).toEqual([['c', 't3']]);
	});
});

describe('isDockItemActive', () => {
	const base = { routeId: '/app/[c]/[k]/(chairs)/resolutions/[paperId]', pathname: '/x/p1' };

	it('follows the route', () => {
		expect(isDockItemActive({ ...base, key: 'voting', activeDraftResolutionId: null })).toBe(false);
		expect(isDockItemActive({ ...base, key: 'resolutions', activeDraftResolutionId: null })).toBe(
			true
		);
		expect(
			isDockItemActive({
				key: 'voting',
				routeId: null,
				pathname: '/',
				activeDraftResolutionId: null
			})
		).toBe(false);
	});

	it('hands the resolutions entry to the active draft while it is open', () => {
		expect(isDockItemActive({ ...base, key: 'resolutions', activeDraftResolutionId: 'p1' })).toBe(
			false
		);
		expect(isDockItemActive({ ...base, key: 'resolutions', activeDraftResolutionId: 'p2' })).toBe(
			true
		);
	});
});
