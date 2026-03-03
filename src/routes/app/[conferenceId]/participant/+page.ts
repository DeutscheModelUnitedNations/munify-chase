import { graphql } from '$houdini';
import type { ParticipantConferenceQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ParticipantConferenceQuery($conferenceId: ID!) {
		findFirstConference(where: { id: $conferenceId }) {
			id
			title
			committees {
				id
				name
				abbreviation
				lastResolutionAdoptionDate
				activeAgendaItem {
					id
					title
				}
				status
				statusHeadline
				statusUntil
			}
		}
	}
`);

export const _ParticipantConferenceQueryVariables: ParticipantConferenceQueryVariables = (
	event
) => {
	return {
		conferenceId: event.params.conferenceId
	};
};
