import { graphql } from '$houdini';
import type { ParticipantCommitteeLayoutQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ParticipantCommitteeLayoutQuery($committeeId: ID!) {
		findFirstCommittee(where: { id: $committeeId }) {
			id
			abbreviation
			name
			activeAgendaItem {
				id
				title
			}
		}
	}
`);

export const _ParticipantCommitteeLayoutQueryVariables: ParticipantCommitteeLayoutQueryVariables = (
	event
) => {
	return {
		committeeId: event.params.committeeId
	};
};
