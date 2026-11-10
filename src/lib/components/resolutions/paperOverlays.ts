import { client } from '#lib/api/rumbleClient/client';

/** A paper's amendments, as the amendment overlays (`toAmendmentOverlays`) need them. */
export function fetchOverlayAmendments(paperId: string) {
	return client.liveQuery.amendments({
		__args: { where: { paper: { id: { eq: paperId } } } },
		id: true,
		type: true,
		status: true,
		targetClauseId: true,
		targetOperativeIndex: true,
		targetPosition: true,
		newContent: true,
		proposer: { id: true, representation: { id: true, name: true, alpha2Code: true } },
		sponsors: { id: true }
	});
}

/** A paper's clause votes with their outcome. */
export function fetchClauseVoteOutcomes(paperId: string) {
	return client.liveQuery.operativeClauseVotes({
		__args: { where: { paper: { id: { eq: paperId } } } },
		id: true,
		clauseId: true,
		vote: { id: true, outcome: true }
	});
}
