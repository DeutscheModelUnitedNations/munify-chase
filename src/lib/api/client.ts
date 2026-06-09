import { nativeDateExchange } from '@m1212e/rumble/client';
import { Client, type Exchange, fetchExchange, subscriptionExchange } from '@urql/core';
import { offlineExchange } from '@m1212e/urql-exchange-graphcache';
import { makeDefaultStorage } from '@m1212e/urql-exchange-graphcache/default-storage';
import { browser } from '$app/environment';
import { schema } from './rumbleClient/schema';
import { optimistic, updates } from './optimisticUpdateHandlers';
import { setWsConnected } from '$lib/state/connection.svelte';
import { createClient as createWSClient } from 'graphql-ws';
import { configPublic } from '$config/public';
import { getCachedAccessToken } from '$lib/platform/oidc';

const graphqlUrl = configPublic.PUBLIC_API_URL;
const wsUrl = graphqlUrl.replace(/^https/, 'wss').replace(/^http/, 'ws');

const exchanges: Exchange[] = [nativeDateExchange];

// Captured by the storage wrapper below so the WS connected handler can also
// flush the offline mutation queue without relying on navigator.onLine.
let triggerFlush: (() => void) | undefined;

const storage = makeDefaultStorage({
	idbName: 'chase-cache',
	maxAge: 7
});

// Wrap the storage to intercept onOnline so we can trigger a flush from two
// sources: the browser online event (original behaviour) and the WS reconnect
// event (needed when only the server goes down while the browser stays online).
const wrappedStorage = {
	...storage,
	onOnline(cb: () => void) {
		triggerFlush = cb;
		storage.onOnline!(cb);
	}
};

exchanges.push(
	offlineExchange({
		schema,
		storage: wrappedStorage,
		optimistic,
		updates,
		broadcastChannel: 'chase-cross-tab-sync',
		// Treat any network-level failure with no response as an offline error.
		// The default predicate requires navigator.onLine === false or specific
		// error message strings (which don't match on Safari or when only the
		// server is down). This broader check works across all browsers and in
		// server-down scenarios where the browser network remains up.
		isOfflineError: (error) => {
			if (error?.networkError && !error?.response) return true;
			const status = (error?.response as Response | undefined)?.status;
			return status === 502 || status === 503 || status === 504;
		},
		// Capture the flush function so WS reconnects can drain the queue too.
		onFlushReady: (flush) => {
			triggerFlush = flush;
		}
	})
);

// Tracks in-flight queries and mutations sent via WS so we can fail them
// immediately when the connection drops instead of waiting for graphql-ws to
// retry — the offlineExchange then queues and replays them on reconnect.
const pendingNonSubscriptions = new Map<
	number,
	{ sink: { error?: (err: unknown) => void }; unsubscribe: () => void }
>();

let wsConnected = false;

const wsClient = createWSClient({
	url: wsUrl,
	shouldRetry: () => true,
	connectionParams: () => {
		const token = getCachedAccessToken();
		return token ? { Authorization: `Bearer ${token}` } : {};
	},
	on: {
		connected: () => {
			wsConnected = true;
			// Flush the offline mutation queue when the WS reconnects. This covers
			// the case where the server restarts but navigator.onLine never toggled
			// (so the browser online event never fired).
			triggerFlush?.();
		},
		closed: () => {
			wsConnected = false;
			// Fail all in-flight non-subscription operations immediately.
			// Calling unsubscribe() first marks the operation as done in graphql-ws
			// so it won't retry it after reconnecting — the offlineExchange owns
			// the retry instead. isOfflineError catches the resulting networkError
			// (no response) and queues the operation in failedQueue.
			for (const [, { sink, unsubscribe }] of pendingNonSubscriptions) {
				unsubscribe();
				sink.error?.(new Error('WebSocket connection lost'));
			}
			pendingNonSubscriptions.clear();
		}
	}
});

exchanges.push(
	subscriptionExchange({
		isSubscriptionOperation: (op) => op.kind === 'subscription' || wsConnected,
		forwardSubscription(request, operation) {
			const input = { ...request, query: request.query || '' };
			return {
				subscribe(sink) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const innerUnsubscribe = wsClient.subscribe(input, sink as any);

					if (operation.kind !== 'subscription') {
						pendingNonSubscriptions.set(operation.key, {
							sink,
							unsubscribe: innerUnsubscribe
						});
						return {
							unsubscribe() {
								pendingNonSubscriptions.delete(operation.key);
								innerUnsubscribe();
							}
						};
					}

					return { unsubscribe: innerUnsubscribe };
				}
			};
		}
	})
);

exchanges.push(fetchExchange);

export const urqlClient = new Client({
	url: graphqlUrl,
	// check for session timeouts?
	// fetchSubscriptions: true, // subscriptions via SSE (default yoga implementation)
	exchanges,
	fetchOptions: () => {
		const headers: Record<string, string> = {};
		const token = getCachedAccessToken();
		if (token) headers['Authorization'] = `Bearer ${token}`;
		return { credentials: 'include', headers };
	},
	requestPolicy: 'cache-and-network'
});
