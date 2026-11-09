import { describe, expect, it } from 'vitest';
import { idsOf, participantIdsOf, sameIds, seatsKey, userIdsOf } from './followedIds';

describe('seatsKey', () => {
	it('names only seated delegations, in a stable order', () => {
		expect(
			seatsKey([
				{ id: 'b', assignedRoleId: 'r2' },
				{ id: 'a', assignedRoleId: 'r1' },
				{ id: 'c', assignedRoleId: null }
			])
		).toBe('a:r1,b:r2');
	});

	it('changes when a role changes', () => {
		expect(seatsKey([{ id: 'a', assignedRoleId: 'r1' }])).not.toBe(
			seatsKey([{ id: 'a', assignedRoleId: 'r2' }])
		);
	});
});

describe('idsOf and sameIds', () => {
	it('deduplicates and sorts', () => {
		expect(idsOf(['b', 'a', 'b'])).toEqual(['a', 'b']);
	});

	it('compares by content', () => {
		expect(sameIds(['a', 'b'], ['a', 'b'])).toBe(true);
		expect(sameIds(['a'], ['a', 'b'])).toBe(false);
		expect(sameIds(['a', 'c'], ['a', 'b'])).toBe(false);
	});
});

describe('participantIdsOf', () => {
	it('takes members, seated single participants and supervisors', () => {
		expect(
			participantIdsOf({
				delegationMembers: [{ conferenceParticipantId: 'm' }],
				singleParticipants: [
					{ conferenceParticipantId: 's1', assignedRoleId: 'r' },
					{ conferenceParticipantId: 's2', assignedRoleId: null }
				],
				supervisors: [{ conferenceParticipantId: 'p' }, { conferenceParticipantId: 'm' }]
			})
		).toEqual(['m', 'p', 's1']);
	});
});

describe('userIdsOf', () => {
	it('names every user once', () => {
		expect(userIdsOf([{ userId: 'u2' }, { userId: 'u1' }, { userId: 'u2' }])).toEqual(['u1', 'u2']);
	});
});
