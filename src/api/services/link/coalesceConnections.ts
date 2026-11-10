/** How long reconnects are gathered into one report: they arrive as each subscription retries. */
export const RECONNECT_DEBOUNCE_MS = 1000;

/**
 * Turns the `connected` events of many subscriptions, each on its own connection (graphql-sse's
 * distinct connections mode), into what a single stream used to report: the first connection once
 * (`false`), then each burst of reconnects once (`true`), `RECONNECT_DEBOUNCE_MS` after its last.
 */
export function coalesceConnections(onConnected?: (reconnected: boolean) => void) {
	let first = true;
	let timer: ReturnType<typeof setTimeout> | undefined;
	return {
		connected(reconnected: boolean) {
			if (!onConnected) return;
			if (!reconnected) {
				if (!first) return;
				first = false;
				onConnected(false);
				return;
			}
			clearTimeout(timer);
			timer = setTimeout(() => {
				timer = undefined;
				onConnected(true);
			}, RECONNECT_DEBOUNCE_MS);
		},
		dispose() {
			clearTimeout(timer);
			timer = undefined;
		}
	};
}
