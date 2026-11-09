import { describe, expect, it } from 'vitest';
import {
	isParticipantRole,
	positionAnnouncement,
	positionOnList,
	positionText,
	seesSpeakersLists,
	selfAddState,
	showsDeviceVote
} from './participantCommittee';

describe('roles', () => {
	it('knows participants and who follows the lists', () => {
		expect(isParticipantRole('DELEGATE')).toBe(true);
		expect(isParticipantRole('SPECTATOR')).toBe(false);
		expect(seesSpeakersLists('SPECTATOR')).toBe(true);
		expect(seesSpeakersLists('NON_STATE_ACTOR')).toBe(true);
		expect(seesSpeakersLists('TEAM')).toBe(false);
		expect(seesSpeakersLists(undefined)).toBe(false);
	});
});

describe('positionOnList', () => {
	const speakers = [
		{ position: 0, committeeMember: { id: 'cm1' } },
		{ position: 1, conferenceMember: { id: 'nsa1' } }
	];

	it('finds the caller by either seat', () => {
		expect(positionOnList({ speakers, committeeMemberId: 'cm1', conferenceMemberId: null })).toBe(0);
		expect(positionOnList({ speakers, committeeMemberId: null, conferenceMemberId: 'nsa1' })).toBe(1);
		expect(positionOnList({ speakers, committeeMemberId: 'x', conferenceMemberId: 'y' })).toBeNull();
		expect(positionOnList({ speakers, committeeMemberId: null, conferenceMemberId: null })).toBeNull();
	});
});

describe('selfAddState', () => {
	const base = { myPosition: null, isClosed: false, role: 'DELEGATE', present: true };
	it('decides what the caller can do', () => {
		expect(selfAddState({ ...base, myPosition: 2 })).toBe('onList');
		expect(selfAddState({ ...base, isClosed: true })).toBe('closed');
		expect(selfAddState({ ...base, present: false })).toBe('notPresent');
		expect(selfAddState({ ...base, role: 'NON_STATE_ACTOR', present: false })).toBe('canAdd');
		expect(selfAddState(base)).toBe('canAdd');
	});
});

describe('position texts', () => {
	it('says when the caller is up and where they stand', () => {
		expect(positionText(0)).not.toBe(positionText(3));
		expect(positionText(3)).toContain('3');
		expect(positionAnnouncement({ label: 'GSL', position: null })).toBe('');
		expect(positionAnnouncement({ label: 'GSL', position: 3 })).toBe(`GSL: ${positionText(3)}`);
	});
});

describe('showsDeviceVote', () => {
	const session = {
		mode: 'DEVICE_BASED',
		deviceVotingStartedAt: new Date(),
		deviceVotingWindowSeconds: 30
	};
	it('opens for present delegates during a timed device vote', () => {
		expect(showsDeviceVote({ session, committeeMemberId: 'cm', present: true })).toBe(true);
		expect(showsDeviceVote({ session, committeeMemberId: 'cm', present: false })).toBe(false);
		expect(showsDeviceVote({ session, committeeMemberId: null, present: true })).toBe(false);
		expect(
			showsDeviceVote({ session: { ...session, mode: 'ROLL_CALL' }, committeeMemberId: 'cm', present: true })
		).toBe(false);
		expect(
			showsDeviceVote({
				session: { ...session, deviceVotingStartedAt: null },
				committeeMemberId: 'cm',
				present: true
			})
		).toBe(false);
		expect(
			showsDeviceVote({
				session: { ...session, deviceVotingWindowSeconds: 0 },
				committeeMemberId: 'cm',
				present: true
			})
		).toBe(false);
		expect(showsDeviceVote({ session: null, committeeMemberId: 'cm', present: true })).toBe(false);
	});
});
