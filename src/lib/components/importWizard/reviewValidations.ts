import { m } from '#lib/paraglide/messages';
import type { z } from 'zod/v4';
import type { importDataSchema } from '#lib/utils/import';

type ImportData = z.infer<typeof importDataSchema>;
type Committee = ImportData['committees'][number];
export type Validation = { severity: 'error' | 'warning'; step: number; msg: string };

const committeeLabel = (c: Committee) => c.abbreviation || c.name || m.unbenamedCommittee();

/** Values that occur more than once, each once */
function duplicates(values: string[]): string[] {
	const counts = new Map<string, number>();
	for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
	return [...counts].filter(([, count]) => count > 1).map(([value]) => value);
}

function committeeIssues(data: ImportData, c: Committee): Validation[] {
	const issues: Validation[] = [];
	if (!c.abbreviation || !c.name) {
		issues.push({
			severity: 'error',
			step: 2,
			msg: m.committeeIncomplete({ name: committeeLabel(c) })
		});
	}
	if (!(data.committeeMembers ?? []).some((cm) => cm.committeeId === c.id)) {
		issues.push({
			severity: 'warning',
			step: 3,
			msg: m.committeeNoDelegations({ name: committeeLabel(c) })
		});
	}
	return issues;
}

/** What keeps an import from being applied (errors) or looks unintended (warnings) */
export function reviewValidations(data: ImportData): Validation[] {
	const v: Validation[] = [];
	if (!data.title) v.push({ severity: 'error', step: 1, msg: m.missingConferenceTitle() });
	if (data.committees.length === 0)
		v.push({ severity: 'error', step: 2, msg: m.noCommitteesCreated() });
	v.push(...data.committees.flatMap((c) => committeeIssues(data, c)));
	for (const name of duplicates(data.committees.map((c) => c.name).filter(Boolean))) {
		v.push({ severity: 'error', step: 2, msg: m.duplicateCommitteeName({ name }) });
	}
	for (const abbreviation of duplicates(
		data.committees.map((c) => c.abbreviation).filter(Boolean)
	)) {
		v.push({ severity: 'error', step: 2, msg: m.duplicateCommitteeAbbreviation({ abbreviation }) });
	}
	return v;
}

/** The distinct representations with a country code seated in a committee */
export function flaggedMembersOf(data: ImportData, committeeId: string) {
	const seen = new Set<string>();
	return (data.committeeMembers ?? [])
		.filter((cm) => cm.committeeId === committeeId)
		.map((cm) => data.representations.find((r) => r.id === cm.representationId))
		.filter((r): r is NonNullable<typeof r> => !!r?.alpha2Code)
		.filter((r) => {
			if (seen.has(r.id)) return false;
			seen.add(r.id);
			return true;
		});
}

/** How many distinct countries sit in any committee */
export function countDelegations(data: ImportData): number {
	return new Set(
		(data.committeeMembers ?? [])
			.map((cm) => data.representations.find((r) => r.id === cm.representationId)?.alpha2Code)
			.filter(Boolean)
	).size;
}
