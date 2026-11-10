import { describe, expect, it } from 'vitest';
import { userInitials } from './initials';

describe('userInitials', () => {
	it('takes the first letters of given and family name', () => {
		expect(userInitials({ givenName: ' ada', familyName: 'lovelace', email: 'x@y' })).toBe('AL');
		expect(userInitials({ familyName: 'lovelace' })).toBe('L');
	});

	it('falls back to the name, then the email, then a question mark', () => {
		expect(userInitials({ givenName: ' ', name: 'bob', email: 'x@y' })).toBe('B');
		expect(userInitials({ name: '', email: ' eve@x' })).toBe('E');
		expect(userInitials({ email: '  ' })).toBe('?');
		expect(userInitials({})).toBe('?');
	});
});
