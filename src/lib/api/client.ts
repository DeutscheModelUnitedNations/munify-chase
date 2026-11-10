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
import { filter, map, merge, onPush, pipe } from 'wonka';
import { browser } from '$app/env';
import { schema } from './rumbleClient/schema';
import { optimistic, updates } from './optimisticUpdateHandlers';
import { setWsConnected, DISCONNECT_GRACE_MS } from '#lib/state/connection.svelte';
import { createClient as createWSClient } from 'graphql-ws';
import { PUBLIC_API_URL } from '$app/env/public';
import { getCachedAccessToken } from '#lib/platform/oidc';
import { isLocalConferenceActive } from '#lib/state/localDemo.svelte';
import {
	hasClearOfflineCacheMarker,
	removeClearOfflineCacheMarker
} from '#lib/helpers/clearOfflineCacheMarker';
import { makeLocalDemoMutationResult, makeSuccessResult } from './localDemo/operationResults';
import { cleanupStaleCaches, hashSchema } from './offlineCacheStorage';
import { remoteFunctionsExchange } from './remoteFunctionsExchange';
import { keepSyntheticOptimisticExchange } from './syntheticOptimisticExchange';
import {
	localDemoConferenceUpdates,
	resolveLocalDemoQuery,
	seedLocalDemoConference,
	withLocalDemoMutationCommits
} from './localDemo/seedConference';

const graphqlUrl = PUBLIC_API_URL;
const wsUrl = graphqlUrl.replace(/^https/, 'wss').replace(/^http/, 'ws');

function getRootFieldName(operation: Operation): string | undefined {
	for (const def of operation.query.definitions) {
		if (def.kind === 'OperationDefinition') {
			const selection = def.selectionSet.selections[0];
			if (selection?.kind === 'Field') return selection.name.value;
		}
	}
	return undefined;
}

const exchanges: Exchange[] = [nativeDateExchange];

function getLocalDemoSeed(op: Operation): unknown {
	return (op.context as { localDemoSeed?: unknown }).localDemoSeed;
}

/**
 * Whether an operation belongs to the offline demo. Mutations carry the mode they were
 * dispatched in (see trackQueriesExchange), so a real conference's offline queue that
 * graphcache flushes while this tab shows the demo still goes to the server instead of
 * being answered with a fake success and dropped.
 */
function isLocalDemoOperation(op: Operation) {
	const stamped = op.context.localDemo as boolean | undefined;
	return stamped ?? isLocalConferenceActive();
}

const localDemoExchange: Exchange =
	({ forward }) =>
	(ops$) => {
		const remoteOps$ = pipe(
			ops$,
			filter(
				(op) => op.kind === 'teardown' || (!isLocalDemoOperation(op) && !getLocalDemoSeed(op))
			),
			forward
		);

		// Answers seedLocalDemoConference (see ./localDemo/seedConference.ts) with its
		// canned data instead of an error — it's not a real backend mutation, just a
		// vehicle for getting graphcache to normalize/persist the demo conference.
		const seedResults$ = pipe(
			ops$,
			filter((op) => op.kind !== 'teardown' && !!getLocalDemoSeed(op)),
			map((op) => makeSuccessResult(op, getLocalDemoSeed(op)))
		);

		// Every query succeeds with its canned answer, or an empty-but-valid one synthesized
		// from the schema (see resolveLocalDemoQuery) — an error would leave the page in a
		// permanent error state on a completely empty, first-ever-load cache. `data === null`
		// means this exact operation already got its canned answer on a previous run (see
		// resolveLocalDemoRootField's doc comment) — deliberately excluded here so it doesn't
		// re-answer, just defers to whatever the cache already holds.
		const cannedResults$ = pipe(
			ops$,
			filter((op) => op.kind === 'query' && isLocalConferenceActive() && !getLocalDemoSeed(op)),
			map((op) => {
				// A cache miss (or a partial hit) must always be answered, even for an operation
				// answered before: deferring to a cache that lacks the data would leave the query
				// pending forever, e.g. after a new committee was created that is missing fields
				// another page's query selects.
				const outcome = op.context.meta?.cacheOutcome;
				const operationKey = outcome === 'miss' || outcome === 'partial' ? undefined : op.key;
				return { op, data: resolveLocalDemoQuery(op.query, op.variables, operationKey) };
			}),
			filter((x): x is { op: Operation; data: Record<string, unknown> } => !!x.data),
			map(({ op, data }) => makeSuccessResult(op, data))
		);

		// See makeLocalDemoMutationResult — mutations resolve successfully rather than
		// erroring, since there's no real backend to eventually retry against.
		const mutationResults$ = pipe(
			ops$,
			filter((op) => op.kind === 'mutation' && isLocalDemoOperation(op) && !getLocalDemoSeed(op)),
			map((op) => makeLocalDemoMutationResult(op))
		);

		return merge([remoteOps$, seedResults$, cannedResults$, mutationResults$]);
	};

if (browser) {
	const idbName = `chase-cache-${hashSchema(schema)}`;
	cleanupStaleCaches(idbName);
	const storage = makeDefaultStorage({
		idbName,
		maxAge: 7
	});
	// After a logout, drop the previous user's cached data and queued offline mutations.
	// Issued before the offline exchange's first read, so that read sees the cleared stores.
	// The marker is only removed once clearing succeeded; if it fails, reads return nothing
	// (so the previous user's data is never hydrated) and the next start retries.
	if (hasClearOfflineCacheMarker()) {
		const cleared = storage.clear().then(
			() => {
				removeClearOfflineCacheMarker();
				return true;
			},
			() => false
		);
		const readData = storage.readData.bind(storage);
		const readMetadata = storage.readMetadata?.bind(storage);
		storage.readData = async () => ((await cleared) ? readData() : {});
		if (readMetadata) storage.readMetadata = async () => ((await cleared) ? readMetadata() : null);
	}

	const onlineCallbacks = new Set<() => void>();
	const baseOnOnline = storage.onOnline?.bind(storage);
	storage.onOnline = (cb: () => void) => {
		onlineCallbacks.add(cb);
		baseOnOnline?.(cb);
	};
	const flushOfflineQueue = () => {
		for (const cb of onlineCallbacks) cb();
	};

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
				// Record whether a mutation was made in the demo, see isLocalDemoOperation.
				// Re-dispatches from the offline queue keep the stamp of the first dispatch.
				map((op) =>
					op.kind === 'mutation' && op.context.localDemo === undefined
						? makeOperation(op.kind, op, { ...op.context, localDemo: isLocalConferenceActive() })
						: op
				),
				forward
			);
		};

	// order with these MATTERS!
	exchanges.push(
		trackQueriesExchange,
		keepSyntheticOptimisticExchange,
		offlineExchange({
			schema,
			storage,
			optimistic,
			updates: {
				...updates,
				Mutation: withLocalDemoMutationCommits(
					{ ...updates.Mutation, ...localDemoConferenceUpdates },
					optimistic
				)
			},
			// Two classes of graphcache noise are expected here and get dropped:
			// - seedLocalDemoConference isn't a real schema field (see ./localDemo/seedConference.ts),
			//   so graphcache warns about the `updates`/document mismatch every time the seed runs.
			// - "No value for field" is a plain cache miss, which is the normal state of an
			//   offline-first cache before (or without) a server round-trip.
			logger: (severity, message) => {
				if (message.includes('seedLocalDemoConference')) return;
				if (message.includes('No value for field')) return;
				console[severity](message);
			},
			keys: {
				ConferenceStats: () => null,
				PersonalStats: () => null,
				PersonalSpeakingStats: () => null,
				PersonalAttendanceStats: () => null,
				PersonalVotingStats: () => null,
				PersonalActivityStats: () => null,
				DelegationSpeakingStats: () => null,
				RegionalStats: () => null,
				AmendmentCountStats: () => null,
				PaperSponsorStats: () => null,
				CommitteeActivityStats: () => null,
				VotingAlignmentStats: () => null,
				ContraryStats: () => null,
				AttendanceTrendPoint: () => null,
				SpeakingTimelineBucket: () => null,
				SpeakingFairness: () => null
			}
		}),
		crossTabSyncExchange({
			channelName: 'chase-cross-tab-sync',
			// The demo's canned query answers must not warm other tabs' caches, where a real
			// conference would read them. Demo mutations still sync, the presentation window
			// relies on them.
			shouldSync: (op) => op.kind === 'mutation' || !isLocalConferenceActive()
		}),
		localDemoExchange
	);

	const pendingNonSubscriptions = new Map<
		number,
		{ sink: { error?: (err: unknown) => void }; unsubscribe: () => void }
	>();

	let wsConnected = false;
	let everConnected = false;
	let pendingErrorTimer: ReturnType<typeof setTimeout> | null = null;

	const wsClient = createWSClient({
		url: wsUrl,
		// The offline demo conference never has a real OIDC session, so the remote WS
		// server always rejects its handshake with "Must be logged in" — retrying that
		// forever would just spin a permanent reconnect loop.
		shouldRetry: () => !isLocalConferenceActive(),
		connectionParams: () => {
			const token = getCachedAccessToken();
			return token ? { Authorization: `Bearer ${token}` } : {};
		},
		on: {
			connected: () => {
				if (pendingErrorTimer !== null) {
					clearTimeout(pendingErrorTimer);
					pendingErrorTimer = null;
				}
				const isReconnect = everConnected;
				everConnected = true;
				wsConnected = true;
				setWsConnected(true);
				if (isReconnect) {
					flushOfflineQueue();
					reexecuteActiveQueries();
				}
			},
			closed: () => {
				wsConnected = false;
				setWsConnected(false);
				if (pendingErrorTimer !== null) return;
				pendingErrorTimer = setTimeout(() => {
					pendingErrorTimer = null;
					for (const [, { sink, unsubscribe }] of pendingNonSubscriptions) {
						unsubscribe();
						sink.error?.(
							new CombinedError({
								networkError: new Error('network error: WebSocket connection lost')
							})
						);
					}
					pendingNonSubscriptions.clear();
				}, DISCONNECT_GRACE_MS);
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

if (browser) {
	seedLocalDemoConference(urqlClient);
}
