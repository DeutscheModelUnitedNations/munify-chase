import { describe, expect, it } from 'vitest';
import {
	absentDelegatesByCommittee,
	csvEscape,
	delegateStat,
	delegateTotals,
	elapsedSince,
	groupNsaUsersByOrg,
	isDraftComplete,
	isStaleCheckIn,
	latestEventByUser,
	nsaSheetFileName,
	nsaSheetRows,
	nsasNotCheckedIn,
	presenceBadgeClass,
	presenceEventDraft,
	presentEventsByCommittee,
	toCsv,
	toLocalInput
} from './attendance';

const ev = (id: string, uid: string | null, present: boolean, committeeId = 'c1') => ({
	id,
	present,
	committeeId,
	conferenceUser: uid ? { id: uid } : null
});

const user = (id: string, name: string | null, rep?: { id: string; name: string }) => ({
	id,
	name,
	userEmail: `${id}@x.org`,
	conferenceMember: rep ? { representation: { ...rep, icon: 'globe' } } : null
});

describe('latestEventByUser', () => {
	it('keeps the first (newest) event per user and skips events without one', () => {
		const map = latestEventByUser([ev('1', 'a', true), ev('2', 'a', false), ev('3', null, true)]);
		expect([...map.keys()]).toEqual(['a']);
		expect(map.get('a')?.id).toBe('1');
		expect(latestEventByUser(undefined).size).toBe(0);
	});
});

describe('presentEventsByCommittee', () => {
	it('lists users whose latest event is a check-in, by committee', () => {
		const map = presentEventsByCommittee([
			ev('1', 'a', true, 'c1'),
			ev('2', 'b', false, 'c1'),
			ev('3', 'b', true, 'c2'),
			ev('4', 'c', true, 'c1')
		]);
		expect(map.get('c1')?.map((e) => e.id)).toEqual(['1', '4']);
		expect(map.has('c2')).toBe(false);
		expect(presentEventsByCommittee(null).size).toBe(0);
	});
});

describe('groupNsaUsersByOrg', () => {
	it('groups by organisation, unknown ones together, sorted by name', () => {
		const groups = groupNsaUsersByOrg({
			users: [
				user('1', 'A', { id: 'o2', name: 'Zeta' }),
				user('2', 'B', { id: 'o1', name: 'Alpha' }),
				user('3', 'C', { id: 'o2', name: 'Zeta' }),
				user('4', 'D')
			],
			unknownName: 'Unknown'
		});
		expect(groups.map((g) => [g.name, g.users.length, g.icon])).toEqual([
			['Alpha', 1, 'globe'],
			['Unknown', 1, null],
			['Zeta', 2, 'globe']
		]);
		expect(groupNsaUsersByOrg({ users: undefined, unknownName: '?' })).toEqual([]);
	});
});

describe('csv', () => {
	it('quotes values with separators, quotes and line breaks', () => {
		expect(csvEscape('plain')).toBe('plain');
		expect(csvEscape('a;b')).toBe('"a;b"');
		expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
		expect(csvEscape('a\nb')).toBe('"a\nb"');
	});

	it('joins rows with semicolons and CRLF', () => {
		expect(
			toCsv([
				['a', 'b'],
				['c', 'd;e']
			])
		).toBe('a;b\r\nc;"d;e"\r\n');
	});

	it('lists every NSA with the committee they are in', () => {
		const orgs = groupNsaUsersByOrg({
			users: [user('1', 'A', { id: 'o', name: 'Org' }), user('2', null, { id: 'o', name: 'Org' })],
			unknownName: '?'
		});
		const rows = nsaSheetRows({
			orgs,
			latestByUser: new Map([
				['1', { present: true, committeeId: 'c1' }],
				['2', { present: false, committeeId: 'c1' }]
			]),
			committeeNames: new Map([['c1', 'GA']])
		});
		expect(rows).toEqual([
			['id', 'name', 'email', 'organization', 'currently_in_committee'],
			['1', 'A', '1@x.org', 'Org', 'GA'],
			['2', '', '2@x.org', 'Org', '']
		]);
		const unknownCommittee = nsaSheetRows({
			orgs,
			latestByUser: new Map([['1', { present: true, committeeId: 'gone' }]]),
			committeeNames: new Map()
		});
		expect(unknownCommittee[1][4]).toBe('');
	});

	it('names the file after the conference and day', () => {
		const date = new Date('2026-03-04T10:00:00Z');
		expect(nsaSheetFileName({ title: 'MUN Berlin 2026!', date })).toBe(
			'nsa-laufzettel-mun-berlin-2026--2026-03-04.csv'
		);
		expect(nsaSheetFileName({ title: null, date })).toBe(
			'nsa-laufzettel-conference-2026-03-04.csv'
		);
	});
});

describe('nsasNotCheckedIn', () => {
	const users = [user('1', 'Zed'), user('2', null, { id: 'o', name: 'Beta' }), user('3', 'Al')];
	const latestByUser = new Map([
		['1', { present: false }],
		['3', { present: true }]
	]);

	it('lists everyone not checked in, sorted by name', () => {
		const out = nsasNotCheckedIn({ users, latestByUser, onlyWithHistory: false });
		expect(out.map((u) => u.id)).toEqual(['2', '1']);
	});

	it('can leave out those who never checked in', () => {
		const out = nsasNotCheckedIn({ users, latestByUser, onlyWithHistory: true });
		expect(out.map((u) => u.id)).toEqual(['1']);
		expect(nsasNotCheckedIn({ users: null, latestByUser, onlyWithHistory: false })).toEqual([]);
	});

	it('falls back to the email when there is no name', () => {
		const out = nsasNotCheckedIn({
			users: [user('b', null), user('a', null)],
			latestByUser: new Map(),
			onlyWithHistory: false
		});
		expect(out.map((u) => u.id)).toEqual(['a', 'b']);
	});
});

describe('absentDelegatesByCommittee', () => {
	it('lists absent delegations per committee and drops committees without any', () => {
		const groups = absentDelegatesByCommittee([
			{
				id: 'c1',
				name: 'GA',
				abbreviation: null,
				members: [
					{
						id: 'm1',
						present: false,
						representation: { type: 'DELEGATION', name: 'Peru', alpha3Code: 'PER' }
					},
					{ id: 'm2', present: false, representation: { type: 'DELEGATION', name: 'Chad' } },
					{ id: 'm3', present: true, representation: { type: 'DELEGATION', name: 'Iran' } },
					{ id: 'm4', present: false, representation: { type: 'NSA', name: 'NGO' } },
					{ id: 'm5', present: false, representation: null }
				]
			},
			{ id: 'c2', name: 'SC', members: null }
		]);
		expect(groups).toEqual([
			{
				committeeId: 'c1',
				name: 'GA',
				abbreviation: null,
				absent: [
					{ id: 'm2', name: 'Chad', alpha3Code: null, icon: null },
					{ id: 'm1', name: 'Peru', alpha3Code: 'PER', icon: null }
				]
			}
		]);
	});

	it('names a delegation without representation name as empty', () => {
		const [group] = absentDelegatesByCommittee([
			{
				id: 'c',
				name: 'C',
				abbreviation: 'C',
				members: [{ id: 'm', present: false, representation: { type: 'DELEGATION', icon: 'x' } }]
			}
		]);
		expect(group.absent[0]).toEqual({ id: 'm', name: '', alpha3Code: null, icon: 'x' });
	});
});

describe('delegate presence', () => {
	const delegation = { representation: { type: 'DELEGATION' } };
	it('counts delegations against those present', () => {
		expect(delegateStat({ totalPresent: 1, members: [delegation, delegation, {}] })).toEqual({
			present: 1,
			total: 2
		});
		expect(delegateStat({})).toEqual({ present: 0, total: 0 });
		expect(
			delegateTotals([{ totalPresent: 1, members: [delegation] }, { members: [delegation] }])
		).toEqual({
			present: 1,
			total: 2
		});
	});

	it('colours the badge by how many are there', () => {
		expect(presenceBadgeClass({ present: 0, total: 0 })).toBe('badge-ghost');
		expect(presenceBadgeClass({ present: 0, total: 3 })).toBe('badge-ghost');
		expect(presenceBadgeClass({ present: 3, total: 3 })).toBe('badge-success');
		expect(presenceBadgeClass({ present: 1, total: 3 })).toBe('badge-warning');
	});
});

describe('time', () => {
	const now = new Date('2026-01-01T12:00:00Z').getTime();

	it('splits the elapsed time into hours and minutes', () => {
		expect(elapsedSince({ ts: '2026-01-01T11:45:30Z', now })).toEqual({
			minutes: 14,
			hours: 0,
			restMinutes: 14
		});
		expect(elapsedSince({ ts: new Date('2026-01-01T09:50:00Z'), now })).toEqual({
			minutes: 130,
			hours: 2,
			restMinutes: 10
		});
	});

	it('flags check-ins older than four hours', () => {
		expect(isStaleCheckIn({ ts: '2026-01-01T07:59:00Z', now })).toBe(true);
		expect(isStaleCheckIn({ ts: new Date('2026-01-01T08:00:00Z'), now })).toBe(false);
	});

	it('formats a datetime-local value', () => {
		expect(toLocalInput(new Date(2026, 0, 2, 3, 4))).toBe('2026-01-02T03:04');
	});
});

describe('presenceEventDraft', () => {
	const now = new Date(2026, 4, 6, 7, 8);

	it('starts a new check-in now', () => {
		const draft = presenceEventDraft({ event: null, now });
		expect(draft).toEqual({
			conferenceUserId: '',
			committeeId: '',
			present: true,
			timestampLocal: '2026-05-06T07:08',
			note: ''
		});
		expect(isDraftComplete(draft)).toBe(false);
	});

	it('copies an event', () => {
		const ts = new Date(2026, 1, 2, 3, 4);
		const draft = presenceEventDraft({
			event: {
				present: false,
				committeeId: 'c',
				conferenceUserId: 'u',
				timestamp: ts.toISOString()
			},
			now
		});
		expect(draft).toEqual({
			conferenceUserId: 'u',
			committeeId: 'c',
			present: false,
			timestampLocal: '2026-02-02T03:04',
			note: ''
		});
		expect(isDraftComplete(draft)).toBe(true);
		expect(
			presenceEventDraft({
				event: { present: true, committeeId: 'c', conferenceUserId: 'u', timestamp: ts, note: 'n' },
				now
			}).note
		).toBe('n');
	});

	it('needs a person, a committee and a time', () => {
		const full = presenceEventDraft({
			event: { present: true, committeeId: 'c', conferenceUserId: 'u', timestamp: now },
			now
		});
		expect(isDraftComplete({ ...full, committeeId: '' })).toBe(false);
		expect(isDraftComplete({ ...full, timestampLocal: '' })).toBe(false);
	});
});
