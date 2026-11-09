import { describe, expect, test } from 'vitest';
import { reviewItemChanges } from './amendmentReviewRules';

const obsolescence = { phase: 'OBSOLESCENCE' as const, subjectNewContent: 'old' };
const rewrite = { phase: 'REWRITE' as const, subjectNewContent: 'old' };

describe('reviewItemChanges', () => {
	test('writes the AI’s assessment in any phase, null clearing it', () => {
		const { update } = reviewItemChanges({
			item: { phase: 'RESOLVED', subjectNewContent: null },
			args: {
				aiObsolete: true,
				aiObsoleteReason: null,
				aiRewriteSuggestion: 'new',
				aiRewriteReason: 'why'
			}
		});
		expect(update).toEqual({
			aiObsolete: true,
			aiObsoleteReason: null,
			aiRewriteSuggestion: 'new',
			aiRewriteReason: 'why'
		});
	});

	test('leaves out what is not given', () => {
		expect(reviewItemChanges({ item: obsolescence, args: {} })).toEqual({
			update: {},
			withdrawSubject: false,
			rewriteTo: null
		});
	});

	test('refuses to move a resolved item', () => {
		expect(() =>
			reviewItemChanges({
				item: { phase: 'RESOLVED', subjectNewContent: null },
				args: { phase: 'REWRITE' }
			})
		).toThrow('already resolved');
	});

	test('advances to REWRITE only from OBSOLESCENCE, as not obsolete', () => {
		expect(reviewItemChanges({ item: obsolescence, args: { phase: 'REWRITE' } }).update).toEqual({
			phase: 'REWRITE',
			verdictObsolete: false
		});
		expect(() => reviewItemChanges({ item: rewrite, args: { phase: 'REWRITE' } })).toThrow(
			'Can only advance to REWRITE'
		);
	});

	test('keeps a plain phase change', () => {
		expect(
			reviewItemChanges({ item: obsolescence, args: { phase: 'OBSOLESCENCE' } }).update
		).toEqual({ phase: 'OBSOLESCENCE' });
	});

	test('resolving from OBSOLESCENCE needs the verdict and withdraws an obsolete subject', () => {
		expect(() => reviewItemChanges({ item: obsolescence, args: { phase: 'RESOLVED' } })).toThrow(
			'verdictObsolete is required'
		);
		expect(
			reviewItemChanges({ item: obsolescence, args: { phase: 'RESOLVED', verdictObsolete: true } })
		).toEqual({
			update: { phase: 'RESOLVED', verdictObsolete: true },
			withdrawSubject: true,
			rewriteTo: null
		});
		expect(
			reviewItemChanges({ item: obsolescence, args: { phase: 'RESOLVED', verdictObsolete: false } })
				.withdrawSubject
		).toBe(false);
	});

	test('resolving from REWRITE records the verdict and rewrites only a changed text', () => {
		expect(
			reviewItemChanges({ item: rewrite, args: { phase: 'RESOLVED', verdictRewrite: 'new' } })
		).toEqual({
			update: { phase: 'RESOLVED', verdictRewrite: 'new' },
			withdrawSubject: false,
			rewriteTo: 'new'
		});
		expect(
			reviewItemChanges({ item: rewrite, args: { phase: 'RESOLVED', verdictRewrite: 'old' } })
				.rewriteTo
		).toBeNull();
		expect(reviewItemChanges({ item: rewrite, args: { phase: 'RESOLVED' } })).toEqual({
			update: { phase: 'RESOLVED', verdictRewrite: null },
			withdrawSubject: false,
			rewriteTo: null
		});
	});
});
