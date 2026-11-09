import { describe, expect, it } from 'vitest';
import { committeeMemberId } from './mirror';
import {
	readableResolution,
	workingPaperChanges,
	type DelegatorWorkingPaper
} from './workingPapers';

const seat = committeeMemberId({ roleId: 'deu', committeeId: 'ga' });
const seats = new Set([seat]);

const paper = (overrides: Partial<DelegatorWorkingPaper> = {}): DelegatorWorkingPaper => ({
	id: 'paper',
	agendaItem: { id: 'climate', committeeId: 'ga' },
	delegation: { assignedRoleId: 'deu' },
	versions: [
		{ id: 'v1', version: 1 },
		{ id: 'v3', version: 3 }
	],
	...overrides
});

describe('workingPaperChanges', () => {
	it("takes a paper over with its latest accepted version, by its delegation's seat", () => {
		const { takeOver } = workingPaperChanges({ papers: [paper()], existing: [], seats });
		expect(takeOver).toEqual([
			{
				delegatorPaperId: 'paper',
				versionId: 'v3',
				version: 3,
				committeeId: 'ga',
				agendaItemId: 'climate',
				creatorCommitteeMemberId: seat
			}
		]);
	});

	it('leaves a paper behind without an agenda item, a seat or a version', () => {
		const papers = [
			paper({ id: 'a', agendaItem: null }),
			paper({ id: 'b', delegation: { assignedRoleId: 'fra' } }),
			paper({ id: 'c', versions: [] })
		];
		expect(workingPaperChanges({ papers, existing: [], seats }).leftBehind).toEqual([
			{ paperId: 'a', reason: 'noAgendaItem' },
			{ paperId: 'b', reason: 'noSeat' },
			{ paperId: 'c', reason: 'noVersion' }
		]);
	});

	it('follows a newer version until CHASE changed the draft, and leaves a current one alone', () => {
		const draft = { id: 'd', delegatorPaperId: 'paper', delegatorVersion: 1, detachedAt: null };
		const followed = workingPaperChanges({ papers: [paper()], existing: [draft], seats });
		expect(followed.takeOver.map((u) => [u.draftId, u.versionId])).toEqual([['d', 'v3']]);

		const detached = { ...draft, detachedAt: new Date() };
		expect(
			workingPaperChanges({ papers: [paper()], existing: [detached], seats }).takeOver
		).toEqual([]);
		const current = { ...draft, delegatorVersion: 3 };
		expect(workingPaperChanges({ papers: [paper()], existing: [current], seats })).toEqual({
			takeOver: [],
			remove: [],
			leftBehind: []
		});
	});

	it('removes a draft whose paper is gone, unless CHASE changed it', () => {
		const drafts = [
			{ id: 'd1', delegatorPaperId: 'gone', delegatorVersion: 1, detachedAt: null },
			{ id: 'd2', delegatorPaperId: 'kept', delegatorVersion: 1, detachedAt: new Date() }
		];
		expect(workingPaperChanges({ papers: [], existing: drafts, seats }).remove).toEqual(['d1']);
	});
});

describe('readableResolution', () => {
	it('takes a resolution and refuses anything else', () => {
		const content = { committeeName: 'GA', preamble: [], operative: [] };
		expect(readableResolution(content)).toEqual(content);
		expect(readableResolution({ text: 'tiptap' })).toBeUndefined();
	});
});
