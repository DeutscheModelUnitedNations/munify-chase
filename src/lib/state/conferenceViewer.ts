import { client } from '$lib/api/rumbleClient/client';
import { getIsGlobalAdmin } from './currentUser.svelte';

/**
 * The conference and the viewer's role in it, as the conference-wide pages (attendance,
 * statistics) need them. The live queries start before the first await, so they belong to
 * the calling component like a direct call would.
 */
export async function loadConferenceViewer(conferenceId: string, userId: string) {
	const [conferenceMeta, conferenceUsers, isGlobalAdmin] = await Promise.all([
		client.liveQuery.conference({
			__args: { id: conferenceId },
			title: true,
			committees: { id: true, name: true, abbreviation: true }
		}),
		client.liveQuery.conferenceUsers({
			__args: {
				where: {
					conference: { id: { eq: conferenceId } },
					user: { id: { eq: userId } }
				}
			},
			id: true,
			conferenceUserType: true
		}),
		getIsGlobalAdmin()
	]);
	return { conferenceMeta, conferenceUsers, isGlobalAdmin };
}
