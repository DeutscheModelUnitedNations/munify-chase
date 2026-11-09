/** Pure shaping of the mission control pulse from its query rows. */

interface CommitteeNamed {
	committeeId: string;
	committeeName: string;
	committeeAbbreviation: string;
}

export interface HeartbeatStats {
	speechesToday: number;
	votesHeldToday: number;
	resolutionsAdoptedToday: number;
	debateSecondsToday: number;
}

export interface BusiestCommittee extends CommitteeNamed {
	interventionCount: number;
}

export interface ClosestVote extends CommitteeNamed {
	voteName: string | null;
	votesPro: number;
	votesCon: number;
	margin: number;
}

export interface LongestSpeechToday extends CommitteeNamed {
	durationSeconds: number;
}

function committeeOf(row: CommitteeNamed): CommitteeNamed {
	return {
		committeeId: row.committeeId,
		committeeName: row.committeeName,
		committeeAbbreviation: row.committeeAbbreviation
	};
}

/** Today's heartbeat, all zero before the view has a row for the conference. */
export function heartbeatOf(row: Partial<HeartbeatStats> | undefined): HeartbeatStats {
	return {
		speechesToday: row?.speechesToday ?? 0,
		votesHeldToday: row?.votesHeldToday ?? 0,
		resolutionsAdoptedToday: row?.resolutionsAdoptedToday ?? 0,
		debateSecondsToday: row?.debateSecondsToday ?? 0
	};
}

export function busiestOf(row: BusiestCommittee | undefined): BusiestCommittee | null {
	if (!row) return null;
	return { ...committeeOf(row), interventionCount: row.interventionCount };
}

export function closestVoteOf(row: ClosestVote | undefined): ClosestVote | null {
	if (!row) return null;
	return {
		...committeeOf(row),
		voteName: row.voteName,
		votesPro: row.votesPro,
		votesCon: row.votesCon,
		margin: row.margin
	};
}

export function longestSpeechOf(
	row: (CommitteeNamed & { duration: number }) | undefined
): LongestSpeechToday | null {
	if (!row) return null;
	return { ...committeeOf(row), durationSeconds: Math.round(row.duration) };
}

/** Vote outcomes with their counts; a vote without an outcome is left out. */
export function voteOutcomes(rows: { outcome: string | null; cnt: number }[]) {
	return rows.flatMap((r) => (r.outcome == null ? [] : [{ outcome: r.outcome, count: r.cnt }]));
}
