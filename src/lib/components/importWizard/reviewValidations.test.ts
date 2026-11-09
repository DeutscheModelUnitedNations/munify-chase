import { describe, expect, it } from 'vitest';
import type { z } from 'zod/v4';
import type { importDataSchema } from '#lib/utils/import';
import { countDelegations, flaggedMembersOf, reviewValidations } from './reviewValidations';

type ImportData = z.infer<typeof importDataSchema>;

function importData(overrides: Partial<ImportData> = {}): ImportData {
	return {
		id: 'i',
		title: 'MUN',
		committees: [],
		representations: [],
		conferenceMembers: [],
		committeeMembers: [],
		agendaItems: [],
		...overrides
	};
}

const de = {
	id: 'de',
	representationType: 'DELEGATION' as const,
	alpha2Code: 'de',
	alpha3Code: 'deu'
};
const fr = {
	id: 'fr',
	representationType: 'DELEGATION' as const,
	alpha2Code: 'fr',
	alpha3Code: 'fra'
};
const nsa = { id: 'nsa', representationType: 'NSA' as const, name: 'X', icon: 'y' };

describe('reviewValidations', () => {
	it('wants a title and a committee', () => {
		const issues = reviewValidations(importData({ title: '' }));
		expect(issues.map((i) => [i.severity, i.step])).toEqual([
			['error', 1],
			['error', 2]
		]);
	});

	it('flags incomplete, empty and duplicate committees', () => {
		const issues = reviewValidations(
			importData({
				committees: [
					{ id: 'a', name: 'General', abbreviation: 'GA' },
					{ id: 'b', name: 'General', abbreviation: 'GA' },
					{ id: 'c', name: '', abbreviation: '' }
				],
				committeeMembers: [{ id: 'm', representationId: 'de', committeeId: 'a' }]
			})
		);
		expect(issues.map((i) => [i.severity, i.step])).toEqual([
			['warning', 3],
			['error', 2],
			['warning', 3],
			['error', 2],
			['error', 2]
		]);
	});

	it('has nothing to say about a complete import', () => {
		expect(
			reviewValidations(
				importData({
					committees: [{ id: 'a', name: 'General', abbreviation: 'GA' }],
					committeeMembers: [{ id: 'm', representationId: 'de', committeeId: 'a' }]
				})
			)
		).toEqual([]);
	});
});

describe('members', () => {
	const data = importData({
		representations: [de, fr, nsa],
		committeeMembers: [
			{ id: '1', representationId: 'de', committeeId: 'a' },
			{ id: '2', representationId: 'de', committeeId: 'a' },
			{ id: '3', representationId: 'nsa', committeeId: 'a' },
			{ id: '4', representationId: 'fr', committeeId: 'b' },
			{ id: '5', representationId: 'gone', committeeId: 'a' }
		]
	});

	it('lists each flagged representation of a committee once', () => {
		expect(flaggedMembersOf(data, 'a').map((r) => r.id)).toEqual(['de']);
	});

	it('counts the distinct countries', () => {
		expect(countDelegations(data)).toBe(2);
	});
});
