import { graphql } from '$houdini';

export const ParticipantPapersSubscription = graphql(`
	subscription ParticipantPapersSubscription($committeeId: ID!) {
		findManyResolutionPaper(where: { committeeId: $committeeId }) {
			id
			title
			status
			updatedAt
			creatorCommitteeMemberId
			documentNumber
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
				committeeMemberId
				committeeMember {
					representation {
						name
						alpha2Code
						faIcon
					}
				}
			}
			editors {
				conferenceUserId
			}
		}
	}
`);
