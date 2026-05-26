import { nativeDateExchange } from '@m1212e/rumble/client';
import {
	Client,
	CombinedError,
	type Exchange,
	fetchExchange,
	subscriptionExchange
} from '@urql/core';
import { cacheExchange } from '@m1212e/urql-exchange-graphcache';
import { empty, filter, fromPromise, merge, mergeMap, pipe } from 'wonka';
import { graphqlMutation, graphqlQuery } from '$api/graphql.remote';
import { browser } from '$app/environment';
import { schema } from './rumbleClient/schema';
import { optimistic, updates } from './optimisticUpdateHandlers';
import { retryExchange } from '@urql/exchange-retry';
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
	exchanges.push(
		cacheExchange({
			schema,
			optimistic,
			updates,
			broadcastChannel: 'chase-cross-tab-sync'
		})
	);

	exchanges.push(
		retryExchange({
			initialDelayMs: 1000,
			maxDelayMs: 15000,
			randomDelay: true,
			maxNumberAttempts: 3,
			// Only retry on network errors/when offline
			retryIf: (err) => err && err.networkError != null
		})
	);
}
if (!browser) {
	// TODO maybe remove when remote functions can handle subscriptions
	exchanges.push(remoteFunctionsExchange);
}
if (browser) {
	let wsConnected = false;

	const wsClient = createWSClient({
		url: '/api/graphql',
		shouldRetry: () => true,
		on: {
			connected: () => {
				wsConnected = true;
			},
			closed: () => {
				wsConnected = false;
			}
		}
	});

	exchanges.push(
		subscriptionExchange({
			isSubscriptionOperation: (op) => op.kind === 'subscription' || wsConnected,
			forwardSubscription(request) {
				const input = { ...request, query: request.query || '' };
				return {
					subscribe(sink) {
						const unsubscribe = wsClient.subscribe(input, sink);
						return { unsubscribe };
					}
				};
			}
		})
	);
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
