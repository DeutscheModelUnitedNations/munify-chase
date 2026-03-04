import { graphql } from '$houdini';

export const ParticipantPaperCommentsSubscription = graphql(`
	subscription ParticipantPaperCommentsSubscription($paperId: ID!) {
		findManyResolutionComment(where: { paperId: $paperId }) {
			id
			clauseId
			content
			visibility
			parentCommentId
			createdAt
			updatedAt
			author {
				id
				committeeMember {
					representation {
						name
						alpha2Code
						alpha3Code
						faIcon
					}
				}
				conferenceUserType
			}
		}
	}
`);
