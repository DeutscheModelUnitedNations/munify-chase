import { graphql } from '$houdini';

export const MissionControlSubscription = graphql(`
	subscription MissionControlSubscription($conferenceId: ID!) {
		findFirstConference(where: { id: $conferenceId }) {
			id
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
