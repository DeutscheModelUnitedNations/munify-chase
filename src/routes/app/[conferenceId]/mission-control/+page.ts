import { graphql } from '$houdini';
import type { MissionControlQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query MissionControlQuery($conferenceId: ID!) {
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
	}
`);

export const _MissionControlQueryVariables: MissionControlQueryVariables = (event) => {
	return {
		conferenceId: event.params.conferenceId
	};
};
