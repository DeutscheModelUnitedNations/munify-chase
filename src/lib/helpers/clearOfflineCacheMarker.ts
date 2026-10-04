/**
 * Cookie set by `/logout` that tells the next client start to wipe the persisted graphcache.
 *
 * The cache can't be cleared during logout itself: the browser leaves the app for the
 * OIDC provider before any client code runs, and the IndexedDB is held open by the
 * running client. Without this, the offline exchange would keep serving the previous
 * user's data (identity, conferences) to whoever opens `/app` next on this device.
 */
export const CLEAR_OFFLINE_CACHE_COOKIE = 'chase_clear_offline_cache';

/** Whether a logout left the marker behind. Browser only. */
export function hasClearOfflineCacheMarker(): boolean {
	return document.cookie
		.split(';')
		.some((c) => c.trim().startsWith(`${CLEAR_OFFLINE_CACHE_COOKIE}=`));
}

/** Removes the marker. Call only once the cache was cleared, so a failed clear is retried. */
export function removeClearOfflineCacheMarker(): void {
	document.cookie = `${CLEAR_OFFLINE_CACHE_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
}
