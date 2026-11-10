import { describe, expect, it } from 'vitest';
import { m } from '#lib/paraglide/messages';
import { delegationName, regionalGroupIcon, rollCallTally } from './presence';

describe('delegationName', () => {
	it('prefers the delegation’s own name', () => {
		expect(delegationName({ name: 'Atlantis', alpha3Code: 'DEU' })).toBe('Atlantis');
	});

	it('falls back to the country name', () => {
		expect(delegationName({ name: null, alpha3Code: 'FRA' })).not.toBe(m.unknown());
	});

	it('is unknown without a name or code', () => {
		expect(delegationName(null)).toBe(m.unknown());
		expect(delegationName({ name: '', alpha3Code: null })).toBe(m.unknown());
	});
});

describe('regionalGroupIcon', () => {
	it('maps each group to its hemisphere and colour', () => {
		expect(regionalGroupIcon('AFRICA')).toBe('ph-globe-hemisphere-east text-blue-500');
		expect(regionalGroupIcon('LATIN_AMERICA_CARIBBEAN')).toBe(
			'ph-globe-hemisphere-west text-pink-500'
		);
	});

	it('shows nothing for an unknown group', () => {
		expect(regionalGroupIcon('ATLANTIS')).toBeUndefined();
		expect(regionalGroupIcon('toString')).toBeUndefined();
	});
});

describe('rollCallTally', () => {
	it('counts the present against everyone called', () => {
		expect(rollCallTally([{ present: true }, { present: false }, { present: true }])).toEqual({
			present: 2,
			total: 3
		});
		expect(rollCallTally([])).toEqual({ present: 0, total: 0 });
	});
});
