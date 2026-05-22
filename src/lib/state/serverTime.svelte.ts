import { browser } from '$app/environment';
import { urqlClient } from '$lib/api/client';
import dayjs, { type Dayjs } from 'dayjs';

let current = $state(dayjs());
const intervalDuration = 500;
const resyncInterval = 5 * 60 * 1000;
// Difference (in ms) between the server clock and this device's clock, refreshed on every sync.
let offset = 0;

function anchorToServerTime() {
	current = dayjs().add(offset, 'ms');
}

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
		offset = dayjs(servertime).diff(dayjs());
		anchorToServerTime();
	}
}

if (browser) {
	await syncWithServer();
	// Re-anchor to the real wall clock on every tick instead of incrementing by a fixed amount.
	// setInterval is throttled/paused in background tabs and on sleeping devices, so incrementing
	// would silently fall behind real time and desync timers across clients.
	setInterval(anchorToServerTime, intervalDuration);
	// Periodically re-sync the offset to correct long-term wall-clock drift (e.g. NTP adjustments).
	setInterval(syncWithServer, resyncInterval);
	// Re-anchor immediately when the tab regains focus (the interval may have been throttled).
	document.addEventListener('visibilitychange', () => {
		if (!document.hidden) anchorToServerTime();
	});
}

export function getServerTime(): Dayjs {
	return current;
}
