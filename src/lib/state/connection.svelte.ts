// Reactive WebSocket connection state.
// `client.ts` calls setWsConnected on every connect/close event.
// null = not yet established (page just loaded, WS handshake in progress).
// false = disconnected — show offline banner.
// true = connected.

let wsConnected = $state<boolean | null>(null);
let prevConnected: boolean | null = null;

export function setWsConnected(connected: boolean) {
	prevConnected = wsConnected;
	wsConnected = connected;
}

export function getWsConnected(): boolean | null {
	return wsConnected;
}

/** True only when the state flipped from a confirmed false → true (not from null → true). */
export function justReconnected(): boolean {
	return prevConnected === false && wsConnected === true;
}
