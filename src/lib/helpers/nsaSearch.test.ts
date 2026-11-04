import { describe, expect, it } from 'vitest';
import { searchNsas } from './nsaSearch';

const nsas = [
	{ name: 'Zoë Müller', userEmail: 'zoe@example.org', nsaName: 'Amnesty International' },
	{ name: null, userEmail: 'press@example.org', nsaName: 'Greenpeace' }
];

describe('searchNsas', () => {
	it('finds by name regardless of case and diacritics', () => {
		expect(searchNsas({ nsas, query: 'zoe MULLER' })).toEqual([nsas[0]]);
	});

	it('finds by e-mail and by organisation', () => {
		expect(searchNsas({ nsas, query: 'press@' })).toEqual([nsas[1]]);
		expect(searchNsas({ nsas, query: 'green' })).toEqual([nsas[1]]);
	});

	it('finds nobody for an empty query', () => {
		expect(searchNsas({ nsas, query: '  ' })).toEqual([]);
	});
});
