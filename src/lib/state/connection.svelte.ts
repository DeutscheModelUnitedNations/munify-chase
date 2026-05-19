/**
 * Reactive connection state.
 * Combines navigator.onLine with WebSocket connectivity reported by graphql-ws.
 * Use `isOnline` as the single source of truth for offline-aware UI and the
 * urql offlineExchange's `isOfflineError` hook.
 */

let wsConnected = $state(false);
let browserOnline = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

export function setWsConnected(value: boolean) {
	wsConnected = value;
}

export function isOnline(): boolean {
	return browserOnline && wsConnected;
}

if (typeof window !== 'undefined') {
	window.addEventListener('online', () => {
		browserOnline = true;
	});
	window.addEventListener('offline', () => {
		browserOnline = false;
	});
}

/** Reactive derived value for UI components. */
export const connectionState = {
	get online() {
		return isOnline();
	},
	get wsConnected() {
		return wsConnected;
	},
	get browserOnline() {
		return browserOnline;
	}
};
