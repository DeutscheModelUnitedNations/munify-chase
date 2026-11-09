import { describe, expect, test } from 'vitest';
import { userRowOfClaims } from './oidcClaims';

const defaultLocale = 'de';

describe('userRowOfClaims', () => {
	test('takes the standard claims as they are', () => {
		expect(
			userRowOfClaims({
				claims: {
					sub: 'u1',
					email: 'ada@example.org',
					locale: 'en',
					preferred_username: 'ada',
					given_name: 'Ada',
					family_name: 'Lovelace'
				},
				defaultLocale
			})
		).toEqual({
			id: 'u1',
			fields: {
				locale: 'en',
				preferredUsername: 'ada',
				email: 'ada@example.org',
				familyName: 'Lovelace',
				givenName: 'Ada'
			},
			fullName: 'Ada Lovelace'
		});
	});

	test("reads Logto's username and splits its name on the last space", () => {
		const { fields, fullName } = userRowOfClaims({
			claims: { sub: 'u1', email: 'a@b.c', username: 'grace', name: ' Grace Brewster Hopper ' },
			defaultLocale
		});
		expect(fields).toMatchObject({
			locale: 'de',
			preferredUsername: 'grace',
			givenName: 'Grace Brewster',
			familyName: 'Hopper'
		});
		expect(fullName).toBe('Grace Brewster Hopper');
	});

	test('uses a single word name for both parts', () => {
		const { fields } = userRowOfClaims({
			claims: { sub: 'u1', email: 'a@b.c', name: 'Cher' },
			defaultLocale
		});
		expect(fields).toMatchObject({ givenName: 'Cher', familyName: 'Cher' });
	});

	test('falls back to the email and leaves names empty without any', () => {
		const result = userRowOfClaims({ claims: { sub: 'u1', email: 'a@b.c' }, defaultLocale });
		expect(result.fields).toMatchObject({
			preferredUsername: 'a@b.c',
			givenName: '',
			familyName: ''
		});
		expect(result.fullName).toBeNull();
	});

	test('ignores claims that are not strings', () => {
		const { fields } = userRowOfClaims({
			claims: { sub: 'u1', email: 'a@b.c', given_name: 42, username: ['x'] },
			defaultLocale
		});
		expect(fields).toMatchObject({ preferredUsername: 'a@b.c', givenName: '' });
	});

	test('refuses claims without a subject or an email', () => {
		expect(() => userRowOfClaims({ claims: { email: 'a@b.c' }, defaultLocale })).toThrow('sub');
		expect(() => userRowOfClaims({ claims: { sub: 'u1' }, defaultLocale })).toThrow('email');
	});
});
