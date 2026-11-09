import { describe, expect, it } from 'vitest';
import { groupDisplayMs, nextGroup, resolutionPreviewState } from './presentation';

describe('regional groups', () => {
	it('cycles through the groups', () => {
		expect(nextGroup('AFRICA')).toBe('ASIA_PACIFIC');
		expect(nextGroup('LATIN_AMERICA_CARIBBEAN')).toBe('WESTERN_EUROPE_OTHERS');
		expect(nextGroup('WESTERN_EUROPE_OTHERS')).toBe('AFRICA');
	});

	it('shows a group for five to nine seconds', () => {
		expect(groupDisplayMs(2)).toBe(5000);
		expect(groupDisplayMs(30)).toBe(7500);
		expect(groupDisplayMs(100)).toBe(9000);
	});
});

describe('resolutionPreviewState', () => {
	const amendment = { id: 'a' };

	it('shows amendments and the clause while amending', () => {
		expect(
			resolutionPreviewState({
				activeDraftResolution: { status: 'AMENDMENT_PHASE' },
				currentOperativeIndex: 2,
				activeAmendment: amendment
			})
		).toEqual({ currentOperativeIndex: 2, showAmendments: true, activeAmendment: amendment });
		expect(
			resolutionPreviewState({ activeDraftResolution: { status: 'AMENDMENT_PHASE' } }).activeAmendment
		).toBeNull();
	});

	it('keeps the clause while voting and nothing otherwise', () => {
		expect(
			resolutionPreviewState({
				activeDraftResolution: { status: 'VOTING_PHASE' },
				currentOperativeIndex: 1,
				activeAmendment: amendment
			})
		).toEqual({ currentOperativeIndex: 1, showAmendments: false, activeAmendment: null });
		expect(resolutionPreviewState({ currentOperativeIndex: 1 })).toEqual({
			currentOperativeIndex: undefined,
			showAmendments: false,
			activeAmendment: null
		});
	});
});
