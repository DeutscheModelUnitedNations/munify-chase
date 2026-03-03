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
			}
			conference {
				id
				title
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
