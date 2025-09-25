import { graphql, type CommitteeOverviewQuery } from '$houdini';
import type { CommitteeOverviewQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query CommitteeOverviewQuery($conferenceId: ID!) {
		findFirstConference(where: { id: $conferenceId }) {
			id
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

export const _CommitteeOverviewQueryVariables: CommitteeOverviewQueryVariables = (event) => {
	return {
		conferenceId: event.params.conferenceId
	};
};
