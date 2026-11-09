import { describe, expect, it } from 'vitest';
import { userClaims } from './userClaims';

describe('userClaims', () => {
	it('maps the OIDC claims', () => {
		expect(
			userClaims({
				sub: 's',
				given_name: 'Ada',
				family_name: 'Lovelace',
				email: 'a@x',
				preferred_username: 'ada',
				locale: 'en'
			})
		).toEqual({
			id: 's',
			givenName: 'Ada',
			familyName: 'Lovelace',
			email: 'a@x',
			preferredUsername: 'ada',
			locale: 'en'
		});
	});
	it('answers null for missing claims', () => {
		expect(userClaims({ sub: 's' })).toEqual({
			id: 's',
			givenName: null,
			familyName: null,
			email: null,
			preferredUsername: null,
			locale: null
		});
	});
});
