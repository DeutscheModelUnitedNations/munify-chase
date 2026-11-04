import { describe, expect, it } from 'vitest';
import { committeeMemberId } from './mirror';
import { workingPaperChanges, type DelegatorWorkingPaper } from './workingPapers';

const content = { committeeName: 'GA', preamble: [], operative: [] };
const seat = committeeMemberId({ roleId: 'deu', committeeId: 'ga' });
const seats = new Set([seat]);

const paper = (overrides: Partial<DelegatorWorkingPaper> = {}): DelegatorWorkingPaper => ({
	id: 'paper',
	agendaItem: { id: 'climate', committeeId: 'ga' },
	delegation: { assignedRoleId: 'deu' },
	versions: [
		{ version: 1, content },
		{ version: 3, content: { ...content, committeeName: 'GA v3' } }
	],
	...overrides
});

describe('workingPaperChanges', () => {
	it("takes a paper over with its latest accepted version, by its delegation's seat", () => {
		const { create } = workingPaperChanges({ papers: [paper()], existing: [], seats });
		expect(create).toEqual([
			{
				delegatorPaperId: 'paper',
				version: 3,
				content: { ...content, committeeName: 'GA v3' },
				committeeId: 'ga',
				agendaItemId: 'climate',
				creatorCommitteeMemberId: seat
			}
		]);
	});

	it('leaves a paper behind without an agenda item, a seat or a readable text', () => {
		const papers = [
			paper({ id: 'a', agendaItem: null }),
			paper({ id: 'b', delegation: { assignedRoleId: 'fra' } }),
			paper({ id: 'c', versions: [{ version: 1, content: { text: 'tiptap' } }] })
		];
		expect(workingPaperChanges({ papers, existing: [], seats }).leftBehind).toEqual([
			{ paperId: 'a', reason: 'noAgendaItem' },
			{ paperId: 'b', reason: 'noSeat' },
			{ paperId: 'c', reason: 'unreadable' }
		]);
	});

	it('follows a newer version until CHASE changed the draft', () => {
		const draft = { id: 'd', delegatorPaperId: 'paper', delegatorVersion: 1, detachedAt: null };
		const followed = workingPaperChanges({ papers: [paper()], existing: [draft], seats });
		expect(followed.update.map((u) => [u.draftId, u.version])).toEqual([['d', 3]]);
		expect(followed.create).toEqual([]);

		const detached = { ...draft, detachedAt: new Date() };
		expect(workingPaperChanges({ papers: [paper()], existing: [detached], seats }).update).toEqual(
			[]
		);
		const current = { ...draft, delegatorVersion: 3 };
		expect(workingPaperChanges({ papers: [paper()], existing: [current], seats }).update).toEqual(
			[]
		);
	});

	it('removes a draft whose paper is gone, unless CHASE changed it', () => {
		const drafts = [
			{ id: 'd1', delegatorPaperId: 'gone', delegatorVersion: 1, detachedAt: null },
			{ id: 'd2', delegatorPaperId: 'kept', delegatorVersion: 1, detachedAt: new Date() }
		];
		expect(workingPaperChanges({ papers: [], existing: drafts, seats }).remove).toEqual(['d1']);
	});
});
