import { client } from '#lib/api/rumbleClient/client';

/** Where the linked MUNify DELEGATOR is, while one is linked; everybody may read that much. */
export async function fetchActiveDelegatorLink() {
	const links = await client.liveQuery.instanceLinks({
		id: true,
		remoteUrl: true
	});
	return links.at(0);
}

/** A page of the linked DELEGATOR for a conference. */
export function delegatorUrl({
	remoteUrl,
	conferenceId,
	path = ''
}: {
	remoteUrl: string;
	conferenceId: string;
	path?: string;
}) {
	return `${remoteUrl.replace(/\/+$/, '')}/dashboard/${conferenceId}${path}`;
}
