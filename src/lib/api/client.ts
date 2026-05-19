import { nativeDateExchange } from '@m1212e/rumble/client';
import { Client, fetchExchange, subscriptionExchange } from '@urql/core';
import { offlineExchange } from '@m1212e/urql-exchange-graphcache';
import { makeDefaultStorage } from '@m1212e/urql-exchange-graphcache/default-storage';
import { schema } from './rumbleClient/schema';
import { optimistic, updates } from './optimisticUpdateHandlers';
import { retryExchange } from '@urql/exchange-retry';
import { createClient as createWSClient } from 'graphql-ws';
import { dev } from '$app/environment';
import { setWsConnected, isOnline } from '$lib/state/connection.svelte';
import { getCachedAccessToken } from '$lib/platform/oidc';
import { isTauri } from '$lib/platform';

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
		}
	}
});

export const urqlClient = new Client({
	url: '/api/graphql',
	// subscriptions via ws not supported in tauri fork, fallback to SSE in dev mode
	fetchSubscriptions: dev,
	exchanges: [
		nativeDateExchange,
		offlineExchange({
			schema,
			optimistic,
			updates,
			broadcastChannel: 'chase-broadcast-channel',
			storage: makeDefaultStorage({
				idbName: 'chase-offline-cache',
				maxAge: 7
			}),
			isOfflineError(error) {
				return !isOnline() || (error != null && error.networkError != null);
			}
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
	fetchOptions: () => {
		const headers: Record<string, string> = {};
		if (isTauri()) {
			const token = getCachedAccessToken();
			if (token) headers['Authorization'] = `Bearer ${token}`;
		}
		return { credentials: 'include', headers };
	},
	requestPolicy: 'cache-and-network'
});
