/**
 * What writing a table's mirrored rows changes (`reconcile.ts`): the rows to write, being new or
 * different in a mirrored field, and the managed rows DELEGATOR no longer has. Pure, so the
 * comparison is unit tested; a sync that changed nothing writes and announces nothing.
 */
export function rowChanges<T extends { id: string }, K extends keyof T>({
	current,
	wanted,
	fields
}: {
	/** Typed loosely: the database's columns may be wider than what the mirror writes. */
	current: readonly ({ id: string; managedByDelegator: boolean } & { [F in K]: unknown })[];
	wanted: readonly T[];
	/** The columns the mirror sets; the others are CHASE's own. */
	fields: readonly K[];
}) {
	const byId = new Map(current.map((row) => [row.id, row]));
	const wantedIds = new Set(wanted.map((row) => row.id));
	const write = wanted.filter((row) => {
		const had = byId.get(row.id);
		return !had || !had.managedByDelegator || fields.some((field) => !same(had[field], row[field]));
	});
	return {
		write,
		/** Some of `write` is new, which lists hear of; the rest only their rows do. */
		created: write.some((row) => !byId.has(row.id)),
		remove: current
			.filter((row) => row.managedByDelegator && !wantedIds.has(row.id))
			.map((row) => row.id)
	};
}

function same(a: unknown, b: unknown) {
	if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
	return (a ?? null) === (b ?? null);
}
