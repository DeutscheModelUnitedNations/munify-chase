import { describe, expect, it } from 'vitest';
import {
	assertActiveSession,
	assertDeviceWindowOpen,
	deviceVoterSeat,
	DEVICE_VOTE_GRACE_MS,
	votingSessionStart
} from './votingRules';

const now = new Date(1_000_000);

describe('votingSessionStart', () => {
	it('starts a show of hands at PRO unless a stage is given', () => {
		expect(votingSessionStart({ mode: 'SHOW_OF_HANDS', now })).toEqual({
			currentStage: 'PRO',
			deviceVotingWindowSeconds: null,
			deviceVotingStartedAt: null
		});
		expect(
			votingSessionStart({ mode: 'SHOW_OF_HANDS', currentStage: 'CON', now }).currentStage
		).toBe('CON');
	});
	it('opens a device vote window, 20 seconds by default', () => {
		expect(votingSessionStart({ mode: 'DEVICE_BASED', now })).toEqual({
			currentStage: null,
			deviceVotingWindowSeconds: 20,
			deviceVotingStartedAt: now
		});
		expect(
			votingSessionStart({ mode: 'DEVICE_BASED', deviceVotingWindowSeconds: 45, now })
				.deviceVotingWindowSeconds
		).toBe(45);
	});
	it('ignores a window for other modes', () => {
		expect(votingSessionStart({ mode: 'ROLL_CALL', deviceVotingWindowSeconds: 45, now })).toEqual({
			currentStage: null,
			deviceVotingWindowSeconds: null,
			deviceVotingStartedAt: null
		});
	});
});

describe('assertActiveSession', () => {
	it('accepts only the active session', () => {
		expect(() => assertActiveSession({ activeVotingSessionId: 's', sessionId: 's' })).not.toThrow();
		expect(() => assertActiveSession({ activeVotingSessionId: null, sessionId: 's' })).toThrow();
		expect(() =>
			assertActiveSession({ activeVotingSessionId: undefined, sessionId: 's' })
		).toThrow();
	});
});

describe('assertDeviceWindowOpen', () => {
	const session = {
		mode: 'DEVICE_BASED' as const,
		deviceVotingStartedAt: now,
		deviceVotingWindowSeconds: 10
	};
	const end = now.getTime() + 10_000 + DEVICE_VOTE_GRACE_MS;

	it('accepts votes until the window and grace end', () => {
		expect(() => assertDeviceWindowOpen({ session, now: end })).not.toThrow();
		expect(() => assertDeviceWindowOpen({ session, now: end + 1 })).toThrow('closed');
	});
	it('refuses other modes and unopened windows', () => {
		expect(() =>
			assertDeviceWindowOpen({ session: { ...session, mode: 'ROLL_CALL' }, now: end })
		).toThrow('not a device-based vote');
		expect(() =>
			assertDeviceWindowOpen({ session: { ...session, deviceVotingStartedAt: null }, now: end })
		).toThrow('not been opened');
		expect(() =>
			assertDeviceWindowOpen({ session: { ...session, deviceVotingWindowSeconds: null }, now: end })
		).toThrow('not been opened');
	});
});

describe('deviceVoterSeat', () => {
	const seat = { id: 'seat', present: true, committeeId: 'c' };
	const delegate = (committeeMember: typeof seat | null) => ({
		conferenceUserType: 'DELEGATE',
		committeeMember
	});

	it('answers a present delegate seat in the committee', () => {
		expect(deviceVoterSeat({ conferenceUser: delegate(seat), committeeId: 'c' })).toBe('seat');
	});
	it('refuses everybody else', () => {
		expect(() =>
			deviceVoterSeat({
				conferenceUser: { ...delegate(seat), conferenceUserType: 'CHAIR' },
				committeeId: 'c'
			})
		).toThrow('Only delegates');
		expect(() => deviceVoterSeat({ conferenceUser: delegate(null), committeeId: 'c' })).toThrow(
			'not assigned'
		);
		expect(() =>
			deviceVoterSeat({ conferenceUser: delegate({ ...seat, present: false }), committeeId: 'c' })
		).toThrow('present');
		expect(() => deviceVoterSeat({ conferenceUser: delegate(seat), committeeId: 'other' })).toThrow(
			'not a member'
		);
	});
});
