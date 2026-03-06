import { graphql } from '$houdini';

export const ChairAmendmentsSubscription = graphql(`
	subscription ChairAmendmentsSubscription($paperId: ID!) {
		findManyAmendment(where: { paperId: $paperId }) {
			id
			type
			status
			documentNumber
			targetClauseId
			targetOperativeIndex
			targetPosition
			newContent
			proposerCommitteeMemberId
			createdAt
			proposer {
				id
				representation {
					name
					alpha2Code
					alpha3Code
					faIcon
				}
			}
			sponsors {
				id
				committeeMemberId
				committeeMember {
					id
					representation {
						name
						alpha2Code
						alpha3Code
						faIcon
					}
				}
			}
		}
	}
`);
