import { describe, expect, it } from 'vitest';
import {
	MAX_LOGO_BYTES,
	readSvgLogo,
	settingsForm,
	settingsUpdate,
	toDateInputValue
} from './generalSettings';

describe('toDateInputValue', () => {
	it('formats the UTC day, empty for nothing or invalid dates', () => {
		expect(toDateInputValue(new Date('2026-03-04T23:30:00Z'))).toBe('2026-03-04');
		expect(toDateInputValue('2026-01-02T00:00:00Z')).toBe('2026-01-02');
		expect(toDateInputValue(null)).toBe('');
		expect(toDateInputValue('nope')).toBe('');
	});
});

describe('settings form', () => {
	const conference = {
		id: 'c',
		title: 'MUN',
		pressWebsite: null,
		location: 'Berlin',
		startDate: new Date('2026-05-01T00:00:00Z'),
		endDate: null,
		hasModeratedCaucus: true,
		logoSvg: null
	};

	it('fills the fields, empty for missing values', () => {
		expect(settingsForm(conference)).toEqual({
			title: 'MUN',
			pressWebsite: '',
			location: 'Berlin',
			startDate: '2026-05-01',
			endDate: '',
			hasModeratedCaucus: true,
			logoSvg: ''
		});
	});

	it('clears columns of empty fields on save', () => {
		const update = settingsUpdate({ id: 'c', form: settingsForm(conference) });
		expect(update).toEqual({
			id: 'c',
			title: 'MUN',
			pressWebsite: null,
			location: 'Berlin',
			startDate: new Date('2026-05-01'),
			endDate: null,
			hasModeratedCaucus: true,
			logoSvg: ''
		});
	});
});

describe('readSvgLogo', () => {
	const file = (text: string, size = text.length) => ({ size, text: () => Promise.resolve(text) });

	it('takes an SVG', async () => {
		expect(await readSvgLogo(file('<svg></svg>'))).toBe('<svg></svg>');
	});

	it('refuses big, unreadable and non-SVG files', async () => {
		expect(await readSvgLogo(file('<svg/>', MAX_LOGO_BYTES + 1))).toBeNull();
		expect(await readSvgLogo(file('<png>'))).toBeNull();
		expect(
			await readSvgLogo({ size: 1, text: () => Promise.reject(new Error('unreadable')) })
		).toBeNull();
	});
});
