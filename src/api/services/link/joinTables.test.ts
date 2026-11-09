import { describe, expect, it } from 'vitest';
import { joinTables, type DelegatorTables } from './joinTables';

const conference = {
	id: 'conf',
	title: 'MUN-SH',
	startConference: new Date('2027-03-01'),
	endConference: new Date('2027-03-04')
};

const person = (id: string) => ({
	id,
	email: `${id}@example.org`,
	givenName: id,
	familyName: 'Doe'
});

function tables(overrides: Partial<DelegatorTables> = {}): DelegatorTables {
	return {
		committees: [
			{ id: 'ga', name: 'General Assembly', abbreviation: 'GA', roles: [{ id: 'deu' }] }
		],
		agendaItems: [{ id: 'climate', title: 'Climate', committeeId: 'ga' }],
		roles: [{ id: 'deu', kind: 'NATION', nation: { alpha2Code: 'DE' } }],
		teamMembers: [{ id: 'tm', role: 'PROJECT_MANAGEMENT', userId: 'ada' }],
		delegations: [{ id: 'del', assignedRoleId: 'deu' }],
		delegationMembers: [
			{ id: 'dm', delegationId: 'del', conferenceParticipantId: 'p-bob', assignedCommitteeId: 'ga' }
		],
		singleParticipants: [],
		supervisors: [],
		participants: [{ id: 'p-bob', userId: 'bob', nsaCardNumber: 2 }],
		users: [person('ada'), person('bob')],
		papers: [
			{
				id: 'paper',
				delegationId: 'del',
				agendaItemId: 'climate',
				versions: [{ id: 'v1', version: 1 }]
			}
		],
		...overrides
	};
}

describe('joinTables', () => {
	it('puts the rows together the way the mirror takes them', () => {
		const { source, papers, missing } = joinTables({ conference, tables: tables() });
		expect(source.committees[0].agendaItems).toEqual([{ id: 'climate', title: 'Climate' }]);
		expect(source.teamMembers).toEqual([
			{ id: 'tm', role: 'PROJECT_MANAGEMENT', user: person('ada') }
		]);
		expect(source.delegationMembers).toEqual([
			{
				id: 'dm',
				assignedCommittee: { id: 'ga' },
				delegation: { id: 'del', assignedRole: { id: 'deu' } },
				participant: { nsaCardNumber: 2 },
				user: person('bob')
			}
		]);
		expect(papers).toEqual([
			{
				id: 'paper',
				agendaItem: { id: 'climate', committeeId: 'ga' },
				delegation: { assignedRoleId: 'deu' },
				versions: [{ id: 'v1', version: 1 }]
			}
		]);
		expect(missing).toEqual({ users: [], participants: [], delegations: [] });
	});

	it('names the rows pointed at that their table does not hold, and leaves the person out', () => {
		const { source, missing } = joinTables({
			conference,
			tables: tables({ users: [person('ada')], delegations: [] })
		});
		expect(source.delegationMembers).toEqual([]);
		expect(missing).toEqual({ users: ['bob'], participants: [], delegations: ['del'] });
	});

	it('leaves out the papers of a delegation the link does not read', () => {
		expect(joinTables({ conference, tables: tables({ delegations: [] }) }).papers).toEqual([]);
	});

	it('asks for no person behind a single participant without a seat', () => {
		const { source, missing } = joinTables({
			conference,
			tables: tables({
				singleParticipants: [{ id: 'sp', conferenceParticipantId: 'p-gone', assignedRoleId: null }]
			})
		});
		expect(source.singleParticipants).toEqual([]);
		expect(missing.participants).toEqual([]);
	});
});
