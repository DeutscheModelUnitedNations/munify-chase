import { graphql } from '$houdini';
import type { ChairPaperDetailQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ChairPaperDetailQuery($paperId: ID!, $conferenceId: ID!, $userId: ID!) {
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
		currentUser: findManyConferenceUser(
			where: { conferenceId: $conferenceId, user: { id: $userId } }
			limit: 1
		) {
			id
		}
	}
`);

export const _ChairPaperDetailQueryVariables: ChairPaperDetailQueryVariables = async (event) => {
	const { user } = await event.parent();
	return {
		paperId: event.params.paperId,
		conferenceId: event.params.conferenceId,
		userId: user.sub
	};
};
