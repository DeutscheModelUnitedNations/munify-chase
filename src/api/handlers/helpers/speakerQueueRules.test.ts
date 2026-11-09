import { describe, expect, it } from 'vitest';
import {
	assertMayQueueThemselves,
	assertOneSpeakerSeat,
	clampPosition,
	moveShift,
	seatEntryFilter,
	selfAddSeat,
	selfServiceCommittee
} from './speakerQueueRules';

describe('assertOneSpeakerSeat', () => {
	it('accepts exactly one seat', () => {
		expect(() => assertOneSpeakerSeat({ committeeMemberId: 'c' })).not.toThrow();
		expect(() => assertOneSpeakerSeat({ conferenceMemberId: 'm' })).not.toThrow();
	});
	it('refuses both and none', () => {
		expect(() => assertOneSpeakerSeat({ committeeMemberId: 'c', conferenceMemberId: 'm' })).toThrow(
			'Cannot set both'
		);
		expect(() => assertOneSpeakerSeat({ committeeMemberId: null })).toThrow('Must set either');
	});
});

const committee = {
	id: 'c1',
	conferenceId: 'conf',
	allowDelegationsToAddThemselvesToSpeakersList: true
};
const list = (
	overrides: Partial<{ isClosed: boolean; committee: typeof committee | null }> = {}
) => ({
	isClosed: overrides.isClosed ?? false,
	agendaItem: { committee: overrides.committee === undefined ? committee : overrides.committee }
});

describe('selfServiceCommittee', () => {
	it('answers the committee of an open list that allows self service', () => {
		expect(selfServiceCommittee({ speakersList: list(), action: 'add' })).toBe(committee);
	});
	it('refuses a missing list', () => {
		expect(() => selfServiceCommittee({ speakersList: undefined, action: 'remove' })).toThrow(
			'Speakers list not found'
		);
	});
	it('refuses adding to a closed list, but not removing from it', () => {
		expect(() =>
			selfServiceCommittee({ speakersList: list({ isClosed: true }), action: 'add' })
		).toThrow('Speakers list is closed');
		expect(selfServiceCommittee({ speakersList: list({ isClosed: true }), action: 'remove' })).toBe(
			committee
		);
	});
	it('refuses a list without committee', () => {
		expect(() =>
			selfServiceCommittee({ speakersList: list({ committee: null }), action: 'add' })
		).toThrow('Committee not found');
	});
	it('refuses when the committee does not allow it, worded by action', () => {
		const closed = list({
			committee: { ...committee, allowDelegationsToAddThemselvesToSpeakersList: false }
		});
		expect(() => selfServiceCommittee({ speakersList: closed, action: 'add' })).toThrow(
			'Self-adding'
		);
		expect(() => selfServiceCommittee({ speakersList: closed, action: 'remove' })).toThrow(
			'Self-removing'
		);
	});
});

describe('assertMayQueueThemselves', () => {
	it('lets delegates and NSAs queue', () => {
		expect(() => assertMayQueueThemselves({ conferenceUserType: 'DELEGATE' })).not.toThrow();
		expect(() => assertMayQueueThemselves({ conferenceUserType: 'NON_STATE_ACTOR' })).not.toThrow();
	});
	it('refuses everybody else', () => {
		expect(() => assertMayQueueThemselves({ conferenceUserType: 'CHAIR' })).toThrow();
	});
});

describe('selfAddSeat', () => {
	const seat = { id: 's1', present: true, committeeId: 'c1' };
	const delegate = (committeeMember: typeof seat | null) => ({
		conferenceUserType: 'DELEGATE',
		committeeMember,
		conferenceMember: null
	});

	it('answers a present delegate seat in the committee', () => {
		expect(selfAddSeat({ conferenceUser: delegate(seat), committeeId: 'c1' })).toEqual({
			committeeMemberId: 's1',
			conferenceMemberId: null
		});
	});
	it('refuses a delegate without seat, absent or elsewhere', () => {
		expect(() => selfAddSeat({ conferenceUser: delegate(null), committeeId: 'c1' })).toThrow(
			'not assigned to a committee'
		);
		expect(() =>
			selfAddSeat({ conferenceUser: delegate({ ...seat, present: false }), committeeId: 'c1' })
		).toThrow('present');
		expect(() => selfAddSeat({ conferenceUser: delegate(seat), committeeId: 'c2' })).toThrow(
			'not a member of this committee'
		);
	});
	it('answers an NSA conference membership', () => {
		const nsa = { conferenceUserType: 'NON_STATE_ACTOR', committeeMember: null };
		expect(
			selfAddSeat({ conferenceUser: { ...nsa, conferenceMember: { id: 'm1' } }, committeeId: 'c1' })
		).toEqual({ committeeMemberId: null, conferenceMemberId: 'm1' });
		expect(() =>
			selfAddSeat({ conferenceUser: { ...nsa, conferenceMember: null }, committeeId: 'c1' })
		).toThrow('conference member');
	});
});

describe('seatEntryFilter', () => {
	it('names only the seat that is set', () => {
		expect(
			seatEntryFilter({
				speakersListId: 'l',
				seat: { committeeMemberId: 's', conferenceMemberId: null }
			})
		).toEqual({ speakersListId: 'l', committeeMemberId: 's' });
		expect(
			seatEntryFilter({
				speakersListId: 'l',
				seat: { committeeMemberId: null, conferenceMemberId: 'm' }
			})
		).toEqual({ speakersListId: 'l', conferenceMemberId: 'm' });
	});
});

describe('clampPosition', () => {
	it('keeps targets inside 0 and the last position', () => {
		expect(clampPosition({ target: 7, max: 3 })).toBe(3);
		expect(clampPosition({ target: -2, max: 3 })).toBe(0);
		expect(clampPosition({ target: 2, max: 3 })).toBe(2);
	});
});

describe('moveShift', () => {
	it('moves the entries in between forward when moving back', () => {
		expect(moveShift({ from: 1, to: 4 })).toEqual({
			range: { gt: 1, lte: 4 },
			order: 'asc',
			step: -1
		});
	});
	it('moves the entries in between back when moving forward', () => {
		expect(moveShift({ from: 4, to: 1 })).toEqual({
			range: { lt: 4, gte: 1 },
			order: 'desc',
			step: 1
		});
	});
	it('moves nothing when staying', () => {
		expect(moveShift({ from: 2, to: 2 })).toBeUndefined();
	});
});
