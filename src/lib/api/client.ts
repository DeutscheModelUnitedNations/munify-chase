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
			isOfflineError: (error) => !!error?.networkError && !error?.response
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
