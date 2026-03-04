import { graphql } from '$houdini';

export const PaperClauseLocksSubscription = graphql(`
	subscription PaperClauseLocksSubscription($paperId: ID!) {
		findManyPaperClauseLock(where: { paperId: $paperId }) {
			id
			clauseId
			conferenceUserId
			acquiredAt
			conferenceUser {
				committeeMember {
					representation {
						name
						alpha3Code
						alpha2Code
						faIcon
					}
				}
			}
		}
	}
`);
