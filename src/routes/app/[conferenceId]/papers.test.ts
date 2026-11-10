import { describe, expect, it, vi } from 'vitest';
import { m } from '#lib/paraglide/messages';
import {
	chairPaperList,
	createPaperAndOpen,
	paperLabel,
	paperTitle,
	participantPaperGroups
} from './papers';

describe('paper names', () => {
	it('prefers the document number, then the title, then a generated name', () => {
		expect(paperLabel({ id: 'p', documentNumber: 'DR 1', title: 'T' })).toBe('DR 1');
		expect(paperLabel({ id: 'p', title: 'T' })).toBe('T');
		expect(paperTitle({ id: 'p', documentNumber: 'DR 1', title: 'T' })).toBe('T');
		expect(paperTitle({ id: 'p' })).toBeTruthy();
	});
});

describe('participantPaperGroups', () => {
	const papers = [
		{ id: '1', status: 'WORKING_PAPER', creatorCommitteeMember: { id: 'me' } },
		{ id: '2', status: 'WORKING_PAPER', editors: [{ conferenceUser: { id: 'cu' } }] },
		{ id: '3', status: 'WORKING_PAPER', creatorCommitteeMember: { id: 'other' } },
		{ id: '4', status: 'SUBMITTED' },
		{ id: '5', status: 'FINAL' },
		{ id: '6', status: 'DRAFT_RESOLUTION' }
	];

	it('splits the papers into mine, submitted and published', () => {
		const groups = participantPaperGroups({ papers, myMemberId: 'me', myConferenceUserId: 'cu' });
		expect(groups.mine.map((p) => p.id)).toEqual(['1', '2']);
		expect(groups.submitted.map((p) => p.id)).toEqual(['4']);
		expect(groups.published.map((p) => p.id)).toEqual(['5', '6']);
	});

	it('finds no own papers without a seat or editing rights', () => {
		const groups = participantPaperGroups({
			papers: null,
			myMemberId: null,
			myConferenceUserId: ''
		});
		expect(groups).toEqual({ mine: [], submitted: [], published: [] });
		const noSeat = participantPaperGroups({ papers, myMemberId: null, myConferenceUserId: 'none' });
		expect(noSeat.mine).toEqual([]);
	});
});

describe('chairPaperList', () => {
	const papers = [
		{ id: 'a', status: 'SUBMITTED', agendaItem: { id: 'ai1' }, sponsors: [1] },
		{ id: 'b', status: 'WORKING_PAPER', agendaItem: { id: 'ai1' }, sponsors: [1, 2] },
		{ id: 'c', status: 'SUBMITTED', agendaItem: { id: 'ai2' }, sponsors: null }
	];

	it("keeps the active agenda item's papers, most sponsored first", () => {
		expect(
			chairPaperList({ papers, activeAgendaItemId: 'ai1', status: 'ALL' }).map((p) => p.id)
		).toEqual(['b', 'a']);
	});

	it('filters by status and shows every agenda item without an active one', () => {
		expect(
			chairPaperList({ papers, activeAgendaItemId: null, status: 'SUBMITTED' }).map((p) => p.id)
		).toEqual(['a', 'c']);
		expect(chairPaperList({ papers: undefined, activeAgendaItemId: null, status: 'ALL' })).toEqual(
			[]
		);
	});
});

describe('createPaperAndOpen', () => {
	function setup(create: (agendaItemId: string) => Promise<{ id: string } | null | undefined>) {
		const calls = {
			open: vi.fn((_id: string) => Promise.resolve()),
			setCreating: vi.fn(),
			onError: vi.fn()
		};
		return { ...calls, create: vi.fn(create) };
	}

	it('creates the paper on the agenda item and opens it', async () => {
		const deps = setup(() => Promise.resolve({ id: 'paper' }));
		await createPaperAndOpen({ agendaItemId: 'ai', ...deps });
		expect(deps.create).toHaveBeenCalledWith('ai');
		expect(deps.open).toHaveBeenCalledWith('paper');
		expect(deps.setCreating.mock.calls).toEqual([[true], [false]]);
		expect(deps.onError).not.toHaveBeenCalled();
	});

	it('asks for an active agenda item first', async () => {
		const deps = setup(() => Promise.resolve({ id: 'paper' }));
		await createPaperAndOpen({ agendaItemId: undefined, ...deps });
		expect(deps.onError).toHaveBeenCalledWith(m.selectActiveAgendaItemFirst());
		expect(deps.create).not.toHaveBeenCalled();
		expect(deps.setCreating).not.toHaveBeenCalled();
	});

	it('reports a failure and stops creating', async () => {
		const deps = setup(() => Promise.reject(new Error('nope')));
		await createPaperAndOpen({ agendaItemId: 'ai', ...deps });
		expect(deps.onError).toHaveBeenCalledWith('nope');
		expect(deps.setCreating.mock.calls).toEqual([[true], [false]]);
	});

	it('opens nothing when the server returned no paper', async () => {
		const deps = setup(() => Promise.resolve(null));
		await createPaperAndOpen({ agendaItemId: 'ai', ...deps });
		expect(deps.open).not.toHaveBeenCalled();
	});
});
