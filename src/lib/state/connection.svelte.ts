// Reactive WebSocket connection state.
// `client.ts` calls setWsConnected on every connect/close event.
// null = not yet established (page just loaded, WS handshake in progress).
// false = disconnected — show offline banner.
// true = connected.
//
// The "disconnected" state is debounced: a drop that reconnects within
// DISCONNECT_GRACE_MS is invisible to the UI. This prevents the offline
// banner from flickering during brief reconnects (e.g. server restart,
// token refresh, OS network change in the native desktop client).

const DISCONNECT_GRACE_MS = 2000;

let wsConnected = $state<boolean | null>(null);
let prevConnected: boolean | null = null;
let disconnectTimer: ReturnType<typeof setTimeout> | null = null;

export function setWsConnected(connected: boolean) {
	if (connected) {
		// Cancel any pending disconnect and transition immediately to connected.
		if (disconnectTimer !== null) {
			clearTimeout(disconnectTimer);
			disconnectTimer = null;
		}
		prevConnected = wsConnected;
		wsConnected = true;
	} else {
		// Delay the disconnected state so brief reconnects don't flash the banner.
		if (disconnectTimer !== null) return;
		disconnectTimer = setTimeout(() => {
			disconnectTimer = null;
			prevConnected = wsConnected;
			wsConnected = false;
		}, DISCONNECT_GRACE_MS);
	}
}

export function getWsConnected(): boolean | null {
	return wsConnected;
}

/** True only when the state flipped from a confirmed false → true (not from null → true). */
export function justReconnected(): boolean {
	return prevConnected === false && wsConnected === true;
}
