import { graphql } from '$houdini';
import type { ConferenceConfigQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ConferenceConfigQuery($conferenceId: ID!) {
		findFirstConference(where: { id: $conferenceId }) {
			id
			title
			users {
				id
				userEmail
				conferenceUserType
			}
		}
	}
`);

export const _ConferenceConfigQueryVariables: ConferenceConfigQueryVariables = (event) => {
	return {
		conferenceId: event.params.conferenceId
	};
};
