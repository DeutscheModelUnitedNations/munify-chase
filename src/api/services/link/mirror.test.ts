import { describe, expect, it } from 'vitest';
import { mirrorConference, type MirrorSource } from './mirror';

const person = (id: string) => ({
	id,
	email: `${id.toUpperCase()}@Example.org`,
	givenName: id,
	familyName: 'Doe'
});

function source(overrides: Partial<MirrorSource> = {}): MirrorSource {
	return {
		conference: {
			id: 'conf',
			title: 'MUN-SH',
			location: 'Kiel',
			startConference: new Date('2027-03-01'),
			endConference: new Date('2027-03-04')
		},
		committees: [
			{
				id: 'ga',
				name: 'General Assembly',
				abbreviation: 'GA',
				agendaItems: [{ id: 'ai1', title: 'Climate' }],
				roles: [{ id: 'role-de' }]
			}
		],
		roles: [
			{ id: 'role-de', kind: 'NATION', chaseAccess: 'SPECTATOR', nation: { alpha2Code: 'DE' } },
			{ id: 'role-fr', kind: 'NATION', chaseAccess: 'SPECTATOR', nation: { alpha2Code: 'FR' } },
			{
				id: 'role-amnesty',
				kind: 'NON_STATE_ACTOR',
				name: 'Amnesty',
				icon: 'bird',
				chaseAccess: 'SPECTATOR'
			},
			{ id: 'role-press', kind: 'CUSTOM', name: 'Press', chaseAccess: 'SPECTATOR' },
			{ id: 'role-judge', kind: 'CUSTOM', name: 'Judge', chaseAccess: 'NONE' },
			{ id: 'role-tech', kind: 'CUSTOM', name: 'Tech', chaseAccess: 'TEAM' }
		],
		teamMembers: [
			{ id: 'tm-pm', role: 'PROJECT_MANAGEMENT', user: person('pm') },
			{ id: 'tm-coord', role: 'TEAM_COORDINATOR', user: person('coord') },
			{ id: 'tm-member', role: 'MEMBER', user: person('member') }
		],
		supervisors: [{ id: 'sup', user: person('teacher') }],
		delegationMembers: [
			{
				id: 'dm-de-1',
				assignedCommittee: { id: 'ga' },
				delegation: { id: 'del-de', assignedRole: { id: 'role-de' } },
				user: person('anna')
			},
			{
				id: 'dm-de-2',
				assignedCommittee: { id: 'ga' },
				delegation: { id: 'del-de', assignedRole: { id: 'role-de' } },
				user: person('ben')
			},
			{
				id: 'dm-nsa',
				assignedCommittee: null,
				delegation: { id: 'del-amnesty', assignedRole: { id: 'role-amnesty' } },
				user: person('nora')
			},
			{
				id: 'dm-unseated',
				assignedCommittee: null,
				delegation: { id: 'del-x', assignedRole: { id: 'role-de' } },
				user: person('carl')
			}
		],
		singleParticipants: [
			{ id: 'sp-press', assignedRole: { id: 'role-press' }, user: person('paula') },
			{ id: 'sp-judge', assignedRole: { id: 'role-judge' }, user: person('jo') },
			{ id: 'sp-tech', assignedRole: { id: 'role-tech' }, user: person('tim') },
			{ id: 'sp-none', assignedRole: null, user: person('nobody') }
		],
		...overrides
	};
}

describe('mirrorConference', () => {
	it('keeps DELEGATOR ids for the conference, committees and agenda items', () => {
		const mirror = mirrorConference(source());
		expect(mirror.conference).toMatchObject({ id: 'conf', title: 'MUN-SH', location: 'Kiel' });
		expect(mirror.committees).toEqual([{ id: 'ga', name: 'General Assembly', abbreviation: 'GA' }]);
		expect(mirror.agendaItems).toEqual([{ id: 'ai1', committeeId: 'ga', title: 'Climate' }]);
	});

	it('mirrors seated nations and non-state actors only, under their role ids', () => {
		const representations = mirrorConference(source()).representations;
		expect(representations.map((r) => r.id)).toEqual(['role-de', 'role-amnesty']);
		expect(representations[0]).toMatchObject({
			type: 'DELEGATION',
			alpha2Code: 'de',
			alpha3Code: 'deu',
			regionalGroup: 'WESTERN_EUROPE_OTHERS'
		});
		expect(representations[1]).toMatchObject({ type: 'NSA', name: 'Amnesty', icon: 'bird' });
	});

	it('gives a nation one committee member per committee, shared by its delegates there', () => {
		const mirror = mirrorConference(source());
		expect(mirror.committeeMembers).toEqual([
			{ id: 'role-de_ga', committeeId: 'ga', representationId: 'role-de' }
		]);
		const delegates = mirror.conferenceUsers.filter((u) => u.conferenceUserType === 'DELEGATE');
		expect(delegates.map((u) => [u.id, u.committeeMemberId])).toEqual([
			['dm-de-1', 'role-de_ga'],
			['dm-de-2', 'role-de_ga']
		]);
	});

	it('leaves out delegates without a committee', () => {
		const ids = mirrorConference(source()).conferenceUsers.map((u) => u.id);
		expect(ids).not.toContain('dm-unseated');
	});

	it('makes an NSA delegation one conference member', () => {
		const mirror = mirrorConference(source());
		expect(mirror.conferenceMembers).toEqual([
			{ id: 'del-amnesty', representationId: 'role-amnesty' }
		]);
		expect(mirror.conferenceUsers.find((u) => u.id === 'dm-nsa')).toMatchObject({
			conferenceUserType: 'NON_STATE_ACTOR',
			conferenceMemberId: 'del-amnesty'
		});
	});

	it('maps team roles: project management and coordinators run the conference', () => {
		const types = Object.fromEntries(
			mirrorConference(source()).conferenceUsers.map((u) => [u.id, u.conferenceUserType])
		);
		expect(types['tm-pm']).toBe('ADMIN');
		expect(types['tm-coord']).toBe('ADMIN');
		expect(types['tm-member']).toBe('TEAM');
		expect(types['sup']).toBe('SPECTATOR');
	});

	it("follows a custom role's CHASE access", () => {
		const types = Object.fromEntries(
			mirrorConference(source()).conferenceUsers.map((u) => [u.id, u.conferenceUserType])
		);
		expect(types['sp-press']).toBe('SPECTATOR');
		expect(types['sp-tech']).toBe('TEAM');
		expect(types).not.toHaveProperty('sp-judge');
		expect(types).not.toHaveProperty('sp-none');
	});

	it('stores addresses in lower case with the DELEGATOR user id', () => {
		const anna = mirrorConference(source()).conferenceUsers.find((u) => u.id === 'dm-de-1');
		expect(anna).toMatchObject({
			userEmail: 'anna@example.org',
			name: 'anna Doe',
			delegatorUserId: 'anna'
		});
	});

	it('mirrors no participants before the release, when DELEGATOR shows none', () => {
		const mirror = mirrorConference(
			source({ delegationMembers: [], singleParticipants: [], supervisors: [] })
		);
		expect(mirror.conferenceUsers.map((u) => u.id)).toEqual(['tm-pm', 'tm-coord', 'tm-member']);
		expect(mirror.committeeMembers).toHaveLength(1);
	});
});
