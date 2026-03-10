import { graphql } from '$houdini';

export const ChairVoteResultSubscription = graphql(`
	subscription ChairVoteResultSubscription($paperId: ID!) {
		findManyResolutionVoteResult(where: { paperId: $paperId }, limit: 1) {
			id
			outcome
			votesFor
			votesAgainst
			votesAbstain
		}
	}
`);
