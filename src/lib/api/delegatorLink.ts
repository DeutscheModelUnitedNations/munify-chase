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

/**
 * "Sync now", both ways (`docs/plans/delegator-link.md`): this instance's link worker asks DELEGATOR
 * for everything again, and DELEGATOR's reads this instance again (asked by this server with its
 * link token, which never reaches the browser). The two are independent: DELEGATOR failing to
 * answer leaves this side's sync running, and is reported on its own.
 */
export async function syncLinkBothWays({
	requestLocal,
	requestRemote
}: {
	requestLocal: () => PromiseLike<boolean>;
	requestRemote: () => PromiseLike<boolean>;
}) {
	const [local, remote] = await Promise.allSettled([requestLocal(), requestRemote()]);
	return { local, remote };
}
