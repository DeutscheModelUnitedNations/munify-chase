/**
 * Cookie set by `/logout` that tells the next client start to wipe the persisted graphcache.
 *
 * The cache can't be cleared during logout itself: the browser leaves the app for the
 * OIDC provider before any client code runs, and the IndexedDB is held open by the
 * running client. Without this, the offline exchange would keep serving the previous
 * user's data (identity, conferences) to whoever opens `/app` next on this device.
 */
export const CLEAR_OFFLINE_CACHE_COOKIE = 'chase_clear_offline_cache';

/** Reads and removes the marker. Browser only. */
export function consumeClearOfflineCacheMarker(): boolean {
	const present = document.cookie
		.split(';')
		.some((c) => c.trim().startsWith(`${CLEAR_OFFLINE_CACHE_COOKIE}=`));
	if (present) {
		document.cookie = `${CLEAR_OFFLINE_CACHE_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
	}
	return present;
}
