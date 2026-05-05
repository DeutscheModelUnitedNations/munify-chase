import { graphql } from '$houdini';
import type { ChairResolutionPapersQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ChairResolutionPapersQuery($committeeId: ID!) {
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

export const _ChairResolutionPapersQueryVariables: ChairResolutionPapersQueryVariables = (
	event
) => {
	return {
		committeeId: event.params.committeeId
	};
};
