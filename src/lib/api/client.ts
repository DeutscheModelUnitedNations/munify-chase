import { nativeDateExchange } from '@m1212e/rumble/client';
import {
	Client,
	CombinedError,
	type Exchange,
	fetchExchange,
	subscriptionExchange
} from '@urql/core';
import { offlineExchange } from '@m1212e/urql-exchange-graphcache';
import { makeDefaultStorage } from '@m1212e/urql-exchange-graphcache/default-storage';
import { empty, filter, fromPromise, merge, mergeMap, pipe } from 'wonka';
import { graphqlMutation, graphqlQuery } from '$api/graphql.remote';
import { browser } from '$app/environment';
import { schema } from './rumbleClient/schema';
import { optimistic, updates } from './optimisticUpdateHandlers';
import { setWsConnected } from '$lib/state/connection.svelte';
import { createClient as createWSClient } from 'graphql-ws';

/**
 * Exchange to perform graphql calls via sveltekit remote functions (if possible)
 */
const remoteFunctionsExchange: Exchange = ({ forward }) => {
	return (operations) => {
		const filtered = pipe(
			operations,
			// we only wanna use remote functions on the server
			filter((operation) => operation.kind !== 'teardown' && !browser),
			mergeMap((operation) => {
				if (operation.kind === 'subscription') {
					// we cannot do subscriptions on the server yet https://github.com/sveltejs/kit/pull/12973#issuecomment-2981290155
					// for SSR we return empty here and let the fetchExchange handle it in the browser
					return empty;
				}

				const processResult = (caller: typeof graphqlQuery | typeof graphqlMutation) => {
					return fromPromise(
						(async () => {
							const result = await caller({
								query: operation.query,
								variables: operation.variables as Exclude<typeof operation.variables, void>
							});

							return {
								operation,
								data: structuredClone(result.data),
								error: Array.isArray(result.errors)
									? new CombinedError({
											graphQLErrors: result.errors
										})
									: undefined,
								extensions: result.extensions ? { ...result.extensions } : undefined,
								stale: false
							};
						})()
					);
				};

				if (operation.kind === 'query') {
					return processResult(graphqlQuery);
				}

				if (operation.kind === 'mutation') {
					return processResult(graphqlMutation);
				}

				return empty;
			})
		);

		const forwarded = pipe(
			operations,
			filter((operation) => {
				return (
					operation.kind === 'teardown' ||
					// we want to use the fetch action when we are in the browser
					browser
				);
			}),
			forward
		);

		return merge([filtered, forwarded]);
	};
};

const exchanges: Exchange[] = [nativeDateExchange];

if (browser) {
	// Receives the flushQueue callback from offlineExchange once the cache is
	// hydrated. Also called from the WS connected handler so queued mutations
	// are replayed when the server restarts (navigator.onLine stays true in that
	// case, so the browser online event never fires on its own).
	let triggerFlush: (() => void) | undefined;

	const storage = makeDefaultStorage({
		idbName: 'chase-cache',
		maxAge: 7
	});

	exchanges.push(
		offlineExchange({
			schema,
			storage,
			optimistic,
			updates,
			broadcastChannel: 'chase-cross-tab-sync',
			// Treat network-level failures as offline errors so mutations are queued
			// rather than rolled back.  Two cases need covering:
			//   1. Pure TCP failures (ECONNREFUSED, network down, timeout): the fetch
			//      never gets an HTTP response, so error.response is undefined.
			//   2. Reverse-proxy "gateway" errors (502/503/504): the proxy is up but
			//      the backend is down; these DO have an HTTP response object, so the
			//      first check alone misses them and the optimistic update would be
			//      incorrectly rolled back.
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
		url: '/api/graphql',
		shouldRetry: () => true,
		on: {
			connected: () => {
				wsConnected = true;
				setWsConnected(true);
				// Flush the offline mutation queue when the WS reconnects. This covers
				// the case where the server restarts but navigator.onLine never toggled
				// (so the browser online event never fired).
				triggerFlush?.();
			},
			closed: () => {
				wsConnected = false;
				setWsConnected(false);
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
}
if (!browser) {
	// TODO maybe remove when remote functions can handle subscriptions
	exchanges.push(remoteFunctionsExchange);
}

exchanges.push(fetchExchange);

export const urqlClient = new Client({
	url: '/api/graphql',
	// check for session timeouts?
	// fetchSubscriptions: true, // subscriptions via SSE (default yoga implementation)
	exchanges,
	fetchOptions: {
		credentials: 'include'
	}
});
