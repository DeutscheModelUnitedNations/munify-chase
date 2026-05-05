import { graphql } from '$houdini';
import { error } from '@sveltejs/kit';
import type { ConferenceConfigQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query ConferenceConfigQuery($conferenceId: ID!, $userId: ID!) {
		findFirstConference(where: { id: $conferenceId }) {
			id
			title
			pressWebsite
			location
			startDate
			endDate
			hasModeratedCaucus
			resolutionFeatureEnabled
			users {
				id
				userEmail
				conferenceUserType
				user {
					givenName
					familyName
				}
				committeeMember {
					id
					representation {
						id
						name
						alpha2Code
						alpha3Code
						faIcon
					}
					committee {
						id
						name
						abbreviation
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
			committees {
				id
				name
				abbreviation
				members {
					id
					representation {
						id
						name
						alpha2Code
						alpha3Code
						faIcon
						type
					}
				}
			}
			members {
				id
				representation {
					id
					name
					alpha3Code
					type
					faIcon
				}
			}
			representations {
				id
				name
				alpha2Code
				alpha3Code
				type
				faIcon
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
