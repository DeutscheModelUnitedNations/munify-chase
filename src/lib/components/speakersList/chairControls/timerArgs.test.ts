import { describe, expect, it } from 'vitest';
import { hasEmptyResult, otherListTimeLeft, phaseFor } from './timerArgs';

describe('phaseFor', () => {
	it('sets the phase only for the matching list', () => {
		expect(phaseFor({ type: 'SPEAKERS_LIST', when: 'SPEAKERS_LIST', phase: 'SPEECH' })).toEqual({
			phase: 'SPEECH'
		});
		expect(phaseFor({ type: 'COMMENT_LIST', when: 'SPEAKERS_LIST', phase: 'SPEECH' })).toEqual({});
	});
});

describe('otherListTimeLeft', () => {
	it('resets the speakers list to this speaking time, a comment list to its own', () => {
		expect(
			otherListTimeLeft({
				otherList: { type: 'SPEAKERS_LIST', speakingTime: 90 },
				speakingTime: 30
			})
		).toBe(30);
		expect(
			otherListTimeLeft({ otherList: { type: 'COMMENT_LIST', speakingTime: 45 }, speakingTime: 30 })
		).toBe(45);
	});
});

describe('hasEmptyResult', () => {
	it('spots a fulfilled mutation without a result', () => {
		expect(hasEmptyResult([{ status: 'fulfilled', value: { id: 'x' } }])).toBe(false);
		expect(hasEmptyResult([{ status: 'fulfilled', value: null }])).toBe(true);
		expect(hasEmptyResult([{ status: 'rejected', reason: new Error() }])).toBe(false);
	});
});
