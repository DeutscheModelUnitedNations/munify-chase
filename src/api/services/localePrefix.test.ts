import { describe, expect, test } from 'vitest';
import { localePrefix } from './localePrefix';

const locales = ['en', 'pt'];

describe('localePrefix', () => {
	test('splits a locale off the path', () => {
		expect(localePrefix({ pathname: '/en/app/x', locales })).toEqual({
			locale: 'en',
			bare: '/app/x'
		});
		expect(localePrefix({ pathname: '/pt', locales })).toEqual({ locale: 'pt', bare: '/' });
		expect(localePrefix({ pathname: '/en/', locales })).toEqual({ locale: 'en', bare: '/' });
	});

	test('leaves paths that only start with the letters alone', () => {
		expect(localePrefix({ pathname: '/entry', locales })).toBeUndefined();
		expect(localePrefix({ pathname: '/', locales })).toBeUndefined();
	});
});
