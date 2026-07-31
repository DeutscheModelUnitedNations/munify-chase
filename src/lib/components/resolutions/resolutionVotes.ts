import { client } from '$lib/api/rumbleClient/client';
import { nanoid } from '$lib/helpers/nanoid';

/**
 * Start (or resume) a committee voting session and link it to an operative
 * clause. `startVotingSession` is idempotent per committee — if a session is
 * already active it is returned instead of creating a new one.
 */
export async function launchClauseVote(opts: {
	committeeId: string;
	paperId: string;
	clauseId: string;
	majorityAmount: number;
	voteName: string;
}): Promise<string | null> {
	const session = await client.mutate.startVotingSession({
		__args: {
			id: nanoid(),
			committeeId: opts.committeeId,
			mode: 'SHOW_OF_HANDS',
			majority: 'SIMPLE',
			majorityAmount: opts.majorityAmount,
			withAbstentions: true,
			voteName: opts.voteName
		},
		id: true
	});
	if (!session) return null;
	await client.mutate.linkOperativeClauseVote({
		__args: {
			id: nanoid(),
			paperId: opts.paperId,
			clauseId: opts.clauseId,
			votingSessionId: session.id
		},
		id: true
	});
	return session.id;
}

/**
 * Start (or resume) the final resolution-level vote. The paper is linked and
 * snapshotted only once the chair concludes the vote (see
 * `concludeResolutionPaperVote`), so this just launches the session.
 */
export async function launchFinalVote(opts: {
	committeeId: string;
	majorityAmount: number;
	voteName: string;
	mode?: 'SHOW_OF_HANDS' | 'ROLL_CALL';
	majority?: 'SIMPLE' | 'ABSOLUTE' | 'TWO_THIRDS';
	withAbstentions?: boolean;
}): Promise<string | null> {
	const session = await client.mutate.startVotingSession({
		__args: {
			id: nanoid(),
			committeeId: opts.committeeId,
			mode: opts.mode ?? 'ROLL_CALL',
			majority: opts.majority ?? 'ABSOLUTE',
			majorityAmount: opts.majorityAmount,
			withAbstentions: opts.withAbstentions ?? true,
			voteName: opts.voteName
		},
		id: true
	});
	return session?.id ?? null;
}
