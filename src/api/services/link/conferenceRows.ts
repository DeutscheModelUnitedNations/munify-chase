/** What the link worker decides about DELEGATOR's conferences and their tables (`linkWorker.ts`). */

export interface ConferenceRow {
	id: string;
	title: string;
	location?: string | null;
	startConference: Date;
	endConference: Date;
	state: string;
	assignmentReleased: boolean;
}

/** The conferences the link mirrors: every one that has not ended, by id. */
export function openConferences(rows: Iterable<ConferenceRow>) {
	return new Map(
		Array.from(rows)
			.filter((row) => row.state !== 'POST')
			.map((row): [string, ConferenceRow] => [
				row.id,
				{
					id: row.id,
					title: row.title,
					location: row.location,
					startConference: row.startConference,
					endConference: row.endConference,
					state: row.state,
					assignmentReleased: row.assignmentReleased
				}
			])
	);
}

/** What of a conference the mirror carries: a change to any of it is worth writing. */
function mirroredFields(row: ConferenceRow) {
	return JSON.stringify([
		row.title,
		row.location ?? null,
		row.startConference.getTime(),
		row.endConference.getTime(),
		row.state,
		row.assignmentReleased
	]);
}

export function sameConference(a: ConferenceRow, b: ConferenceRow) {
	return mirroredFields(a) === mirroredFields(b);
}

/** What a new state of a mirrored conference asks for: its tables read again, its mirror written. */
export function conferenceChange({
	before,
	row
}: {
	before: ConferenceRow | undefined;
	row: ConferenceRow;
}) {
	if (!before) return { refresh: false, write: true };
	return {
		// what the link may read follows the release, without the tables changing
		refresh: before.assignmentReleased !== row.assignmentReleased,
		write: !sameConference(before, row)
	};
}

type MissingTable = 'users' | 'participants' | 'delegations';
const MISSING_TABLES: readonly MissingTable[] = ['users', 'participants', 'delegations'];

/**
 * A row pointing at one its table does not hold yet: that table is asked again once (`stale`), and
 * the mirror waits for the answer rather than dropping the person meanwhile. `asked` is what was
 * missing on the last pass, which the caller keeps for the next.
 */
export function tablesToAskAgain({
	missing,
	asked
}: {
	missing: Record<MissingTable, readonly string[]>;
	asked: ReadonlySet<string>;
}) {
	const stale = MISSING_TABLES.filter((name) => missing[name].some((id) => !asked.has(id)));
	const stillMissing = new Set(MISSING_TABLES.flatMap((name) => missing[name]));
	return { stale, stillMissing };
}

/** Ids named in the warning at most, per table: enough to look them up in DELEGATOR. */
const NAMED_IDS = 3;

/**
 * What the link notes (`lastError`) when rows stay missing after being asked for again: the people
 * behind them are left out of the mirror, which would otherwise go unnoticed. Undefined when
 * nothing is missing.
 */
export function leftOutWarning({
	title,
	missing
}: {
	title: string;
	missing: Record<MissingTable, readonly string[]>;
}) {
	const parts = MISSING_TABLES.filter((name) => missing[name].length > 0).map((name) => {
		const ids = missing[name];
		const named = ids.slice(0, NAMED_IDS).join(', ');
		return `${ids.length} ${name} (${named}${ids.length > NAMED_IDS ? ', …' : ''})`;
	});
	if (parts.length === 0) return undefined;
	return `${title}: DELEGATOR names rows the link may not read, so the people behind them are left out: ${parts.join('; ')}`;
}

/**
 * Per conference, why people were left out of its last mirror (`leftOutWarning`). The link has one
 * `lastError`, so a conference written fine afterwards must not clear another's warning.
 */
export function leftOutNotes() {
	const notes = new Map<string, string>();
	return {
		note({ conferenceId, warning }: { conferenceId: string; warning: string | undefined }) {
			if (warning) notes.set(conferenceId, warning);
			else notes.delete(conferenceId);
		},
		/** What the link shows, null when no conference leaves anybody out. */
		text: () => (notes.size > 0 ? [...notes.values()].join('\n') : null)
	};
}
