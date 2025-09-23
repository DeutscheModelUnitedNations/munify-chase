import { graphql } from '$houdini';

export const SetPresenceMutation = graphql(`
	mutation SetPresence($memberIds: [ID!]!, $present: Boolean!) {
		setPresenceForCommitteeMembers(ids: $memberIds, present: $present) {
			id
			present
		}
	}
`);
