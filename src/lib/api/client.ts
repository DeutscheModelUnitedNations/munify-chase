import { nativeDateExchange } from '@m1212e/rumble/client';
import { Client, fetchExchange, subscriptionExchange } from '@urql/core';
import { offlineExchange } from '@m1212e/urql-exchange-graphcache';
import { makeDefaultStorage } from '@m1212e/urql-exchange-graphcache/default-storage';
import { schema } from './rumbleClient/schema';
import { optimistic, updates } from './optimisticUpdateHandlers';
import { createClient as createWSClient } from 'graphql-ws';
import { setWsConnected } from '$lib/state/connection.svelte';
import { getCachedAccessToken } from '$lib/platform/oidc';
import { isTauri } from '$lib/platform';
import { configPublic } from '$lib/config/public';

const graphqlUrl = configPublic.PUBLIC_API_URL;
const wsUrl = graphqlUrl.replace(/^https/, 'wss').replace(/^http/, 'ws');

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
			setWsConnected(true);
		},
		closed: () => {
			wsConnected = false;
			setWsConnected(false);
		}
	}
});

// IndexedDB-backed storage so the normalized cache and the offline mutation
// queue survive page reloads. The offlineExchange replays queued mutations in
// order once the network returns, keeping our optimistic layers applied in the
// meantime.
const storage = makeDefaultStorage({
	idbName: 'chase-offline-cache',
	maxAge: 7
});

export const urqlClient = new Client({
	url: graphqlUrl,
	exchanges: [
		nativeDateExchange,
		offlineExchange({
			schema,
			storage,
			optimistic,
			updates,
			broadcastChannel: 'chase-broadcast-channel',
			isOfflineError(error) {
				return error != null && error.networkError != null;
			}
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
