import { describe, expect, it } from 'vitest';
import { errorMessage } from './errorMessage';

describe('errorMessage', () => {
	it('takes the message of an Error', () => {
		expect(errorMessage(new Error('boom'), 'fallback')).toBe('boom');
	});

	it('uses the fallback for anything else', () => {
		expect(errorMessage('nope', 'fallback')).toBe('fallback');
	});

	it('stringifies the thrown value without a fallback', () => {
		expect(errorMessage('nope')).toBe('nope');
	});
});
