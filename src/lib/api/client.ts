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
import { browser } from '$app/environment';
import { schema } from './rumbleClient/schema';
import { optimistic, updates, ensureId } from './optimisticUpdateHandlers';
import { setWsConnected, DISCONNECT_GRACE_MS } from '$lib/state/connection.svelte';
import { createClient as createWSClient } from 'graphql-ws';
import { configPublic } from '$config/public';
import { getCachedAccessToken } from '$lib/platform/oidc';
import { isLocalConferenceActive } from '$lib/state/localDemo.svelte';
import {
	localDemoConferenceUpdates,
	resolveLocalDemoRootField,
	seedLocalDemoConference,
	withLocalDemoMutationCommits
} from './localDemo/seedConference';

const graphqlUrl = configPublic.PUBLIC_API_URL;
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

function hashSchema(schemaObject: unknown): string {
	const json = JSON.stringify(schemaObject);
	let hash = 0;
	for (let i = 0; i < json.length; i++) {
		hash = (Math.imul(31, hash) + json.charCodeAt(i)) | 0;
	}
	return (hash >>> 0).toString(36);
}

async function cleanupStaleCaches(currentIdbName: string) {
	if (typeof indexedDB === 'undefined' || typeof indexedDB.databases !== 'function') return;
	try {
		const databases = await indexedDB.databases();
		const stale = databases
			.map((d) => d.name)
			.filter((name): name is string => !!name)
			.filter((name) => name === 'chase-cache' || name.startsWith('chase-cache-'))
			.filter((name) => name !== currentIdbName);
		for (const name of stale) {
			indexedDB.deleteDatabase(name);
		}
	} catch {
		// Best-effort cleanup only — see comment above.
	}
}

function getLocalDemoSeed(op: Operation): unknown {
	return (op.context as { localDemoSeed?: unknown }).localDemoSeed;
}

function makeSuccessResult(operation: Operation, data: unknown) {
	return { operation, data, error: undefined, extensions: undefined, stale: false, hasNext: false };
}

function makeOfflineErrorResult(operation: Operation) {
	return {
		operation,
		data: undefined,
		error: new CombinedError({
			networkError: new Error('network error: local demo conference has no backend')
		}),
		extensions: undefined,
		stale: false,
		hasNext: false
	};
}

/**
 * A handful of mutations return something shaped nothing like their own args — most notably
 * bulk-by-id mutations, e.g. `setPresenceForCommitteeMembers(ids, present) -> [Committeemember]`.
 * Echoing the raw `{ ids, present }` args back as that field's "result" would hand graphcache a
 * shape it fundamentally can't reinterpret as a list, no matter what `__typename` is attached —
 * this is the one case needing bespoke reshaping. Everything else just needs a `__typename`
 * attached (see MUTATION_RETURN_TYPENAMES below) to be a valid single-entity echo.
 */
const LOCAL_DEMO_MUTATION_RESULT_SHAPES: Record<
	string,
	(variables: Record<string, unknown>) => unknown
> = {
	setPresenceForCommitteeMembers: (variables) =>
		(variables.ids as string[]).map((id) => ({
			__typename: 'Committeemember',
			id,
			present: variables.present
		})),
	// `currentMemberIndex` isn't one of this mutation's own args — every new session starts
	// at 0, matching what its `optimistic` handler already assumes.
	startRollCallSession: (variables) => ({
		__typename: 'Rollcallsession',
		id: variables.id,
		currentMemberIndex: 0
	})
};

function unwrapNamedTypeName(typeRef: {
	kind: string;
	name?: string;
	ofType?: unknown;
}): string | undefined {
	let t = typeRef;
	while (t && (t.kind === 'NON_NULL' || t.kind === 'LIST')) t = t.ofType as typeof t;
	return t?.name;
}

/**
 * Maps every Mutation field to its GraphQL return type's name — used to attach a `__typename` to
 * the echoed-args fallback below. Object-kind types only; a mutation returning a scalar (Boolean,
 * ID, ...) has nothing to normalize as an entity, so it's left out and falls back to a bare echo.
 */
const MUTATION_RETURN_TYPENAMES: Record<string, string> = (() => {
	const types = schema.__schema.types;
	const objectTypeNames = new Set(types.filter((t) => t.kind === 'OBJECT').map((t) => t.name));
	const mutationType = types.find(
		(t) => t.kind === 'OBJECT' && t.name === schema.__schema.mutationType?.name
	);
	const result: Record<string, string> = {};
	for (const field of (mutationType && 'fields' in mutationType && mutationType.fields) || []) {
		const typeName = unwrapNamedTypeName(
			field.type as { kind: string; name?: string; ofType?: unknown }
		);
		if (typeName && objectTypeNames.has(typeName)) result[field.name] = typeName;
	}
	return result;
})();

/**
 * Mutations under the local conference have no real backend to confirm anything with, so an
 * error here isn't a transient failure a user should be warned about — it's just the vehicle
 * component code awaits (often via `toast.promise`, which shows a scary "failed" toast on any
 * rejection). Resolve successfully instead, echoing the mutation's own args back as its "result"
 * (with a `__typename` attached so graphcache can actually normalize it) — most mutations in this
 * app already pass a client-supplied id (offline-first design), so this is a reasonable stand-in
 * for "yes, that happened" without needing to know the real return type's other fields.
 */
function makeLocalDemoMutationResult(operation: Operation) {
	const fieldName = getRootFieldName(operation);
	if (!fieldName) return makeSuccessResult(operation, {});
	const variables = (operation.variables ?? {}) as Record<string, unknown>;
	const shaped = LOCAL_DEMO_MUTATION_RESULT_SHAPES[fieldName]?.(variables);
	if (shaped) return makeSuccessResult(operation, { [fieldName]: shaped });
	const typename = MUTATION_RETURN_TYPENAMES[fieldName];
	// Many "create" mutations don't pass a client-supplied id (the real server issues one).
	// `ensureId` is memoized by `variables`'s object identity, so whichever call site — this
	// echo, the optimistic handler, or `withLocalDemoMutationCommits`'s manual commit — runs
	// first settles the id, and the rest agree with it instead of each minting their own.
	const echoed =
		typename && variables && typeof variables === 'object'
			? {
					__typename: typename,
					...variables,
					id: (variables.id as string | undefined) ?? ensureId(variables)
				}
			: variables;
	return makeSuccessResult(operation, { [fieldName]: echoed ?? null });
}

const localDemoExchange: Exchange =
	({ forward }) =>
	(ops$) => {
		const remoteOps$ = pipe(
			ops$,
			filter(
				(op) => op.kind === 'teardown' || (!isLocalConferenceActive() && !getLocalDemoSeed(op))
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

		// Queries with a canned answer (see resolveLocalDemoRootField) succeed with that
		// data instead of falling into the generic offline error below — otherwise every
		// page under the local conference would render in a permanent error state on a
		// completely empty, first-ever-load cache. `data === null` means this exact
		// operation already got its canned answer on a previous run (see
		// resolveLocalDemoRootField's doc comment) — deliberately excluded here (and from
		// localOfflineResults$ below) so it neither re-answers nor errors, just defers to
		// whatever the cache already holds.
		const queryAnswers$ = pipe(
			ops$,
			filter((op) => op.kind === 'query' && isLocalConferenceActive() && !getLocalDemoSeed(op)),
			map((op) => ({
				op,
				data: resolveLocalDemoRootField(getRootFieldName(op), op.variables, op.key)
			}))
		);

		const cannedResults$ = pipe(
			queryAnswers$,
			filter((x): x is { op: Operation; data: Record<string, unknown> } => !!x.data),
			map(({ op, data }) => makeSuccessResult(op, data))
		);

		// See makeLocalDemoMutationResult — mutations resolve successfully rather than
		// erroring, since there's no real backend to eventually retry against.
		const mutationResults$ = pipe(
			ops$,
			filter((op) => op.kind === 'mutation' && isLocalConferenceActive() && !getLocalDemoSeed(op)),
			map((op) => makeLocalDemoMutationResult(op))
		);

		const localOfflineResults$ = pipe(
			queryAnswers$,
			filter((x) => x.data === undefined),
			map(({ op }) => makeOfflineErrorResult(op))
		);

		return merge([
			remoteOps$,
			seedResults$,
			cannedResults$,
			mutationResults$,
			localOfflineResults$
		]);
	};

if (browser) {
	const idbName = `chase-cache-${hashSchema(schema)}`;
	cleanupStaleCaches(idbName);
	const storage = makeDefaultStorage({
		idbName,
		maxAge: 7
	});

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
				forward
			);
		};

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
			// seedLocalDemoConference isn't a real schema field (see ./localDemo/seedConference.ts)
			// — graphcache validates `updates`/document fields against the real introspected
			// schema and warns every time the seed runs otherwise. That mismatch is expected here.
			logger: (severity, message) => {
				if (message.includes('seedLocalDemoConference')) return;
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
		crossTabSyncExchange({ channelName: 'chase-cross-tab-sync' }),
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
