import { graphql } from '$houdini';

export const ChairPaperDetailSubscription = graphql(`
	subscription ChairPaperDetailSubscription($paperId: ID!) {
		findFirstResolutionPaper(where: { id: $paperId }) {
			id
			title
			status
			content
			documentNumber
			sequenceNumber
			updatedAt
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
