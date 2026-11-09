import { describe, expect, it, vi } from 'vitest';

vi.mock(
	'@deutschemodelunitednations/munify-resolution-editor/res-markup',
	async (importOriginal) => {
		const actual =
			await importOriginal<
				typeof import('@deutschemodelunitednations/munify-resolution-editor/res-markup')
			>();
		return {
			...actual,
			parseClauseFragment: (content: string) =>
				content === 'INVALID'
					? { valid: false, errors: [{ code: 'E1' }, { code: 'E2' }] }
					: actual.parseClauseFragment(content)
		};
	}
);
import { m } from '#lib/paraglide/messages';
import {
	amendmentNeeds,
	canSubmitDraft,
	createAmendmentArgs,
	draftProblem,
	isQueuedOffline,
	markupError,
	positionSummary,
	type AmendmentDraft
} from './amendmentDraft';

const draft = (overrides: Partial<AmendmentDraft> = {}): AmendmentDraft => ({
	type: 'ALTER_TEXT',
	team: false,
	proposerId: null,
	targetClauseId: 'c1',
	targetClauseIndex: 0,
	newContent: 'new',
	contentError: null,
	targetPosition: null,
	oldMarkup: 'old',
	...overrides
});

describe('amendmentNeeds', () => {
	it('asks each type for what it changes', () => {
		expect(amendmentNeeds('ADD')).toEqual({ content: true, position: true, targetClause: false });
		expect(amendmentNeeds('ALTER_TEXT')).toEqual({
			content: true,
			position: false,
			targetClause: true
		});
		expect(amendmentNeeds('DELETE')).toEqual({
			content: false,
			position: false,
			targetClause: true
		});
		expect(amendmentNeeds('ALTER_POSITION')).toEqual({
			content: false,
			position: true,
			targetClause: true
		});
	});
});

describe('markupError', () => {
	it('is null for empty text', () => {
		expect(markupError('   ')).toBeNull();
	});

	it('reports error codes of invalid markup and nothing for valid markup', () => {
		expect(markupError('INVALID')).toBe('E1, E2');
		expect(markupError('Requests the secretariat to act;')).toBeNull();
	});
});

describe('draftProblem', () => {
	it('asks the team for a proposer first', () => {
		expect(draftProblem(draft({ team: true }))).toBe(m.selectProposerDelegation());
		expect(draftProblem(draft({ team: true, proposerId: 'p' }))).toBeNull();
	});

	it('asks for a target clause where the type has one', () => {
		expect(draftProblem(draft({ targetClauseId: null }))).toBe(m.selectClauseFirst());
		expect(draftProblem(draft({ type: 'ADD', targetClauseId: null }))).toBeNull();
	});

	it('refuses empty or invalid content', () => {
		expect(draftProblem(draft({ newContent: ' ' }))).toBe(m.amendmentContentInvalid());
		expect(draftProblem(draft({ contentError: 'E1' }))).toBe(m.amendmentContentInvalid());
		expect(draftProblem(draft({ type: 'DELETE', newContent: '' }))).toBeNull();
	});
});

describe('canSubmitDraft', () => {
	it('needs a position for ADD and ALTER_POSITION', () => {
		expect(canSubmitDraft(draft({ type: 'ADD', targetPosition: null }))).toBe(false);
		expect(canSubmitDraft(draft({ type: 'ADD', targetPosition: -1 }))).toBe(true);
	});

	it('needs an ALTER_TEXT to change the text', () => {
		expect(canSubmitDraft(draft({ newContent: 'old' }))).toBe(false);
		expect(canSubmitDraft(draft())).toBe(true);
	});

	it('is false while a problem remains', () => {
		expect(canSubmitDraft(draft({ targetClauseId: null }))).toBe(false);
	});
});

describe('createAmendmentArgs', () => {
	it('leaves out what the type does not use', () => {
		expect(
			createAmendmentArgs({ id: 'a', paperId: 'p', draft: draft({ type: 'DELETE' }) })
		).toEqual({
			id: 'a',
			paperId: 'p',
			type: 'DELETE',
			targetClauseId: 'c1',
			targetOperativeIndex: 0,
			newContent: undefined,
			targetPosition: undefined,
			proposerCommitteeMemberId: undefined
		});
	});

	it('sends the position, defaulting to the beginning, and the team proposer', () => {
		const args = createAmendmentArgs({
			id: 'a',
			paperId: 'p',
			draft: draft({ type: 'ADD', team: true, proposerId: 'm1', targetClauseIndex: -1 })
		});
		expect(args.targetClauseId).toBeUndefined();
		expect(args.targetOperativeIndex).toBeUndefined();
		expect(args.targetPosition).toBe(-1);
		expect(args.newContent).toBe('new');
		expect(args.proposerCommitteeMemberId).toBe('m1');
	});

	it('leaves out an unknown clause index', () => {
		const args = createAmendmentArgs({
			id: 'a',
			paperId: 'p',
			draft: draft({ targetClauseIndex: -1, targetClauseId: null })
		});
		expect(args.targetOperativeIndex).toBeUndefined();
		expect(args.targetClauseId).toBeUndefined();
	});
});

describe('isQueuedOffline', () => {
	it('recognises errors carrying a network error', () => {
		expect(isQueuedOffline({ networkError: new Error('offline') })).toBe(true);
		expect(isQueuedOffline({ networkError: undefined })).toBe(false);
		expect(isQueuedOffline(new Error('graphql'))).toBe(false);
		expect(isQueuedOffline(null)).toBe(false);
		expect(isQueuedOffline('text')).toBe(false);
	});
});

describe('positionSummary', () => {
	it('describes the beginning', () => {
		expect(positionSummary({ position: -1, preview: null })).toEqual({
			marker: '↑',
			text: m.insertAtBeginning()
		});
	});

	it('names the clause it follows', () => {
		expect(positionSummary({ position: 1, preview: 'Urges' })).toEqual({
			marker: '2.',
			text: `${m.insertAfterPresentation({ index: '2' })} — Urges`
		});
	});

	it('falls back to the beginning for a clause that is gone', () => {
		expect(positionSummary({ position: 4, preview: null })).toEqual({
			marker: '5.',
			text: m.insertAtBeginning()
		});
	});
});
