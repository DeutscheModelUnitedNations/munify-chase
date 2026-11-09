import { describe, expect, it } from 'vitest';
import { givenFields, hasFields } from './givenFields';

describe('givenFields', () => {
	it('keeps given values and drops undefined and null', () => {
		const args = { a: 1, b: null, c: undefined, d: false, e: 0 };
		expect(givenFields({ args, keys: ['a', 'b', 'c', 'd', 'e'] })).toEqual({
			a: 1,
			d: false,
			e: 0
		});
	});

	it('keeps null for clearable fields', () => {
		const args = { name: 'x', icon: null, note: undefined };
		expect(givenFields({ args, keys: ['name'], clearable: ['icon', 'note'] })).toEqual({
			name: 'x',
			icon: null
		});
	});

	it('ignores fields not named', () => {
		expect(givenFields({ args: { id: '1', name: 'n' }, keys: ['name'] })).toEqual({ name: 'n' });
	});
});

describe('hasFields', () => {
	it('tells whether anything is to be written', () => {
		expect(hasFields({})).toBe(false);
		expect(hasFields({ a: null })).toBe(true);
	});
});
