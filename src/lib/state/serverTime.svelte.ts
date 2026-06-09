import { browser } from '$app/environment';
import { urqlClient } from '$lib/api/client';
import dayjs from 'dayjs';
import { setOffset, tick } from './serverClock.svelte';

export { getServerTime } from './serverClock.svelte';

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
		setOffset(dayjs(servertime).diff(dayjs()));
	}
}

if (browser) {
	await syncWithServer();
	// Re-anchor to the real wall clock on every tick instead of incrementing by a fixed amount.
	// setInterval is throttled/paused in background tabs and on sleeping devices, so incrementing
	// would silently fall behind real time and desync timers across clients.
	setInterval(tick, intervalDuration);
	// Periodically re-sync the offset to correct long-term wall-clock drift (e.g. NTP adjustments).
	setInterval(syncWithServer, resyncInterval);
	// Re-anchor immediately when the tab regains focus (the interval may have been throttled).
	document.addEventListener('visibilitychange', () => {
		if (!document.hidden) tick();
	});
}
