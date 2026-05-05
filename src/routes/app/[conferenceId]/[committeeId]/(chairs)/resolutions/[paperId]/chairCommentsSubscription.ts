import { graphql } from '$houdini';

export const ChairPaperCommentsSubscription = graphql(`
	subscription ChairPaperCommentsSubscription($paperId: ID!) {
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
				user {
					givenName
					familyName
				}
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
