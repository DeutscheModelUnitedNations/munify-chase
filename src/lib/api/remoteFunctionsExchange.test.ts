import {
	createRequest,
	gql,
	makeOperation,
	type Operation,
	type OperationResult
} from '@urql/core';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { empty, fromArray, pipe } from 'wonka';

const remote = vi.hoisted(() => ({ graphqlQuery: vi.fn(), graphqlMutation: vi.fn() }));
const demo = vi.hoisted(() => ({ active: false }));
vi.mock('#api/graphql.remote', () => remote);
vi.mock('$app/env', () => ({ browser: false }));
vi.mock('#lib/state/localDemo.svelte', () => ({ isLocalConferenceActive: () => demo.active }));
vi.mock('./localDemo/seedConference', () => ({
	resolveLocalDemoQuery: () => ({ conference: { id: 'localconference' } })
}));

const { remoteFunctionsExchange } = await import('./remoteFunctionsExchange');

function operation(kind: Operation['kind'], document = 'query { conference(id: "c") { id } }') {
	return makeOperation(kind, createRequest(gql(document), { id: 'c' }), {
		url: '/api/graphql',
		requestPolicy: 'network-only'
	});
}

const forward = vi.fn(() => empty);

async function collect(...operations: Operation[]) {
	const exchange = remoteFunctionsExchange({ forward, client: undefined!, dispatchDebug: vi.fn() });
	const results: OperationResult[] = [];
	await new Promise<void>((resolve) => {
		pipe(exchange(fromArray(operations)), (source) => {
			source((signal) => {
				if (signal === 0) resolve();
				else if (signal.tag === 0) signal[0](0);
				else results.push(signal[0]);
			});
		});
	});
	return results;
}

beforeEach(() => {
	vi.clearAllMocks();
	demo.active = false;
});

describe('remoteFunctionsExchange', () => {
	it('runs queries and mutations through the remote functions', async () => {
		remote.graphqlQuery.mockResolvedValue({ data: { conference: { id: 'c' } } });
		remote.graphqlMutation.mockResolvedValue({
			data: null,
			errors: [{ message: 'Must be logged in' }],
			extensions: { code: 1 }
		});
		const [query, mutation] = await collect(operation('query'), operation('mutation'));
		expect(query.data).toEqual({ conference: { id: 'c' } });
		expect(query.error).toBeUndefined();
		expect(mutation.error?.graphQLErrors[0].message).toBe('Must be logged in');
		expect(mutation.extensions).toEqual({ code: 1 });
	});

	it('leaves subscriptions to the browser and forwards teardowns', async () => {
		const results = await collect(operation('subscription'), operation('teardown'));
		expect(results).toEqual([]);
		expect(remote.graphqlQuery).not.toHaveBeenCalled();
		expect(forward).toHaveBeenCalledOnce();
	});

	it('answers the local demo without a backend', async () => {
		demo.active = true;
		const [query, mutation] = await collect(
			operation('query'),
			operation('mutation', 'mutation { notAField }')
		);
		expect(query.data).toEqual({ conference: { id: 'localconference' } });
		expect(mutation.data).toEqual({ notAField: { id: 'c' } });
		expect(remote.graphqlQuery).not.toHaveBeenCalled();
	});
});
