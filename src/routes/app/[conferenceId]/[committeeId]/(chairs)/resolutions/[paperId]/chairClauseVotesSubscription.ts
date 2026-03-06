import { graphql } from '$houdini';

export const ChairClauseVotesSubscription = graphql(`
	subscription ChairClauseVotesSubscription($paperId: ID!) {
		findManyOperativeClauseVote(where: { paperId: $paperId }) {
			id
			clauseId
			outcome
			votesFor
			votesAgainst
			votesAbstain
		}
	}
`);
