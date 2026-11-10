import { describe, expect, it } from 'vitest';
import { advanceAction, resumeVoteOptions, stepBubble, stepKind } from './chairLifecycle';

describe('advanceAction', () => {
	it('maps the next stage to what advancing takes', () => {
		expect(advanceAction(undefined)).toBe('none');
		expect(advanceAction('AMENDMENT_PHASE')).toBe('askAmendmentSettings');
		expect(advanceAction('VOTING_PHASE')).toBe('startVoting');
		expect(advanceAction('FINAL')).toBe('confirmFinal');
		expect(advanceAction('SUBMITTED')).toBe('advance');
	});
});

describe('stepKind / stepBubble', () => {
	it('classifies steps around the current one', () => {
		expect([0, 1, 2, 3].map((index) => stepKind({ index, currentIdx: 1 }))).toEqual([
			'past',
			'current',
			'next',
			'future'
		]);
	});

	it('shows the play icon on the next step and on hovered earlier ones', () => {
		expect(stepBubble({ kind: 'next', index: 2, hovered: false })).toBe('▶');
		expect(stepBubble({ kind: 'past', index: 0, hovered: true })).toBe('▶');
		expect(stepBubble({ kind: 'past', index: 0, hovered: false })).toBe('1');
		expect(stepBubble({ kind: 'future', index: 3, hovered: true })).toBe('4');
	});
});

describe('resumeVoteOptions', () => {
	it('takes over the running session', () => {
		expect(
			resumeVoteOptions({
				session: {
					mode: 'SHOW_OF_HANDS',
					voteName: 'Clause 1',
					majority: 'SIMPLE',
					withAbstentions: false
				},
				fallbackName: 'Paper'
			})
		).toEqual({
			voteType: 'SHOW_OF_HANDS',
			voteName: 'Clause 1',
			majority: 'SIMPLE',
			withAbstentions: false
		});
	});

	it('falls back to the paper title, an absolute majority and abstentions', () => {
		expect(resumeVoteOptions({ session: { mode: 'ROLL_CALL' }, fallbackName: 'Paper' })).toEqual({
			voteType: 'ROLL_CALL',
			voteName: 'Paper',
			majority: 'ABSOLUTE',
			withAbstentions: true
		});
	});
});
