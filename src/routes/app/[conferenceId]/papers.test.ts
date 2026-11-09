import { describe, expect, it } from 'vitest';
import { chairPaperList, errorMessage, paperLabel, paperTitle, participantPaperGroups } from './papers';

describe('paper names', () => {
	it('prefers the document number, then the title, then a generated name', () => {
		expect(paperLabel({ id: 'p', documentNumber: 'DR 1', title: 'T' })).toBe('DR 1');
		expect(paperLabel({ id: 'p', title: 'T' })).toBe('T');
		expect(paperTitle({ id: 'p', documentNumber: 'DR 1', title: 'T' })).toBe('T');
		expect(paperTitle({ id: 'p' })).toBeTruthy();
	});
});

describe('errorMessage', () => {
	it('takes an error\'s message, else the fallback', () => {
		expect(errorMessage({ err: new Error('boom'), fallback: 'x' })).toBe('boom');
		expect(errorMessage({ err: 'boom', fallback: 'x' })).toBe('x');
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
		const groups = participantPaperGroups({ papers: null, myMemberId: null, myConferenceUserId: '' });
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

	it('keeps the active agenda item\'s papers, most sponsored first', () => {
		expect(chairPaperList({ papers, activeAgendaItemId: 'ai1', status: 'ALL' }).map((p) => p.id)).toEqual([
			'b',
			'a'
		]);
	});

	it('filters by status and shows every agenda item without an active one', () => {
		expect(
			chairPaperList({ papers, activeAgendaItemId: null, status: 'SUBMITTED' }).map((p) => p.id)
		).toEqual(['a', 'c']);
		expect(chairPaperList({ papers: undefined, activeAgendaItemId: null, status: 'ALL' })).toEqual([]);
	});
});
