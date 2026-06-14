import { nativeDateExchange } from '@m1212e/rumble/client';
import {
	Client,
	CombinedError,
	type Exchange,
	fetchExchange,
	makeOperation,
	subscriptionExchange
} from '@urql/core';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { crossTabSyncExchange } from '@m1212e/urql-crosstab-sync';
import { empty, filter, fromPromise, map, merge, mergeMap, pipe } from 'wonka';
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
	const storage = makeDefaultStorage({
		idbName: 'chase-cache',
		maxAge: 7
	});

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

	const wsClient = createWSClient({
		url: '/api/graphql',
		shouldRetry: () => true,
		on: {
			connected: () => {
				wsConnected = true;
				setWsConnected(true);
			},
			closed: () => {
				wsConnected = false;
				setWsConnected(false);
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
