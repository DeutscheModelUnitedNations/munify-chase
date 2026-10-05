import type { z } from 'zod/v4';
import { m } from '$lib/paraglide/messages';
import type { importDataSchema } from '$lib/utils/import';

type ImportData = z.infer<typeof importDataSchema>;
type ImportCommittee = ImportData['committees'][number];
export type Validation = { severity: 'error' | 'warning'; step: number; msg: string };

const committeeLabel = (c: ImportCommittee) => c.abbreviation || c.name || m.unbenamedCommittee();

/** Values that occur more than once, each listed once in order of first occurrence */
function duplicates(values: (string | null | undefined)[]) {
	return values.filter(
		(v, i): v is string => !!v && values.indexOf(v) === i && values.indexOf(v, i + 1) !== -1
	);
}

function committeeValidations(data: ImportData, c: ImportCommittee): Validation[] {
	const v: Validation[] = [];
	if (!c.abbreviation || !c.name) {
		v.push({ severity: 'error', step: 2, msg: m.committeeIncomplete({ name: committeeLabel(c) }) });
	}
	if (!(data.committeeMembers ?? []).some((cm) => cm.committeeId === c.id)) {
		v.push({
			severity: 'warning',
			step: 3,
			msg: m.committeeNoDelegations({ name: committeeLabel(c) })
		});
	}
	return v;
}

/** Problems the import wizard's review step lists, with the step that fixes each */
export function validateImport(data: ImportData): Validation[] {
	const v: Validation[] = [];
	if (!data.title) v.push({ severity: 'error', step: 1, msg: m.missingConferenceTitle() });
	if (data.committees.length === 0)
		v.push({ severity: 'error', step: 2, msg: m.noCommitteesCreated() });
	v.push(...data.committees.flatMap((c) => committeeValidations(data, c)));
	for (const name of duplicates(data.committees.map((c) => c.name))) {
		v.push({ severity: 'error', step: 2, msg: m.duplicateCommitteeName({ name }) });
	}
	for (const abbreviation of duplicates(data.committees.map((c) => c.abbreviation))) {
		v.push({ severity: 'error', step: 2, msg: m.duplicateCommitteeAbbreviation({ abbreviation }) });
	}
	return v;
}
