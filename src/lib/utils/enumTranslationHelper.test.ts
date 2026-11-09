import { describe, expect, it } from 'vitest';
import { translateRegionalGroupEnum } from './enumTranslationHelper';
import { m } from '#lib/paraglide/messages';

describe('translateRegionalGroupEnum', () => {
	it('names each regional group', () => {
		expect(translateRegionalGroupEnum('AFRICA')).toBe(m.regionalGroup_africa());
		expect(translateRegionalGroupEnum('WESTERN_EUROPE_OTHERS')).toBe(
			m.regionalGroup_westernEuropeOthers()
		);
	});

	it('is empty without a group', () => {
		expect(translateRegionalGroupEnum(undefined)).toBe('');
	});
});
