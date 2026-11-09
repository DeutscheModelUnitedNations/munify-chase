import { Client, fetchExchange, subscriptionExchange } from '@urql/core';
import { createClient as createSSEClient } from 'graphql-sse';
import {
	makeLiveQuery,
	makeMutation,
	makeQuery,
	makeSubscription,
	nativeDateExchange
} from '@m1212e/rumble/client';
import { schema } from './delegatorClient/schema';
import type { Mutation, Query, Subscription } from './delegatorClient/client';
import { LINK_TOKEN_HEADER } from './linkTokens';

/** The subscriptions DELEGATOR's schema offers, which a live query subscribes to by name. */
const availableSubscriptions = new Set(
	schema.__schema.types
		.filter((type) => type.name === schema.__schema.subscriptionType?.name)
		.flatMap((type) => ('fields' in type ? (type.fields ?? []).map((field) => field.name) : []))
);

/**
 * A typed client of a DELEGATOR instance (`docs/plans/delegator-link.md`), generated from its
 * schema (`bun run link:client`). Calls carry the link token when given one; subscriptions share
 * one stream to DELEGATOR's `/api/graphql/stream`. No cache: the link worker reads current state.
 */
export function createDelegatorClient({
	url,
	token,
	onConnected
}: {
	url: string;
	token?: string;
	/** Every (re)connect of the subscription stream, when updates may have been missed. */
	onConnected?: (reconnected: boolean) => void;
}) {
	const headers: Record<string, string> = token ? { [LINK_TOKEN_HEADER]: token } : {};
	const sse = createSSEClient({
		url: new URL('/api/graphql/stream', url).toString(),
		headers,
		singleConnection: true,
		// connected from the start, so a DELEGATOR that comes back is noticed (`onConnected`) even
		// while nothing is subscribed
		lazy: false,
		// keep trying while DELEGATOR is away; the worker reconciles once it is back
		retryAttempts: Infinity,
		on: { connected: (reconnected) => onConnected?.(reconnected) }
	});

	const urqlClient = new Client({
		url: new URL('/api/graphql', url).toString(),
		requestPolicy: 'network-only',
		fetchOptions: () => ({ headers }),
		exchanges: [
			nativeDateExchange,
			fetchExchange,
			subscriptionExchange({
				forwardSubscription: (request) => ({
					subscribe: (sink) => ({
						unsubscribe: sse.subscribe({ ...request, query: request.query ?? '' }, sink)
					})
				})
			})
		]
	});

	const options = { urqlClient, schema, autoIncludeIdField: 'id' };
	return {
		liveQuery: makeLiveQuery<Query>({ ...options, availableSubscriptions }),
		query: makeQuery<Query>(options),
		mutate: makeMutation<Mutation>(options),
		subscribe: makeSubscription<Subscription>(options),
		dispose: () => sse.dispose()
	};
}

export type DelegatorClient = ReturnType<typeof createDelegatorClient>;
