import { graphql } from '$houdini';
import type { ParticipantPaperDetailQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ParticipantPaperDetailQuery($paperId: ID!) {
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

export const _ParticipantPaperDetailQueryVariables: ParticipantPaperDetailQueryVariables = (
	event
) => {
	return {
		paperId: event.params.paperId
	};
};
