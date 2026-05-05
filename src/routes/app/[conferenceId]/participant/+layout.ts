import { graphql } from '$houdini';
import type { ParticipantIdentityQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ParticipantIdentityQuery($conferenceId: ID!, $userId: ID!) {
		findManyConferenceUser(where: { conference: { id: $conferenceId }, user: { id: $userId } }) {
			id
			conferenceUserType
			committeeMemberId
			conferenceMemberId
			committeeMember {
				id
				present
				committeeId
				representation {
					id
					name
					alpha2Code
					alpha3Code
					type
					faIcon
				}
			}
			conferenceMember {
				id
				representation {
					id
					name
					alpha3Code
					type
					faIcon
				}
			}
		}
	}
`);

export const _ParticipantIdentityQueryVariables: ParticipantIdentityQueryVariables = async (
	event
) => {
	const { user } = await event.parent();

	return {
		conferenceId: event.params.conferenceId,
		userId: user.sub
	};
};
