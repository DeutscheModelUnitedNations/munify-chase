import { client } from '#lib/api/rumbleClient/client';
import { getCurrentUser } from '#lib/state/currentUser.svelte';
import { participantSelection } from '../selections';

/**
 * The signed-in user's part in the conference, with their seat, or undefined when they have
 * none. The live query starts on the calling component's behalf, like a direct call would.
 */
export async function loadParticipantUser(conferenceId: string | undefined) {
	const currentUser = await getCurrentUser();
	const [conferenceUser] =
		(await client.liveQuery.conferenceUsers({
			__args: {
				where: {
					conference: { id: { eq: conferenceId } },
					user: { id: { eq: currentUser?.id ?? '' } }
				}
			},
			...participantSelection
		})) ?? [];
	return conferenceUser;
}

type Seated<R> = {
	committeeMember?: { representation?: R | null } | null;
	conferenceMember?: { representation?: R | null } | null;
};

/** The delegation or NSA the participant sits for: their committee seat, else their conference seat. */
export function participantRepresentation<R>(conferenceUser: Seated<R> | null | undefined) {
	return (
		conferenceUser?.committeeMember?.representation ??
		conferenceUser?.conferenceMember?.representation
	);
}
