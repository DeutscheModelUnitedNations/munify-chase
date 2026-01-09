import { graphql } from '$houdini';
import type { MissionControlQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query MissionControlQuery($conferenceId: ID!, $userId: ID!) {
		findFirstConference(where: { id: $conferenceId }) {
			id
			title
			committees {
				id
				name
				abbreviation
				activeAgendaItem {
					id
					title
				}
				status
				statusHeadline
				statusUntil
				stateOfDebate
				lastResolutionAdoptionDate
			}
		}
		currentUserRole: findManyConferenceUser(
			where: { conferenceId: $conferenceId, user: { id: $userId } }
			limit: 1
		) {
			id
			conferenceUserType
		}
	}
`);

export const _MissionControlQueryVariables: MissionControlQueryVariables = async (event) => {
	const { user } = await event.parent();
	return {
		conferenceId: event.params.conferenceId,
		userId: user?.sub ?? ''
	};
};
