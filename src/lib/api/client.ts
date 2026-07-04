import { nativeDateExchange } from '@m1212e/rumble/client';
import {
	Client,
	CombinedError,
	type Exchange,
	type Operation,
	fetchExchange,
	makeOperation,
	subscriptionExchange
} from '@urql/core';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { crossTabSyncExchange } from '@m1212e/urql-crosstab-sync';
import { filter, map, onPush, pipe } from 'wonka';
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

if (browser) {
	const storage = makeDefaultStorage({
		idbName: 'chase-cache',
		maxAge: 7
	});

	// graphcache wires its offline-mutation-queue flush to `storage.onOnline`, which
	// only fires on the browser 'online' event (navigator.onLine). A server/WS-only
	// outage never toggles navigator.onLine, so the queue would otherwise stall until
	// the next real network blip. Capture the flush callback(s) graphcache registers
	// so we can also trigger them on WebSocket reconnect (see wsClient.on.connected).
	const onlineCallbacks = new Set<() => void>();
	const baseOnOnline = storage.onOnline?.bind(storage);
	storage.onOnline = (cb: () => void) => {
		onlineCallbacks.add(cb);
		baseOnOnline?.(cb);
	};
	const flushOfflineQueue = () => {
		for (const cb of onlineCallbacks) cb();
	};

	// Track active queries so we can refetch them (network-only) on WS reconnect.
	// Subscriptions resubscribe themselves via graphql-ws retry, but plain query data
	// can be stale after an outage. `reexecuteActiveQueries` is assigned once the
	// exchange runs.
	const activeQueries = new Map<number, Operation>();
	let reexecuteActiveQueries = () => {};
	const trackQueriesExchange: Exchange =
		({ client, forward }) =>
		(ops$) => {
			reexecuteActiveQueries = () => {
				for (const op of activeQueries.values()) {
					client.reexecuteOperation(
						makeOperation('query', op, { ...op.context, requestPolicy: 'network-only' })
					);
				}
			};
			return pipe(
				ops$,
				onPush((op) => {
					if (op.kind === 'query') activeQueries.set(op.key, op);
					else if (op.kind === 'teardown') activeQueries.delete(op.key);
				}),
				forward
			);
		};

	// Cross-tab synthetic mutations have two failure modes that wipe their
	// optimistic layer in the popup tab when the chair's underlying mutation
	// fails (always, while offline):
	//
	//   1. The error result emitted by `crossTabSyncExchange.receiver.results$`
	//      reaches `offlineExchange`'s offline-error filter. That filter only
	//      protects the layer when `context.optimistic` is true, and the
	//      synthetic op `crossTabSyncExchange` creates doesn't set it. The
	//      result therefore reaches `cacheExchange.updateCacheWithResult`,
	//      which rolls the layer back.
	//
	//   2. Right after delivering the result, `crossTabSyncExchange` also
	//      unsubscribes the synthetic op's subscription. urql dispatches a
	//      `teardown` op for it, which `cacheExchange.prepareForwardedOperation`
	//      handles by calling `noopDataState → reserveLayer → clearLayer` —
	//      wiping the optimistic layer regardless of the filter.
	//
	// Sitting outermost (above `offlineExchange`), this exchange:
	//   - stamps synthetic remote mutations with `optimistic: true` so the
	//     offline-error filter catches their error result, and
	//   - swallows `teardown` ops for those mutations so they never reach
	//     `cacheExchange` and the layer survives for the lifetime of the
	//     offline session.
	//
	// The popup's modal is therefore driven by the same cache state the chair
	// writes optimistically, via the normal cross-tab mutation sync.
	const keepSyntheticOptimisticExchange: Exchange =
		({ forward }) =>
		(ops$) => {
			const syntheticKeys = new Set<number>();
			return pipe(
				ops$,
				filter((op) => {
					if (op.kind === 'teardown' && syntheticKeys.has(op.key)) {
						syntheticKeys.delete(op.key);
						return false;
					}
					return true;
				}),
				map((op) => {
					if (op.kind !== 'mutation') return op;
					const meta = (op.context as { crossTabSync?: { remote?: boolean } }).crossTabSync;
					if (!meta?.remote) return op;
					syntheticKeys.add(op.key);
					if (op.context.optimistic) return op;
					return makeOperation(op.kind, op, { ...op.context, optimistic: true });
				}),
				forward
			);
		};

	exchanges.push(
		trackQueriesExchange,
		keepSyntheticOptimisticExchange,
		offlineExchange({
			schema,
			storage,
			optimistic,
			updates
		}),
		crossTabSyncExchange({ channelName: 'chase-cross-tab-sync' })
	);

	const pendingNonSubscriptions = new Map<
		number,
		{ sink: { error?: (err: unknown) => void }; unsubscribe: () => void }
	>();

	let wsConnected = false;
	let everConnected = false;

	const wsClient = createWSClient({
		url: wsUrl,
		shouldRetry: () => true,
		connectionParams: () => {
			const token = getCachedAccessToken();
			return token ? { Authorization: `Bearer ${token}` } : {};
		},
		on: {
			connected: () => {
				const isReconnect = everConnected;
				everConnected = true;
				wsConnected = true;
				setWsConnected(true);
				if (isReconnect) {
					// The WS came back. navigator.onLine may never have toggled (a
					// server/WS-only outage), so explicitly flush the offline mutation
					// queue and refetch active queries to reconcile any state the
					// subscriptions missed while we were disconnected.
					flushOfflineQueue();
					reexecuteActiveQueries();
				}
			},
			closed: () => {
				wsConnected = false;
				setWsConnected(false);
				for (const [, { sink, unsubscribe }] of pendingNonSubscriptions) {
					unsubscribe();
					// Surface as an offline-style network error (a CombinedError carrying a
					// networkError whose message matches graphcache's isOfflineError check)
					// so an in-flight optimistic mutation is queued for retry on reconnect
					// instead of being dropped. A plain Error fails that check and is lost.
					sink.error?.(
						new CombinedError({
							networkError: new Error('network error: WebSocket connection lost')
						})
					);
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
}

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
