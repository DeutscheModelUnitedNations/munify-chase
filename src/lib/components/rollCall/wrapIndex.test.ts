import { describe, expect, it } from 'vitest';
import { wrapIndex } from './wrapIndex';

describe('wrapIndex', () => {
	it('wraps past either end', () => {
		expect(wrapIndex(-1, 3)).toBe(2);
		expect(wrapIndex(3, 3)).toBe(0);
		expect(wrapIndex(1, 3)).toBe(1);
	});
});
