import { createRequest, gql, makeOperation, type Operation } from '@urql/core';
import { describe, expect, it, vi } from 'vitest';
import { empty, fromArray, pipe, subscribe } from 'wonka';
import { keepSyntheticOptimisticExchange } from './syntheticOptimisticExchange';

function operation(kind: Operation['kind'], key: number, context: Record<string, unknown> = {}) {
	const request = { ...createRequest(gql('mutation { x }'), {}), key };
	return makeOperation(kind, request, {
		url: '/api/graphql',
		requestPolicy: 'network-only',
		...context
	});
}

function forwarded(operations: Operation[]) {
	const seen: Operation[] = [];
	const forward = vi.fn((ops$) => {
		pipe(
			ops$,
			subscribe((op: Operation) => seen.push(op))
		);
		return empty;
	});
	keepSyntheticOptimisticExchange({ forward, client: undefined!, dispatchDebug: vi.fn() })(
		fromArray(operations)
	);
	return seen;
}

describe('keepSyntheticOptimisticExchange', () => {
	it('makes mutations from other tabs optimistic and swallows their teardowns', () => {
		const remote = { crossTabSync: { remote: true } };
		const seen = forwarded([
			operation('mutation', 1, remote),
			operation('mutation', 2, { ...remote, optimistic: true }),
			operation('teardown', 1),
			operation('teardown', 1)
		]);
		expect(seen.map((op) => [op.kind, op.key, op.context.optimistic])).toEqual([
			['mutation', 1, true],
			['mutation', 2, true],
			['teardown', 1, undefined]
		]);
	});

	it('passes this tab’s operations through', () => {
		const seen = forwarded([
			operation('mutation', 3),
			operation('query', 4),
			operation('teardown', 3)
		]);
		expect(seen.map((op) => [op.kind, op.context.optimistic])).toEqual([
			['mutation', undefined],
			['query', undefined],
			['teardown', undefined]
		]);
	});
});
