import { GraphQLError } from 'graphql';

type VotingMode = 'SHOW_OF_HANDS' | 'ROLL_CALL' | 'DEVICE_BASED';
type VotingStage = 'PRO' | 'CON' | 'ABSTAIN' | 'EVALUATION';

/** Grace period so an in-flight tap sent right before expiry isn't rejected for network latency. */
export const DEVICE_VOTE_GRACE_MS = 3000;

/** The default length of a device vote's window, in seconds. */
const DEFAULT_DEVICE_WINDOW_SECONDS = 20;

/**
 * The mode dependent fields of a new session: a show of hands starts at the PRO stage, a device
 * vote opens its window right away.
 */
export function votingSessionStart({
	mode,
	currentStage,
	deviceVotingWindowSeconds,
	now
}: {
	mode: VotingMode;
	currentStage?: VotingStage | null;
	deviceVotingWindowSeconds?: number | null;
	now: Date;
}) {
	const deviceBased = mode === 'DEVICE_BASED';
	return {
		currentStage: currentStage ?? (mode === 'SHOW_OF_HANDS' ? ('PRO' as const) : null),
		deviceVotingWindowSeconds: deviceBased
			? (deviceVotingWindowSeconds ?? DEFAULT_DEVICE_WINDOW_SECONDS)
			: null,
		deviceVotingStartedAt: deviceBased ? now : null
	};
}

/** Votes are only accepted for the session the committee is currently running. */
export function assertActiveSession({
	activeVotingSessionId,
	sessionId
}: {
	activeVotingSessionId: string | null | undefined;
	sessionId: string;
}) {
	if (activeVotingSessionId !== sessionId) {
		throw new GraphQLError('Voting session is not the active session for this committee');
	}
}

/** A device vote is accepted while its window, plus the grace period, is open. */
export function assertDeviceWindowOpen({
	session,
	now
}: {
	session: {
		mode: VotingMode;
		deviceVotingStartedAt: Date | null;
		deviceVotingWindowSeconds: number | null;
	};
	now: number;
}) {
	if (session.mode !== 'DEVICE_BASED') {
		throw new GraphQLError('Voting session is not a device-based vote');
	}
	if (!session.deviceVotingStartedAt || !session.deviceVotingWindowSeconds) {
		throw new GraphQLError('Voting window has not been opened');
	}
	const windowEndsAt =
		session.deviceVotingStartedAt.getTime() +
		session.deviceVotingWindowSeconds * 1000 +
		DEVICE_VOTE_GRACE_MS;
	if (now > windowEndsAt) throw new GraphQLError('Voting window has closed');
}

/**
 * The seat a device vote is cast for: always the caller's own, never one the client names, so a
 * delegate only votes for themselves.
 */
export function deviceVoterSeat({
	conferenceUser,
	committeeId
}: {
	conferenceUser: {
		conferenceUserType: string;
		committeeMember: { id: string; present: boolean; committeeId: string } | null;
	};
	committeeId: string;
}) {
	if (conferenceUser.conferenceUserType !== 'DELEGATE') {
		throw new GraphQLError('Only delegates can cast a device-based vote');
	}
	const seat = conferenceUser.committeeMember;
	if (!seat) throw new GraphQLError('Delegate is not assigned to a committee seat');
	if (!seat.present) {
		// Otherwise an absent delegate's vote lands in the votingVote table and inflates
		// votesPro/Con/Abstain, while the chair/presentation "who hasn't voted" list (scoped to
		// present members only, matching the roll-call chair's own member filter) never lists (or
		// clears) them, so the tally silently drifts out of sync with what's displayed.
		throw new GraphQLError('Delegate must be marked as present to vote');
	}
	if (seat.committeeId !== committeeId) {
		throw new GraphQLError('Delegate is not a member of this committee');
	}
	return seat.id;
}
