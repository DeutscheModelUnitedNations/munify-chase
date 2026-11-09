/** Rows a list query answers at once; the other instance answers 1000 when asked for no limit. */
const PAGE_SIZE = 1000;

/**
 * Every row of a list, read a page at a time in a fixed order: a conference holds more
 * participants than one list query answers.
 */
export async function readAll<T>(
	readPage: (page: {
		limit: number;
		offset: number;
		orderBy: { id: 'asc' };
	}) => PromiseLike<readonly T[]>
) {
	const rows: T[] = [];
	for (let offset = 0; ; offset += PAGE_SIZE) {
		const page = Array.from(await readPage({ limit: PAGE_SIZE, offset, orderBy: { id: 'asc' } }));
		rows.push(...page);
		if (page.length < PAGE_SIZE) return rows;
	}
}
