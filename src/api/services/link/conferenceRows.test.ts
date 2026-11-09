import { describe, expect, it } from 'vitest';
import {
	conferenceChange,
	openConferences,
	sameConference,
	tablesToAskAgain,
	type ConferenceRow
} from './conferenceRows';

const row = (overrides: Partial<ConferenceRow> = {}): ConferenceRow => ({
	id: 'c1',
	title: 'MUN',
	location: 'Berlin',
	startConference: new Date('2026-03-01T00:00:00Z'),
	endConference: new Date('2026-03-04T00:00:00Z'),
	state: 'ACTIVE',
	assignmentReleased: true,
	...overrides
});

describe('openConferences', () => {
	it('leaves out conferences that have ended', () => {
		const open = openConferences([row(), row({ id: 'c2', state: 'POST' })]);
		expect([...open.keys()]).toEqual(['c1']);
	});

	it('keeps only the mirrored fields', () => {
		const extra = { ...row(), __typename: 'Conference' };
		expect(openConferences([extra]).get('c1')).toEqual(row());
	});
});

describe('sameConference', () => {
	it('is the same for equal fields, also when dates are new objects', () => {
		expect(sameConference(row(), row({ startConference: new Date('2026-03-01T00:00:00Z') }))).toBe(
			true
		);
	});

	it('treats a missing location like none', () => {
		expect(sameConference(row({ location: undefined }), row({ location: null }))).toBe(true);
	});

	it.each([
		['title', { title: 'Other' }],
		['location', { location: 'Bonn' }],
		['start', { startConference: new Date('2026-03-02T00:00:00Z') }],
		['end', { endConference: new Date('2026-03-05T00:00:00Z') }],
		['state', { state: 'PREPARATION' }],
		['release', { assignmentReleased: false }]
	])('differs when the %s changes', (_name, overrides) => {
		expect(sameConference(row(), row(overrides))).toBe(false);
	});
});

describe('conferenceChange', () => {
	it('writes a conference seen for the first time', () => {
		expect(conferenceChange({ before: undefined, row: row() })).toEqual({
			refresh: false,
			write: true
		});
	});

	it('does nothing when nothing changed', () => {
		expect(conferenceChange({ before: row(), row: row() })).toEqual({
			refresh: false,
			write: false
		});
	});

	it('reads the tables again and writes when the release changes', () => {
		expect(conferenceChange({ before: row(), row: row({ assignmentReleased: false }) })).toEqual({
			refresh: true,
			write: true
		});
	});
});

describe('tablesToAskAgain', () => {
	const none = { users: [], participants: [], delegations: [] };

	it('asks nothing when nothing is missing', () => {
		const { stale, stillMissing } = tablesToAskAgain({ missing: none, asked: new Set() });
		expect(stale).toEqual([]);
		expect(stillMissing.size).toBe(0);
	});

	it('asks a table again for a newly missing id', () => {
		const { stale, stillMissing } = tablesToAskAgain({
			missing: { ...none, users: ['u1'], delegations: ['d1'] },
			asked: new Set()
		});
		expect(stale).toEqual(['users', 'delegations']);
		expect([...stillMissing]).toEqual(['u1', 'd1']);
	});

	it('does not ask again for what it asked for last time', () => {
		const { stale, stillMissing } = tablesToAskAgain({
			missing: { ...none, participants: ['p1'] },
			asked: new Set(['p1'])
		});
		expect(stale).toEqual([]);
		expect([...stillMissing]).toEqual(['p1']);
	});
});
