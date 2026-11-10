import { describe, expect, it } from 'vitest';
import { representationName, rollCallMark } from './rollCallRow';

describe('rollCallMark', () => {
	const base = { present: true, pending: false, hasIcon: false, called: true };

	it('shows saving first, then nothing for rows not yet called', () => {
		expect(rollCallMark({ ...base, pending: true, called: false })).toBe('pending');
		expect(rollCallMark({ ...base, called: false })).toBeNull();
	});

	it('prefers a custom icon, then presence', () => {
		expect(rollCallMark({ ...base, hasIcon: true })).toBe('icon');
		expect(rollCallMark(base)).toBe('present');
		expect(rollCallMark({ ...base, present: false })).toBe('absent');
	});
});

describe('representationName', () => {
	it('uses the name, else the country of the code', () => {
		expect(representationName({ name: 'WHO', alpha3Code: 'DEU' })).toBe('WHO');
		expect(representationName({ alpha3Code: 'DEU' })).toBeTruthy();
		expect(representationName({ name: '', alpha3Code: 'DEU' })).toBe('');
	});

	it('is null without either', () => {
		expect(representationName(null)).toBeNull();
		expect(representationName({ name: '' })).toBeNull();
	});
});
