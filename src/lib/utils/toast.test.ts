import { CombinedError } from '@urql/core';
import { GraphQLError } from 'graphql';
import { describe, expect, it } from 'vitest';
import { promiseToastStrings, withBackendMessage } from './toast';
import { m } from '#lib/paraglide/messages';

describe('promiseToastStrings', () => {
	it('words each action', () => {
		expect(promiseToastStrings('Committee', 'delete')).toEqual({
			loading: m.toastDeleteLoading({ targetName: 'Committee' }),
			success: m.toastDeleteSuccess({ targetName: 'Committee' }),
			error: m.toastDeleteError({ targetName: 'Committee' })
		});
		expect(promiseToastStrings('Committee', 'add').success).toBe(
			m.toastAddSuccess({ targetName: 'Committee' })
		);
	});

	it('falls back to the generic wording without an action', () => {
		expect(promiseToastStrings('Committee').error).toBe(m.toastError({ targetName: 'Committee' }));
	});
});

describe('withBackendMessage', () => {
	it('appends the first GraphQL error', () => {
		const err = new CombinedError({ graphQLErrors: [new GraphQLError('No seat left')] });
		expect(withBackendMessage('Save failed', err)).toBe('Save failed: No seat left');
	});

	it('keeps the base message for anything else', () => {
		expect(withBackendMessage('Save failed', new Error('boom'))).toBe('Save failed');
	});
});
