import { graphql } from '$houdini';
import { error } from '@sveltejs/kit';
import type { ConferenceConfigQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ConferenceConfigQuery($conferenceId: ID!, $userId: ID!) {
		findFirstConference(where: { id: $conferenceId }) {
			id
			title
			users {
				id
				userEmail
				conferenceUserType
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

export const _ConferenceConfigQueryVariables: ConferenceConfigQueryVariables = async (event) => {
	const { user } = await event.parent();
	if (!user?.sub) {
		error(401, 'Unauthorized');
	}
	return {
		conferenceId: event.params.conferenceId,
		userId: user.sub
	};
};
