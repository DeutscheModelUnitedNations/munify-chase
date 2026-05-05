import { graphql } from '$houdini';
import type { ParticipantPapersQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ParticipantPapersQuery($committeeId: ID!) {
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

export const _ParticipantPapersQueryVariables: ParticipantPapersQueryVariables = (event) => {
	return {
		committeeId: event.params.committeeId
	};
};
