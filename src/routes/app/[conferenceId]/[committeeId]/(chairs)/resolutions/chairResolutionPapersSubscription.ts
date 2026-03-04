import { graphql } from '$houdini';

export const ChairResolutionPapersSubscription = graphql(`
	subscription ChairResolutionPapersSubscription($committeeId: ID!) {
		findManyResolutionPaper(where: { committeeId: $committeeId }) {
			id
			title
			status
			documentNumber
			sequenceNumber
			updatedAt
			creatorCommitteeMemberId
			agendaItem {
				id
				title
			}
			creator {
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
