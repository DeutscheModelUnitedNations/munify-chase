import { Client, fetchExchange, subscriptionExchange, type CombinedError } from '@urql/core';
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
import { LINK_TOKEN_HEADER } from './linkAuth';
import { coalesceConnections } from './coalesceConnections';

/** The subscriptions DELEGATOR's schema offers, which a live query subscribes to by name. */
const availableSubscriptions = new Set(
	schema.__schema.types
		.filter((type) => type.name === schema.__schema.subscriptionType?.name)
		.flatMap((type) => ('fields' in type ? (type.fields ?? []).map((field) => field.name) : []))
);

/**
 * A typed client of a DELEGATOR instance (`docs/plans/delegator-link.md`), generated from its
 * schema (`bun run link:client`). Calls carry a fresh link token when given a source of them
 * (`linkAccessToken`); subscriptions go over yoga's built-in server-sent events on DELEGATOR's
 * `/api/graphql`, one response each (graphql-sse's distinct connections mode). No cache: the link
 * worker reads current state.
 */
export function createDelegatorClient({
	url,
	token,
	onConnected,
	onError
}: {
	url: string;
	/** The current link token, asked for every call: tokens expire. */
	token?: () => Promise<string>;
	/**
	 * The first subscription connecting (`false`), and after that every burst of subscriptions
	 * reconnecting (`true`), when updates may have been missed. Each subscription has its own
	 * connection, so a DELEGATOR that went away reconnects all of them; this reports that once.
	 */
	onConnected?: (reconnected: boolean) => void;
	/** An update a live query skipped, keeping its last rows. */
	onError?: (error: CombinedError) => void;
}) {
	const headers = async (): Promise<Record<string, string>> =>
		token ? { [LINK_TOKEN_HEADER]: await token() } : {};
	const linkFetch: typeof fetch = async (input, init) => {
		const merged = new Headers(init?.headers);
		for (const [name, value] of Object.entries(await headers())) merged.set(name, value);
		return fetch(input, { ...init, headers: merged });
	};
	const connections = coalesceConnections(onConnected);
	const sse = createSSEClient({
		url: new URL('/api/graphql', url).toString(),
		headers,
		// keep trying while DELEGATOR is away; the worker reconciles once it is back
		retryAttempts: Infinity,
		on: { connected: connections.connected }
	});

	const urqlClient = new Client({
		url: new URL('/api/graphql', url).toString(),
		requestPolicy: 'network-only',
		fetch: linkFetch,
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

	// every selection carries the id, in the result types too
	const options = { urqlClient, schema, autoIncludeIdField: 'id' };
	return {
		liveQuery: makeLiveQuery<Query, false, 'id'>({ ...options, availableSubscriptions, onError }),
		query: makeQuery<Query, false, 'id'>(options),
		mutate: makeMutation<Mutation, 'id'>(options),
		subscribe: makeSubscription<Subscription, 'id'>(options),
		dispose: () => {
			connections.dispose();
			sse.dispose();
		}
	};
}

export type DelegatorClient = ReturnType<typeof createDelegatorClient>;
