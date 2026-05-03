import { nativeDateExchange } from '@m1212e/rumble/client';
import {
	Client,
	fetchExchange,
	subscriptionExchange
} from '@urql/core';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { schema } from './rumbleClient/schema';
import { optimistic } from './optimisticUpdateHandlers';
import { retryExchange } from '@urql/exchange-retry';
import { createClient as createWSClient } from 'graphql-ws';
import { dev } from '$app/environment';

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

export const urqlClient = new Client({
	url: '/api/graphql',
	// check for session timeouts?
	fetchSubscriptions: dev, // subscriptions via ws not supported in tauri fork, fallback to SSE in dev mode
	exchanges: [
		nativeDateExchange,
		offlineExchange({
			schema,
			optimistic,
			broadcastChannel: 'chase-broadcast-channel',
			storage: makeDefaultStorage({
				idbName: 'chase-offline-cache',
				maxAge: 1
			})
		}),
		retryExchange({
			initialDelayMs: 1000,
			maxDelayMs: 15000,
			randomDelay: true,
			maxNumberAttempts: 3,
			// Only retry on network errors/when offline
			retryIf: (err) => err && err.networkError != null
		}),
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
		}),
		fetchExchange
	],
	fetchOptions: {
		credentials: 'include'
	},
	requestPolicy: 'cache-and-network'
});
