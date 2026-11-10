import { client } from '#lib/api/rumbleClient/client';
import { latchWhileDisconnected } from '#lib/state/connection.svelte';

/**
 * Ends a voting session on the server; `null` as outcome cancels it. Fire and forget, and
 * nothing to do without a session.
 */
export function completeVotingSession({
	id,
	outcome = null
}: {
	id: string | null;
	outcome?: 'ADOPTED' | 'REJECTED' | null;
}) {
	if (!id) return;
	client.mutate.completeVotingSession({ __args: { id, outcome } }).catch(() => {});
}

/**
 * Live query of the committee's running vote, as the roll call and device based
 * presentations show it. `committee.activeVotingSession` is the single source of truth for
 * "is a vote happening?": open iff it references a session, closed when null.
 */
export function liveVoteWithBallots(committeeId: string) {
	return client.liveQuery.committee({
		__args: { id: committeeId },
		id: true,
		activeVotingSession: {
			id: true,
			mode: true,
			currentStage: true,
			voteName: true,
			majority: true,
			withAbstentions: true,
			deviceVotingStartedAt: true,
			deviceVotingWindowSeconds: true,
			votes: { id: true, committeeMemberId: true, vote: true }
		}
	});
}

/**
 * The running vote of a `liveVoteWithBallots` result, frozen at its last value while the
 * WS is confirmed disconnected, so a real outage doesn't close the vote mid-count; only a
 * genuine vote completion does. Call it during component init.
 */
export function latchedBallotSession(live: Awaited<ReturnType<typeof liveVoteWithBallots>>) {
	return latchWhileDisconnected(() => live?.activeVotingSession ?? null);
}

/** The running vote a ballot presentation shows. */
export type BallotSession = NonNullable<ReturnType<ReturnType<typeof latchedBallotSession>>>;
