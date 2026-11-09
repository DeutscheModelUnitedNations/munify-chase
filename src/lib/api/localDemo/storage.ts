/*
 * The demo's state survives reloads in localStorage, best effort: where storage is missing,
 * disabled, full or holds something unreadable, the demo just starts from its defaults.
 */

export function readStoredJson<T>(
	key: string,
	reviver?: (key: string, value: unknown) => unknown
): T | undefined {
	if (typeof localStorage === 'undefined') return undefined;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw, reviver) : undefined;
	} catch {
		return undefined;
	}
}

export function writeStoredJson(key: string, value: unknown) {
	if (typeof localStorage === 'undefined') return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Best-effort only (e.g. storage disabled/full) — falls back to the in-memory state.
	}
}
