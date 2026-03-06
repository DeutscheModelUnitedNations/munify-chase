import { graphql } from '$houdini';

export const ParticipantAmendmentsSubscription = graphql(`
	subscription ParticipantAmendmentsSubscription($paperId: ID!) {
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
