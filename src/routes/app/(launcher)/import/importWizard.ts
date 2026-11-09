import type { z } from 'zod/v4';
import WorldCountries from 'world-countries';
import type { importDataSchema } from '#lib/utils/import';

export type ImportData = z.infer<typeof importDataSchema>;
type RegionalGroup = NonNullable<ImportData['representations'][number]['regionalGroup']>;

/** The wizard's steps after the start page, the last one is the review */
export const IMPORT_STEP_COUNT = 6;

const REGIONAL_GROUPS: Record<string, RegionalGroup> = {
	'African Group': 'AFRICA',
	'Asia and the Pacific Group': 'ASIA_PACIFIC',
	'Eastern European Group': 'EASTERN_EUROPE',
	'Latin American and Caribbean Group': 'LATIN_AMERICA_CARIBBEAN',
	'Western European and Others Group': 'WESTERN_EUROPE_OTHERS'
};

/** The UN regional group of a `world-countries` entry as the import schema names it. */
export function transformRegionalGroup(
	regionalGroup: string | undefined
): RegionalGroup | undefined {
	return regionalGroup ? REGIONAL_GROUPS[regionalGroup] : undefined;
}

export function importSchemaUrl(origin: string) {
	return `${origin}/api/schemas/import`;
}

/** Only JSON exports of the import format can be opened. */
export function isJsonFileName(name: string) {
	return name.split('.').pop()?.toLowerCase() === 'json';
}

/** A new, empty conference with every UN member state as a delegation. */
export function freshImportData(origin: string, makeId: () => string): ImportData {
	return {
		$schema: importSchemaUrl(origin),
		title: '',
		id: makeId(),
		committees: [],
		agendaItems: [],
		representations: WorldCountries.filter((x) => x.unMember).map((nation) => ({
			id: makeId(),
			representationType: 'DELEGATION',
			alpha3Code: nation.cca3.toLowerCase(),
			alpha2Code: nation.cca2.toLowerCase(),
			regionalGroup: transformRegionalGroup(nation.unRegionalGroup)
		})),
		conferenceMembers: [],
		committeeMembers: [],
		requestTypes: []
	} as unknown as ImportData;
}

/** Name of the downloaded import file, after the conference's title. */
export function importFileName(title: string | undefined) {
	return `${title || 'conference'}-import.json`;
}

/** The calendar date (UTC) of a date, `undefined` for none or an invalid one. */
export function toDateOnly(d: Date | string | undefined | null): string | undefined {
	if (!d) return undefined;
	const date = d instanceof Date ? d : new Date(d);
	if (Number.isNaN(date.getTime())) return undefined;
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

/**
 * What the import mutation receives: the data with plain dates. Drops `$schema` from the data
 * itself, as the server does not know it.
 */
export function importPayload(data: ImportData): ImportData {
	delete data.$schema;
	return {
		...data,
		startDate: toDateOnly(data.startDate),
		endDate: toDateOnly(data.endDate)
	} as unknown as ImportData;
}

type Country = { alpha2Code: string; alpha3Code: string; name: string };

function sameCode(a: string | undefined, b: string) {
	return a?.toLowerCase() === b.toLowerCase();
}

/** The delegation of a country, created when the conference has none yet. Returns its id. */
function ensureDelegation(data: ImportData, country: Country, makeId: () => string) {
	const existing = data.representations.find((x) => sameCode(x.alpha2Code, country.alpha2Code));
	if (existing) return existing.id;
	const worldCountry = WorldCountries.find((x) => sameCode(x.cca2, country.alpha2Code));
	const id = makeId();
	data.representations.push({
		alpha2Code: country.alpha2Code,
		alpha3Code: country.alpha3Code,
		representationType: 'DELEGATION',
		id,
		regionalGroup: transformRegionalGroup(worldCountry?.unRegionalGroup)
	});
	return id;
}

/**
 * Seats the countries in a committee, creating delegations the conference does not have yet.
 * Countries already seated there are skipped. Changes `data` in place.
 */
export function addCountriesToCommittee({
	data,
	committeeId,
	countries,
	makeId
}: {
	data: ImportData;
	committeeId: string;
	countries: Country[];
	makeId: () => string;
}) {
	data.committeeMembers ??= [];
	for (const country of countries) {
		const representationId = ensureDelegation(data, country, makeId);
		const seated = data.committeeMembers.some(
			(cm) => cm.committeeId === committeeId && cm.representationId === representationId
		);
		if (seated) continue;
		data.committeeMembers.push({ id: makeId(), committeeId, representationId });
	}
}
