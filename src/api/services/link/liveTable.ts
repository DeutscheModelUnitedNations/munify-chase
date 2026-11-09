/** Rows a list query answers at once; the other instance answers 1000 when asked for no limit. */
export const PAGE_SIZE = 1000;

/** What a rumble live query answers: the first answer as a promise, then every change. */
export type LiveResult<T> = PromiseLike<unknown> & {
	subscribe: (next: (value: T) => void) => () => void;
};

/** Lets a live query's first answer fail without an unhandled rejection; it still subscribes. */
export function handled<T extends PromiseLike<unknown>>(
	result: T,
	onError: (error: unknown) => void
): T {
	Promise.resolve(result).then(undefined, onError);
	return result;
}

/** A page whose first answer failed is asked again after this, doubling up to the maximum. */
const RETRY_FIRST_MS = 1_000;
const RETRY_MAX_MS = 60_000;

type PageArgs = { limit: number; offset: number; orderBy: { id: 'asc' } };

/**
 * Lets at most `limit` first answers be awaited at once. A worker starting up asks for every table
 * of every conference; all at once, that is a burst of heavy queries the other instance's database
 * may not be able to run side by side.
 */
export function createGate(limit: number) {
	let inside = 0;
	const waiting: (() => void)[] = [];
	return {
		/** Waits for a place; the answer gives it back, once. */
		enter: () =>
			new Promise<() => void>((resolve) => {
				const go = () => {
					inside++;
					let left = false;
					resolve(() => {
						if (left) return;
						left = true;
						inside--;
						waiting.shift()?.();
					});
				};
				if (inside < limit) go();
				else waiting.push(go);
			})
	};
}

export type Gate = ReturnType<typeof createGate>;

/**
 * One table of the other instance, as far as the link reads it, kept in memory and current through
 * live queries. Each answer of a live query holds the rows as they are, so nothing is read twice.
 *
 * A list answers at most a page, so the table is watched a page at a time, by id: a full page opens
 * the next one, a page that is not full closes those after it. Pages answer one after another, so
 * while rows come and go one may shift into the page that already answered; a row missing from
 * every page is therefore asked for by id before it counts as gone.
 */
export function liveTable<Row extends { id: string }>({
	watchPage,
	readIds,
	onChange,
	onError,
	gate = createGate(Infinity)
}: {
	watchPage: (page: PageArgs) => LiveResult<readonly Row[] | null | undefined>;
	/** The rows among `ids` that exist. */
	readIds: (ids: string[]) => PromiseLike<readonly Row[]>;
	/** Called once the rows changed, and every page has answered. */
	onChange: () => void;
	onError: (error: unknown) => void;
	/** Shared by the tables of a worker, so their first answers do not all run at once. */
	gate?: Gate;
}) {
	type Page = { rows: readonly Row[] | undefined; stop: () => void };
	let pages: Page[] = [];
	let rows = new Map<string, Row>();
	/** Counts settles, so an older one finishing late does not overwrite a newer one. */
	let settles = 0;
	let settling = false;
	let stopped = false;

	const open = (index: number, failures = 0) => {
		const page: Page = { rows: undefined, stop: () => {} };
		pages[index] = page;
		let closed = false;
		let retry: ReturnType<typeof setTimeout> | undefined;
		let unsubscribe = () => {};
		page.stop = () => {
			closed = true;
			clearTimeout(retry);
			unsubscribe();
		};
		const current = () => !closed && !stopped && pages[index] === page;

		void gate.enter().then((leave) => {
			if (!current()) return leave();
			const result = watchPage({
				limit: PAGE_SIZE,
				offset: index * PAGE_SIZE,
				orderBy: { id: 'asc' }
			});
			Promise.resolve(result).then(leave, (error: unknown) => {
				leave();
				onError(error);
				// a page whose first answer failed would hold the table back until something in it
				// changes, so it is asked again, later each time
				if (!current() || page.rows) return;
				retry = setTimeout(
					() => {
						if (!current() || page.rows) return;
						page.stop();
						open(index, failures + 1);
					},
					Math.min(RETRY_MAX_MS, RETRY_FIRST_MS * 2 ** failures)
				);
			});
			unsubscribe = result.subscribe((value) => {
				if (!value || !current()) return;
				page.rows = Array.from(value);
				answered(index);
			});
		});
	};

	const answered = (index: number) => {
		const page = pages[index];
		if (!page?.rows) return;
		if (page.rows.length >= PAGE_SIZE) {
			if (!pages[index + 1]) open(index + 1);
		} else {
			for (const later of pages.splice(index + 1)) later.stop();
		}
		if (pages.every((p) => p.rows)) void settle();
	};

	const settle = async () => {
		const run = ++settles;
		settling = true;
		const next = new Map<string, Row>();
		for (const page of pages) for (const row of page.rows ?? []) next.set(row.id, row);
		const departed = [...rows.keys()].filter((id) => !next.has(id));
		// one page is one consistent answer; across several, a row may have moved between them
		if (pages.length > 1 && departed.length > 0) {
			try {
				for (const row of await readIds(departed)) next.set(row.id, row);
			} catch (error) {
				onError(error);
				// keep them until a later answer tells
				for (const id of departed) {
					const row = rows.get(id);
					if (row) next.set(id, row);
				}
			}
		}
		if (run !== settles || stopped) return;
		rows = next;
		settling = false;
		onChange();
	};

	const stopPages = () => {
		for (const page of pages.splice(0)) page.stop();
	};

	open(0);

	return {
		/** Every page answered, and what they answered is in `rows`. */
		ready: () => !settling && pages.length > 0 && pages.every((page) => page.rows),
		rows: () => [...rows.values()],
		/**
		 * Asks again from scratch: after a reconnect, which may have ended the subscriptions, or when
		 * what the link may read changed without the table changing. The rows stay until answered.
		 */
		refresh: () => {
			stopPages();
			open(0);
		},
		stop: () => {
			stopped = true;
			stopPages();
		}
	};
}

export type LiveTable<Row extends { id: string }> = ReturnType<typeof liveTable<Row>>;
