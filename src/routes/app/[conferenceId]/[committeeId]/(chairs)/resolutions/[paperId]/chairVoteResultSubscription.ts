import { graphql } from '$houdini';

export const ChairVoteResultSubscription = graphql(`
	subscription ChairVoteResultSubscription($paperId: ID!) {
		findFirstResolutionVoteResult(where: { paperId: $paperId }) {
			id
			outcome
			votesFor
			votesAgainst
			votesAbstain
		}
	}
`);
