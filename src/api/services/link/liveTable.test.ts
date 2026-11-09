import { describe, expect, it, vi } from 'vitest';
import { createGate, liveTable, PAGE_SIZE } from './liveTable';

type Row = { id: string };

/** A fake live query per page: `answer(offset, rows)` plays what the other instance answers. */
function fakeRemote({ failFirst = 0 }: { failFirst?: number } = {}) {
	const listeners = new Map<number, (rows: Row[]) => void>();
	const opened: number[] = [];
	return {
		opened,
		watchPage: ({ offset }: { offset: number }) => {
			opened.push(offset);
			const answer =
				opened.length <= failFirst ? Promise.reject(new Error('away')) : Promise.resolve(undefined);
			return Object.assign(answer, {
				subscribe: (next: (rows: Row[]) => void) => {
					listeners.set(offset, next);
					return () => void listeners.delete(offset);
				}
			});
		},
		answer: (offset: number, rows: Row[]) => listeners.get(offset)?.(rows),
		isOpen: (offset: number) => listeners.has(offset)
	};
}

const ids = (from: number, count: number) =>
	Array.from({ length: count }, (_, i) => ({ id: String(from + i).padStart(6, '0') }));

const settled = () => new Promise((resolve) => setTimeout(resolve, 0));

async function setup(
	readIds: (ids: string[]) => Promise<Row[]> = () => Promise.resolve([]),
	{ failFirst = 0 }: { failFirst?: number } = {}
) {
	const remote = fakeRemote({ failFirst });
	const onChange = vi.fn();
	const table = liveTable<Row>({
		watchPage: remote.watchPage,
		readIds,
		onChange,
		onError: () => {}
	});
	// the first page subscribes once the gate let it in
	await settled();
	return { remote, onChange, table };
}

describe('liveTable', () => {
	it('is ready with the rows once the first page answered', async () => {
		const { remote, onChange, table } = await setup();
		expect(table.ready()).toBe(false);
		remote.answer(0, ids(0, 3));
		await settled();
		expect(table.ready()).toBe(true);
		expect(table.rows()).toHaveLength(3);
		expect(onChange).toHaveBeenCalledOnce();
	});

	it('opens the next page while a page is full, and is ready only once that answered', async () => {
		const { remote, table } = await setup();
		remote.answer(0, ids(0, PAGE_SIZE));
		await settled();
		expect(remote.isOpen(PAGE_SIZE)).toBe(true);
		expect(table.ready()).toBe(false);
		remote.answer(PAGE_SIZE, ids(PAGE_SIZE, 5));
		await settled();
		expect(table.ready()).toBe(true);
		expect(table.rows()).toHaveLength(PAGE_SIZE + 5);
	});

	it('closes the pages after one that is no longer full', async () => {
		const { remote, table } = await setup();
		remote.answer(0, ids(0, PAGE_SIZE));
		await settled();
		remote.answer(PAGE_SIZE, ids(PAGE_SIZE, 1));
		await settled();
		remote.answer(0, ids(0, PAGE_SIZE - 1));
		await settled();
		expect(remote.isOpen(PAGE_SIZE)).toBe(false);
		expect(table.rows()).toHaveLength(PAGE_SIZE - 1);
	});

	it('drops a row a single page no longer has, without asking', async () => {
		const readIds = vi.fn(() => Promise.resolve([]));
		const { remote, table } = await setup(readIds);
		remote.answer(0, ids(0, 3));
		await settled();
		remote.answer(0, ids(0, 2));
		await settled();
		expect(table.rows().map((row) => row.id)).toEqual(['000000', '000001']);
		expect(readIds).not.toHaveBeenCalled();
	});

	it('asks for a row missing across pages, and keeps it when it still exists', async () => {
		// a row before it went, so the last row of the first page moved into the second, which has
		// not answered again yet
		const moved = ids(PAGE_SIZE, 1)[0];
		const readIds = vi.fn((asked: string[]) =>
			Promise.resolve(asked.includes(moved.id) ? [moved] : [])
		);
		const { remote, table } = await setup(readIds);
		remote.answer(0, ids(0, PAGE_SIZE));
		await settled();
		remote.answer(PAGE_SIZE, ids(PAGE_SIZE, 2));
		await settled();
		remote.answer(PAGE_SIZE, ids(PAGE_SIZE + 1, 1));
		await settled();
		expect(readIds).toHaveBeenCalledWith([moved.id]);
		expect(table.rows().some((row) => row.id === moved.id)).toBe(true);
	});

	it('asks again from scratch on refresh, keeping the rows until then', async () => {
		const { remote, table } = await setup();
		remote.answer(0, ids(0, 2));
		await settled();
		table.refresh();
		await settled();
		expect(remote.opened).toEqual([0, 0]);
		expect(table.ready()).toBe(false);
		expect(table.rows()).toHaveLength(2);
		remote.answer(0, ids(0, 4));
		await settled();
		expect(table.rows()).toHaveLength(4);
	});

	it('asks a page again, later each time, when its first answer failed', async () => {
		vi.useFakeTimers();
		try {
			const started = setup(undefined, { failFirst: 2 });
			await vi.advanceTimersByTimeAsync(0);
			const { remote, table } = await started;
			expect(remote.opened).toEqual([0]);
			await vi.advanceTimersByTimeAsync(1_000);
			expect(remote.opened).toEqual([0, 0]);
			await vi.advanceTimersByTimeAsync(1_000);
			expect(remote.opened).toEqual([0, 0]);
			await vi.advanceTimersByTimeAsync(1_000);
			expect(remote.opened).toEqual([0, 0, 0]);
			remote.answer(0, ids(0, 1));
			await vi.advanceTimersByTimeAsync(0);
			expect(table.ready()).toBe(true);
			await vi.advanceTimersByTimeAsync(60_000);
			expect(remote.opened).toHaveLength(3);
		} finally {
			vi.useRealTimers();
		}
	});
});

describe('createGate', () => {
	it('lets in at most the limit, and the next one once a place is given back', async () => {
		const gate = createGate(2);
		const entered: number[] = [];
		const leaves = await Promise.all([gate.enter(), gate.enter()]);
		void gate.enter().then(() => entered.push(3));
		await settled();
		expect(entered).toEqual([]);
		leaves[0]();
		leaves[0]();
		await settled();
		expect(entered).toEqual([3]);
	});
});
