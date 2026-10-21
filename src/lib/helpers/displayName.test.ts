import { describe, expect, it } from 'vitest';
import { displayNameOf } from './displayName';

describe('displayNameOf', () => {
	it('prefers the full name', () => {
		expect(displayNameOf({ givenName: 'Jane', familyName: 'Doe', email: 'jane@dmun.de' })).toBe(
			'Jane Doe'
		);
		expect(displayNameOf({ givenName: 'Jane', familyName: null })).toBe('Jane');
	});

	it('falls back to the username, then the email', () => {
		expect(displayNameOf({ preferredUsername: 'jdoe', email: 'jane@dmun.de' })).toBe('jdoe');
		expect(displayNameOf({ givenName: ' ', email: 'jane@dmun.de' })).toBe('jane@dmun.de');
	});

	it('is empty without any user data', () => {
		expect(displayNameOf(undefined)).toBe('');
		expect(displayNameOf({})).toBe('');
	});
});
