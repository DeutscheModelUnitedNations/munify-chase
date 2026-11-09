import { describe, expect, it } from 'vitest';
import { nsaOfUser, searchNsas } from './nsaSearch';

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

describe('nsaOfUser', () => {
	it('takes the organisation from the representation', () => {
		expect(
			nsaOfUser({
				id: 'u1',
				name: 'Zoë',
				userEmail: 'zoe@example.org',
				delegatorUserId: 'd1',
				cardNumber: 2,
				conferenceMember: { representation: { name: 'Amnesty International' } }
			})
		).toEqual({
			id: 'u1',
			name: 'Zoë',
			userEmail: 'zoe@example.org',
			delegatorUserId: 'd1',
			cardNumber: 2,
			nsaName: 'Amnesty International'
		});
	});

	it('fills what is missing with null', () => {
		expect(nsaOfUser({ id: 'u2', userEmail: 'press@example.org', cardNumber: 0 })).toEqual({
			id: 'u2',
			name: null,
			userEmail: 'press@example.org',
			delegatorUserId: null,
			cardNumber: 0,
			nsaName: null
		});
	});
});
