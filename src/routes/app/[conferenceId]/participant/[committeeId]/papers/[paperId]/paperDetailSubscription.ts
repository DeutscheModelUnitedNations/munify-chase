import { graphql } from '$houdini';

export const ParticipantPaperDetailSubscription = graphql(`
	subscription ParticipantPaperDetailSubscription($paperId: ID!) {
		findFirstResolutionPaper(where: { id: $paperId }) {
			id
			title
			status
			content
			documentNumber
			creatorCommitteeMemberId
			updatedAt
			creator {
				id
				representation {
					name
					alpha3Code
					alpha2Code
					faIcon
				}
			}
			sponsors {
				id
				committeeMemberId
				committeeMember {
					representation {
						name
						alpha3Code
						alpha2Code
						faIcon
					}
				}
			}
			shareCodes {
				id
				code
				permission
			}
			editors {
				id
				conferenceUserId
			}
		}
	}
`);
