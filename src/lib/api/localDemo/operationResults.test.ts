import { gql, makeOperation, createRequest, type Operation } from '@urql/core';
import { describe, expect, it } from 'vitest';
import {
	getRootFieldName,
	makeLocalDemoMutationResult,
	makeOfflineErrorResult
} from './operationResults';

function mutation(document: string, variables?: Record<string, unknown>): Operation {
	return makeOperation('mutation', createRequest(gql(document), variables), {
		url: '/api/graphql',
		requestPolicy: 'network-only'
	});
}

describe('getRootFieldName', () => {
	it('names the first field of the operation, past fragments', () => {
		const op = mutation(`fragment F on Committee { id }
			mutation { updateCommittee(id: "c") { ...F } }`);
		expect(getRootFieldName(op)).toBe('updateCommittee');
	});

	it('is undefined without a root field', () => {
		expect(getRootFieldName(mutation('fragment F on Committee { id }'))).toBeUndefined();
	});
});

describe('makeLocalDemoMutationResult', () => {
	it('reshapes bulk mutations into the list they return', () => {
		const op = mutation(
			'mutation ($ids: [ID!]!) { setPresenceForCommitteeMembers(ids: $ids, present: true) { id } }',
			{
				ids: ['a', 'b'],
				present: true
			}
		);
		expect(makeLocalDemoMutationResult(op).data).toEqual({
			setPresenceForCommitteeMembers: [
				{ __typename: 'Committeemember', id: 'a', present: true },
				{ __typename: 'Committeemember', id: 'b', present: true }
			]
		});
	});

	it('echoes the args as the returned entity, minting a stable id where none was given', () => {
		const op = mutation('mutation ($name: String!) { createCommittee(name: $name) { id } }', {
			name: 'GA'
		});
		const echoed = makeLocalDemoMutationResult(op).data as {
			createCommittee: { __typename: string; id: string; name: string };
		};
		expect(echoed.createCommittee).toMatchObject({ __typename: 'Committee', name: 'GA' });
		expect(echoed.createCommittee.id).toBeTruthy();
		const again = makeLocalDemoMutationResult(op).data as typeof echoed;
		expect(again.createCommittee.id).toBe(echoed.createCommittee.id);
	});

	it('echoes args unchanged for scalar results and answers empty without a field', () => {
		const op = mutation('mutation { notAField }');
		expect(makeLocalDemoMutationResult(op).data).toEqual({ notAField: {} });
		expect(makeLocalDemoMutationResult(mutation('fragment F on Committee { id }')).data).toEqual(
			{}
		);
	});
});

describe('makeOfflineErrorResult', () => {
	it('fails with a network error', () => {
		const result = makeOfflineErrorResult(mutation('mutation { x }'));
		expect(result.error?.networkError?.message).toContain('no backend');
	});
});
