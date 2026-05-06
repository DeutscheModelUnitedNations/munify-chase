import { graphql } from '$houdini';
import type { LauncherQueryVariables } from './$houdini';

export const _houdini_load = graphql(`
	query LauncherQuery($userId: ID!) {
		findManyConferenceUser(where: { user: { id: $userId } }) {
			id
			conferenceUserType
			committeeMemberId
			committeeMember {
				committeeId
				committee {
					abbreviation
				}
				representation {
					alpha2Code
					alpha3Code
					type
					name
					faIcon
				}
			}
			conferenceMember {
				representation {
					alpha2Code
					alpha3Code
					type
					name
					faIcon
				}
			}
			conference {
				id
				title
				location
				startDate
				endDate
				committees {
					id
					abbreviation
				}
			}
		}
		isGlobalAdmin
		findManyConference {
			id
			title
			location
			startDate
			endDate
			committees {
				id
				abbreviation
			}
		}
	}
`);

export const _LauncherQueryVariables: LauncherQueryVariables = async (event) => {
	const { user } = await event.parent();

	return {
		userId: user.sub
	};
};
