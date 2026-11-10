import { describe, expect, it } from 'vitest';
import { amendmentClauseIndex, presentationAmendmentType } from './presentationAmendment';

describe('presentationAmendmentType', () => {
	it('names and colours the known types', () => {
		expect(presentationAmendmentType('DELETE').badge).toBe('badge-error');
		expect(presentationAmendmentType('ALTER_TEXT').badge).toBe('badge-warning');
		expect(presentationAmendmentType('ADD').badge).toContain('bg-green-700');
		expect(presentationAmendmentType('ALTER_POSITION').label).toBeTruthy();
	});

	it('falls back to the raw type', () => {
		expect(presentationAmendmentType('OTHER')).toEqual({ label: 'OTHER', badge: 'badge-ghost' });
	});
});

describe('amendmentClauseIndex', () => {
	const operative = [{ id: 'a' }, { id: 'b' }];

	it('is -1 without an amendment or a resolution', () => {
		expect(amendmentClauseIndex({ amendment: null, operative })).toBe(-1);
		expect(amendmentClauseIndex({ amendment: { targetClauseId: 'a' }, operative: undefined })).toBe(
			-1
		);
	});

	it('finds the target clause by id', () => {
		expect(
			amendmentClauseIndex({
				amendment: { targetClauseId: 'b', targetOperativeIndex: 0 },
				operative
			})
		).toBe(1);
	});

	it('falls back to the proposed index', () => {
		expect(
			amendmentClauseIndex({
				amendment: { targetClauseId: 'x', targetOperativeIndex: 0 },
				operative
			})
		).toBe(0);
		expect(amendmentClauseIndex({ amendment: { targetOperativeIndex: 1 }, operative })).toBe(1);
		expect(amendmentClauseIndex({ amendment: {}, operative })).toBe(-1);
	});
});
