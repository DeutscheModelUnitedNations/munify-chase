import { describe, expect, test } from 'vitest';
import type { LauncherConference } from '#lib/components/launcher/types';
import {
	conferenceHref,
	greetingSuffix,
	groupByStatus,
	launcherHeadingKind,
	roleDetail,
	searchConferences,
	toAdminConference,
	toIsoDate,
	toUserConference,
	type LauncherConferenceUser
} from './launcherConferences';

const conference = {
	id: 'c1',
	title: 'Model UN',
	location: 'Berlin',
	startDate: new Date('2026-03-01T12:00:00Z'),
	endDate: '2026-03-04',
	committees: [{ abbreviation: 'GA' }]
};

describe('conferenceHref', () => {
	test('sends the team to mission control', () => {
		expect(conferenceHref('ADMIN', 'c1')).toBe('/app/c1/mission-control');
		expect(conferenceHref('TEAM', 'c1')).toBe('/app/c1/mission-control');
	});

	test('sends a seated delegate to their committee, everyone else to the participant view', () => {
		expect(conferenceHref('DELEGATE', 'c1', { committeeId: 'k1' })).toBe('/app/c1/participant/k1');
		expect(conferenceHref('DELEGATE', 'c1', null)).toBe('/app/c1/participant');
		expect(conferenceHref('SPECTATOR', 'c1')).toBe('/app/c1/participant');
	});
});

describe('roleDetail', () => {
	test('names the representation and committee of delegates and NSAs', () => {
		expect(roleDetail('DELEGATE', 'France', 'GA')).toBe('France · GA');
		expect(roleDetail('NON_STATE_ACTOR', 'Amnesty', null)).toBe('Amnesty');
		expect(roleDetail('DELEGATE', null, undefined)).toBeNull();
	});

	test("names a chair's committee, nothing for others", () => {
		expect(roleDetail('TEAM', null, 'SC')).toBe('SC');
		expect(roleDetail('TEAM', null, '')).toBeNull();
		expect(roleDetail('ADMIN', 'x', 'y')).toBeNull();
	});
});

describe('toIsoDate', () => {
	test('keeps strings, shortens dates and passes empty values as null', () => {
		expect(toIsoDate('2026-01-02')).toBe('2026-01-02');
		expect(toIsoDate(new Date('2026-01-02T10:00:00Z'))).toBe('2026-01-02');
		expect(toIsoDate(null)).toBeNull();
		expect(toIsoDate(undefined)).toBeNull();
	});
});

describe('toUserConference', () => {
	test('builds a delegate entry from the committee seat', () => {
		const cu: LauncherConferenceUser = {
			conferenceUserType: 'DELEGATE',
			committeeMember: {
				committeeId: 'k1',
				committee: { abbreviation: 'GA' },
				representation: { type: 'DELEGATION', name: 'France', alpha3Code: 'FRA' }
			},
			conferenceMember: null,
			conference
		};
		expect(toUserConference(cu)).toEqual({
			id: 'c1',
			title: 'Model UN',
			location: 'Berlin',
			startDate: '2026-03-01',
			endDate: '2026-03-04',
			committees: [{ abbreviation: 'GA' }],
			role: 'DELEGATE',
			roleDetail: 'France · GA',
			representation: { type: 'DELEGATION', name: 'France', alpha3Code: 'FRA' },
			href: '/app/c1/participant/k1',
			committeeId: 'k1'
		});
	});

	test('prefers the conference seat of an NSA and works without committees', () => {
		const result = toUserConference({
			conferenceUserType: 'NON_STATE_ACTOR',
			conferenceMember: { representation: { type: 'NSA', name: 'Amnesty' } },
			conference: { id: 'c2', title: 'Other', committees: null }
		});
		expect(result).toMatchObject({
			role: 'DELEGATE',
			roleDetail: 'Amnesty',
			representation: { name: 'Amnesty' },
			committees: [],
			href: '/app/c2/participant',
			committeeId: null
		});
	});
});

describe('toAdminConference', () => {
	test('opens every conference in mission control', () => {
		expect(toAdminConference({ ...conference, committees: undefined })).toEqual({
			id: 'c1',
			title: 'Model UN',
			location: 'Berlin',
			startDate: '2026-03-01',
			endDate: '2026-03-04',
			committees: [],
			role: 'ADMIN',
			roleDetail: null,
			representation: null,
			href: '/app/c1/mission-control'
		});
	});
});

function entry(id: string, startDate?: string | null, endDate?: string | null, location?: string) {
	return {
		id,
		title: `Conf ${id}`,
		location,
		startDate,
		endDate,
		committees: [],
		role: 'ADMIN',
		href: ''
	} satisfies LauncherConference;
}

describe('searchConferences', () => {
	const list = [entry('a', null, null, 'Berlin'), entry('b')];

	test('returns all for an empty search', () => {
		expect(searchConferences(list, '  ')).toBe(list);
	});

	test('matches title or location ignoring case', () => {
		expect(searchConferences(list, 'BERLIN').map((c) => c.id)).toEqual(['a']);
		expect(searchConferences(list, 'conf b').map((c) => c.id)).toEqual(['b']);
	});
});

describe('groupByStatus', () => {
	test('splits by status and sorts each group', () => {
		const now = new Date('2026-06-15T12:00:00Z');
		const groups = groupByStatus(
			[
				entry('past-old', '2025-01-01', '2025-01-03'),
				entry('active-late', '2026-06-10', '2026-06-30'),
				entry('upcoming-late', '2026-09-01', '2026-09-03'),
				entry('past-new', '2026-05-01', '2026-05-03'),
				entry('active-soon', '2026-06-14', '2026-06-16'),
				entry('upcoming-soon', '2026-07-01', '2026-07-03'),
				entry('undated')
			],
			now
		);
		expect(groups.active.map((c) => c.id)).toEqual(['active-soon', 'active-late']);
		expect(groups.upcoming.map((c) => c.id)).toEqual(['undated', 'upcoming-soon', 'upcoming-late']);
		expect(groups.past.map((c) => c.id)).toEqual(['past-new', 'past-old']);
	});
});

describe('heading and greeting', () => {
	test('picks the heading by role and count', () => {
		expect(launcherHeadingKind(true, 1)).toBe('all');
		expect(launcherHeadingKind(false, 1)).toBe('one');
		expect(launcherHeadingKind(false, 3)).toBe('many');
	});

	test('adds the first name when there is one', () => {
		expect(greetingSuffix('Ada')).toBe(', Ada');
		expect(greetingSuffix(null)).toBe('');
		expect(greetingSuffix('')).toBe('');
	});
});
