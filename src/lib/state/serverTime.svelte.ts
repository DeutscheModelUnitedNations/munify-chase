import { browser } from '$app/environment';
import { urqlClient } from '$lib/api/client';
import dayjs, { type Dayjs } from 'dayjs';

let current = $state(dayjs());
const intervalDuration = 500;
const resyncInterval = 5 * 60 * 1000;

async function syncWithServer() {
	const result = await urqlClient
		.query(
			'{ serverTime }',
			{},
			// use the raw urql client here since we need to skip all cache here
			{ requestPolicy: 'network-only' }
		)
		.toPromise();
	const servertime: Date | undefined = result.data?.serverTime;
	if (servertime) {
		current = dayjs(servertime);
	}
}

if (browser) {
	await syncWithServer();
	setInterval(() => {
		current = current.add(intervalDuration, 'ms');
	}, intervalDuration);
	setInterval(syncWithServer, resyncInterval);
}

export function getServerTime(): Dayjs {
	return current;
}
