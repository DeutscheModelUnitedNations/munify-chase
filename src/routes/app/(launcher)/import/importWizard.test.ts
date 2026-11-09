import { describe, expect, test } from 'vitest';
import {
	addCountriesToCommittee,
	freshImportData,
	importFileName,
	importPayload,
	importSchemaUrl,
	isJsonFileName,
	toDateOnly,
	transformRegionalGroup,
	type ImportData
} from './importWizard';

function counter() {
	let n = 0;
	return () => `id${++n}`;
}

function emptyData(overrides: Partial<ImportData> = {}): ImportData {
	return {
		id: 'conf',
		title: 'Conf',
		committees: [],
		representations: [],
		conferenceMembers: [],
		committeeMembers: [],
		...overrides
	} as unknown as ImportData;
}

describe('transformRegionalGroup', () => {
	test('maps the UN regional groups', () => {
		expect(transformRegionalGroup('African Group')).toBe('AFRICA');
		expect(transformRegionalGroup('Asia and the Pacific Group')).toBe('ASIA_PACIFIC');
		expect(transformRegionalGroup('Eastern European Group')).toBe('EASTERN_EUROPE');
		expect(transformRegionalGroup('Latin American and Caribbean Group')).toBe(
			'LATIN_AMERICA_CARIBBEAN'
		);
		expect(transformRegionalGroup('Western European and Others Group')).toBe(
			'WESTERN_EUROPE_OTHERS'
		);
	});

	test('knows nothing else', () => {
		expect(transformRegionalGroup('')).toBeUndefined();
		expect(transformRegionalGroup(undefined)).toBeUndefined();
		expect(transformRegionalGroup('Moon Group')).toBeUndefined();
	});
});

describe('files', () => {
	test('accepts JSON files only', () => {
		expect(isJsonFileName('export.JSON')).toBe(true);
		expect(isJsonFileName('export.json.txt')).toBe(false);
		expect(isJsonFileName('json')).toBe(true);
	});

	test('names the download after the title', () => {
		expect(importFileName('MUN')).toBe('MUN-import.json');
		expect(importFileName('')).toBe('conference-import.json');
		expect(importFileName(undefined)).toBe('conference-import.json');
	});

	test('points at the schema of this instance', () => {
		expect(importSchemaUrl('https://chase.test')).toBe('https://chase.test/api/schemas/import');
	});
});

describe('freshImportData', () => {
	test('starts empty with every UN member as a delegation', () => {
		const data = freshImportData('https://chase.test', counter());
		expect(data.$schema).toBe('https://chase.test/api/schemas/import');
		expect(data.id).toBe('id1');
		expect(data.title).toBe('');
		expect(data.committees).toEqual([]);
		expect(data.representations.length).toBeGreaterThan(190);
		expect(data.representations.find((r) => r.alpha2Code === 'de')).toMatchObject({
			representationType: 'DELEGATION',
			alpha3Code: 'deu',
			regionalGroup: 'WESTERN_EUROPE_OTHERS'
		});
	});
});

describe('toDateOnly', () => {
	test('formats the UTC calendar date', () => {
		expect(toDateOnly(new Date('2026-03-05T23:30:00Z'))).toBe('2026-03-05');
		expect(toDateOnly('2026-12-01T00:00:00Z')).toBe('2026-12-01');
	});

	test('drops empty and invalid dates', () => {
		expect(toDateOnly(null)).toBeUndefined();
		expect(toDateOnly(undefined)).toBeUndefined();
		expect(toDateOnly('not a date')).toBeUndefined();
	});
});

describe('importPayload', () => {
	test('sends plain dates and drops the schema from the data', () => {
		const data = emptyData({
			$schema: 'x',
			startDate: new Date('2026-03-01T00:00:00Z'),
			endDate: undefined
		});
		const payload = importPayload(data);
		expect(data.$schema).toBeUndefined();
		expect(payload).toMatchObject({ id: 'conf', startDate: '2026-03-01', endDate: undefined });
		expect('$schema' in payload).toBe(false);
	});
});

describe('addCountriesToCommittee', () => {
	const france = { alpha2Code: 'FR', alpha3Code: 'FRA', name: 'France' };
	const germany = { alpha2Code: 'DE', alpha3Code: 'DEU', name: 'Germany' };

	test('creates missing delegations and seats them', () => {
		const data = emptyData({ committeeMembers: undefined } as unknown as Partial<ImportData>);
		addCountriesToCommittee({ data, committeeId: 'ga', countries: [france], makeId: counter() });
		expect(data.representations).toEqual([
			{
				alpha2Code: 'FR',
				alpha3Code: 'FRA',
				representationType: 'DELEGATION',
				id: 'id1',
				regionalGroup: 'WESTERN_EUROPE_OTHERS'
			}
		]);
		expect(data.committeeMembers).toEqual([
			{ id: 'id2', committeeId: 'ga', representationId: 'id1' }
		]);
	});

	test('reuses existing delegations and skips countries already seated', () => {
		const data = emptyData({
			representations: [
				{ id: 'fr', representationType: 'DELEGATION', alpha2Code: 'fr', alpha3Code: 'fra' },
				{ id: 'de', representationType: 'DELEGATION', alpha2Code: 'de', alpha3Code: 'deu' }
			],
			committeeMembers: [{ id: 'cm', committeeId: 'ga', representationId: 'fr' }]
		});
		addCountriesToCommittee({
			data,
			committeeId: 'ga',
			countries: [france, germany, germany],
			makeId: counter()
		});
		expect(data.representations).toHaveLength(2);
		expect(data.committeeMembers).toEqual([
			{ id: 'cm', committeeId: 'ga', representationId: 'fr' },
			{ id: 'id1', committeeId: 'ga', representationId: 'de' }
		]);
	});

	test('leaves the regional group open for unknown countries', () => {
		const data = emptyData();
		addCountriesToCommittee({
			data,
			committeeId: 'ga',
			countries: [{ alpha2Code: 'XX', alpha3Code: 'XXX', name: 'Nowhere' }],
			makeId: counter()
		});
		expect(data.representations[0].regionalGroup).toBeUndefined();
	});
});
