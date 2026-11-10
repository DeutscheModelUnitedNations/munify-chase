import { describe, expect, it } from 'vitest';
import { badgeFor, deriveStatus, formatDateRange } from './launcher';

const conference = { startDate: '2026-03-10T12:00:00', endDate: '2026-03-13T12:00:00' };

describe('deriveStatus', () => {
	it('is upcoming before the start and without dates', () => {
		expect(deriveStatus(conference, new Date('2026-03-01T12:00:00'))).toBe('upcoming');
		expect(deriveStatus({ startDate: null, endDate: conference.endDate })).toBe('upcoming');
	});

	it('is active through the whole last day', () => {
		expect(deriveStatus(conference, new Date('2026-03-13T23:30:00'))).toBe('active');
	});

	it('is past after the last day', () => {
		expect(deriveStatus(conference, new Date('2026-03-14T00:30:00'))).toBe('past');
	});
});

describe('badgeFor', () => {
	it('maps conference user types to launcher badges', () => {
		expect(badgeFor('ADMIN')).toBe('ADMIN');
		expect(badgeFor('TEAM')).toBe('CHAIR');
		expect(badgeFor('SPECTATOR')).toBe('SPECTATOR');
		expect(badgeFor('NON_STATE_ACTOR')).toBe('DELEGATE');
		expect(badgeFor('DELEGATE')).toBe('DELEGATE');
	});
});

describe('formatDateRange', () => {
	it('names the month once within a month', () => {
		expect(formatDateRange(conference, 'en')).toBe('10.–13. Mar 2026');
	});

	it('names both months within a year', () => {
		expect(
			formatDateRange({ startDate: '2026-03-30T12:00:00', endDate: '2026-04-02T12:00:00' }, 'en')
		).toBe('30. Mar – 02. Apr 2026');
	});

	it('names both years across a new year', () => {
		expect(
			formatDateRange({ startDate: '2026-12-30T12:00:00', endDate: '2027-01-02T12:00:00' }, 'en')
		).toBe('30. Dec 2026 – 02. Jan 2027');
	});

	it('is empty for missing or invalid dates', () => {
		expect(formatDateRange({ startDate: conference.startDate }, 'en')).toBe('');
		expect(formatDateRange({ startDate: 'soon', endDate: conference.endDate }, 'en')).toBe('');
	});
});
