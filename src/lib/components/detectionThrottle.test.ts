import { describe, expect, it } from 'vitest';
import { createDetectionThrottle, errorText } from './detectionThrottle';

describe('createDetectionThrottle', () => {
	it('lets a code through once per window', () => {
		const shouldFire = createDetectionThrottle(() => 100);
		expect(shouldFire('a', 1000)).toBe(true);
		expect(shouldFire('a', 1050)).toBe(false);
		expect(shouldFire('b', 1050)).toBe(true);
		expect(shouldFire('a', 1100)).toBe(true);
	});

	it('forgets codes long past', () => {
		const shouldFire = createDetectionThrottle(() => 100);
		shouldFire('a', 1000);
		shouldFire('b', 1500);
		expect(shouldFire('a', 1501)).toBe(true);
	});
});

describe('errorText', () => {
	it('reads an error message or stringifies anything else', () => {
		expect(errorText(new Error('no camera'))).toBe('no camera');
		expect(errorText('denied')).toBe('denied');
	});
});
