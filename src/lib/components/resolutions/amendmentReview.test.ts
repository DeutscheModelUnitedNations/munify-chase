import { describe, expect, it } from 'vitest';
import { serializeClause } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
import {
	editedContent,
	newAiTasks,
	obsoleteBadge,
	parseOldMarkup,
	reviewTypeLabel,
	rewriteDraft,
	subjectInput,
	triggerInput,
	type ReviewAmendment,
	type ReviewItem
} from './amendmentReview';

const amendment = (overrides: Partial<ReviewAmendment> = {}): ReviewAmendment => ({
	id: 'a',
	documentNumber: 'A/1',
	type: 'ALTER_TEXT',
	newContent: 'new',
	oldContent: 'old',
	targetOperativeIndex: 2,
	proposer: null,
	sponsors: null,
	...overrides
});

const item = (overrides: Partial<ReviewItem> = {}): ReviewItem => ({
	id: 'i',
	phase: 'OBSOLESCENCE',
	aiObsolete: null,
	aiRewriteSuggestion: null,
	triggerAmendment: amendment({ id: 't', oldContent: 'trigger-old' }),
	subjectAmendment: { ...amendment({ id: 's', newContent: 'subject-new' }), status: 'SUBMITTED' },
	...overrides
});

describe('parseOldMarkup', () => {
	it('serializes a stored clause', () => {
		const clause = { id: 'c', blocks: [{ type: 'text' as const, id: 'b', content: 'Urges' }] };
		expect(parseOldMarkup(JSON.stringify(clause))).toBe(serializeClause(clause));
	});

	it('is undefined for nothing or unreadable JSON', () => {
		expect(parseOldMarkup(null)).toBeUndefined();
		expect(parseOldMarkup('{nope')).toBeUndefined();
	});
});

describe('reviewTypeLabel', () => {
	it('labels the types and passes others through', () => {
		expect(reviewTypeLabel('ALTER_TEXT')).toBe('Alter text');
		expect(reviewTypeLabel('DELETE')).toBe('Delete');
		expect(reviewTypeLabel('ADD')).toBe('Add');
		expect(reviewTypeLabel('ALTER_POSITION')).toBe('Move');
		expect(reviewTypeLabel('OTHER')).toBe('OTHER');
		expect(reviewTypeLabel(undefined)).toBe('');
	});
});

describe('obsoleteBadge', () => {
	it('shows the verdict once there is one', () => {
		expect(obsoleteBadge(null)).toBeNull();
		expect(obsoleteBadge(true)).toEqual({ label: 'Possibly obsolete', cls: 'badge-warning' });
		expect(obsoleteBadge(false)).toEqual({ label: 'No issue', cls: 'badge-success' });
	});
});

describe('triggerInput and subjectInput', () => {
	it('tells the AI about the trigger with the shared baseline', () => {
		const i = item();
		expect(triggerInput({ trigger: amendment(), item: i })).toEqual({
			id: 'a',
			documentNumber: 'A/1',
			newContent: 'new',
			targetOperativeIndex: 2,
			oldContent: 'trigger-old'
		});
	});

	it('includes the subject old text only when asked', () => {
		expect(subjectInput({ item: item(), withOldContent: true })).toEqual({
			id: 'i',
			documentNumber: 'A/1',
			newContent: 'subject-new',
			oldContent: 'old',
			targetOperativeIndex: 2
		});
		expect(subjectInput({ item: item(), withOldContent: false })).not.toHaveProperty('oldContent');
		expect(subjectInput({ item: item({ subjectAmendment: null }), withOldContent: false })).toEqual(
			{
				id: 'i',
				documentNumber: undefined,
				newContent: undefined,
				targetOperativeIndex: undefined
			}
		);
	});
});

describe('newAiTasks', () => {
	it('queues items without a verdict or suggestion that were not started', () => {
		const tasks = newAiTasks({
			obsolescenceItems: [
				item({ id: 'o1' }),
				item({ id: 'o2' }),
				item({ id: 'o3', aiObsolete: true })
			],
			rewriteItems: [
				item({ id: 'r1' }),
				item({ id: 'r2', aiRewriteSuggestion: 'done' }),
				item({ id: 'r3', aiRewriteSuggestion: undefined })
			],
			startedObsolescence: new Set(['o2']),
			startedRewrite: new Set()
		});
		expect(tasks.map((t) => [t.type, t.item.id])).toEqual([
			['obsolescence', 'o1'],
			['rewrite', 'r1']
		]);
	});
});

describe('editedContent', () => {
	it('uses the edit, else the proposed text', () => {
		expect(editedContent({ edit: 'mine', item: item() })).toBe('mine');
		expect(editedContent({ edit: undefined, item: item() })).toBe('subject-new');
		expect(editedContent({ edit: undefined, item: item({ subjectAmendment: null }) })).toBe('');
	});
});

describe('rewriteDraft', () => {
	it('starts from the suggestion, else the original', () => {
		expect(rewriteDraft({ aiSuggestion: 'ai', original: 'o', edit: undefined })).toEqual({
			initial: 'ai',
			current: 'ai',
			unchanged: true
		});
		expect(rewriteDraft({ aiSuggestion: '', original: 'o', edit: 'x' })).toEqual({
			initial: 'o',
			current: 'x',
			unchanged: false
		});
	});
});
