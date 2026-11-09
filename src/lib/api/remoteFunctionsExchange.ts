import { CombinedError, type Exchange, type Operation } from '@urql/core';
import { empty, filter, fromPromise, fromValue, merge, mergeMap, pipe } from 'wonka';
import { graphqlMutation, graphqlQuery } from '#api/graphql.remote';
import { browser } from '$app/env';
import { isLocalConferenceActive } from '#lib/state/localDemo.svelte';
import {
	makeLocalDemoMutationResult,
	makeOfflineErrorResult,
	makeSuccessResult
} from './localDemo/operationResults';
import { resolveLocalDemoQuery } from './localDemo/seedConference';

/**
 * SSR renders local-demo pages by executing GraphQL in-process (see below), which would
 * otherwise hit the real access-control layer/DB for an anonymous visitor. There's no real
 * backend for this conference at all, so — mirroring localDemoExchange's browser-side
 * behavior — every operation is answered synthetically instead of ever reaching the
 * resolvers: queries succeed with their canned answer, or an empty one synthesized from the
 * schema (see resolveLocalDemoQuery — an error here would 500 the whole page), and mutations
 * always succeed (see makeLocalDemoMutationResult) since there's nothing to eventually retry
 * against.
 */
function localDemoResult(operation: Operation) {
	if (operation.kind === 'query') {
		// No `operationKey` passed here — SSR has no persistent cache to defer to (each
		// request is stateless), so it must always answer fresh; see
		// resolveLocalDemoRootField's doc comment.
		const data = resolveLocalDemoQuery(operation.query, operation.variables);
		return makeSuccessResult(operation, data);
	}
	if (operation.kind === 'mutation') return makeLocalDemoMutationResult(operation);
	return makeOfflineErrorResult(operation);
}

const REMOTE_FUNCTIONS: Partial<
	Record<Operation['kind'], typeof graphqlQuery | typeof graphqlMutation>
> = { query: graphqlQuery, mutation: graphqlMutation };

async function remoteResult({
	operation,
	caller
}: {
	operation: Operation;
	caller: typeof graphqlQuery | typeof graphqlMutation;
}) {
	const result = await caller({
		query: operation.query,
		variables: operation.variables as Exclude<typeof operation.variables, void>
	});

	return {
		operation,
		data: structuredClone(result.data),
		error: Array.isArray(result.errors)
			? new CombinedError({ graphQLErrors: result.errors })
			: undefined,
		extensions: result.extensions ? { ...result.extensions } : undefined,
		stale: false
	};
}

function serverResult(operation: Operation) {
	// we cannot do subscriptions on the server yet https://github.com/sveltejs/kit/pull/12973#issuecomment-2981290155
	// for SSR we return empty here and let the fetchExchange handle it in the browser
	if (operation.kind === 'subscription') return empty;
	if (isLocalConferenceActive()) return fromValue(localDemoResult(operation));
	const caller = REMOTE_FUNCTIONS[operation.kind];
	return caller ? fromPromise(remoteResult({ operation, caller })) : empty;
}

/**
 * Exchange to perform graphql calls via sveltekit remote functions (if possible)
 */
export const remoteFunctionsExchange: Exchange = ({ forward }) => {
	return (operations) => {
		const filtered = pipe(
			operations,
			// we only wanna use remote functions on the server
			filter((operation) => operation.kind !== 'teardown' && !browser),
			mergeMap(serverResult)
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
