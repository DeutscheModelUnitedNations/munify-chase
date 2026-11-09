import { describe, expect, it } from 'vitest';
import { derivePhase, remainingSeconds, timerStart } from './speakersListTimer';

describe('remainingSeconds', () => {
	it('subtracts the elapsed time, rounded', () => {
		const startedAt = new Date(10_000);
		expect(remainingSeconds({ timeLeft: 60, startedAt, now: new Date(25_400) })).toBe(45);
		expect(remainingSeconds({ timeLeft: 5, startedAt, now: new Date(20_000) })).toBe(-5);
	});
});

describe('derivePhase', () => {
	const base = { explicit: undefined, stopTimer: false, timeLeftGiven: false, starting: false };

	it('lets an explicit phase win', () => {
		expect(derivePhase({ ...base, explicit: 'QUESTION', current: 'SPEECH', stopTimer: true })).toBe(
			'QUESTION'
		);
	});
	it('derives nothing without a current phase', () => {
		expect(derivePhase({ ...base, current: undefined, stopTimer: true })).toBeUndefined();
	});
	it('starts a fresh speech when stopping with a new time left', () => {
		expect(derivePhase({ ...base, current: 'ANSWER', stopTimer: true, timeLeftGiven: true })).toBe(
			'SPEECH'
		);
	});
	it('ends speeches and answers when stopping', () => {
		expect(derivePhase({ ...base, current: 'SPEECH', stopTimer: true })).toBe('SPEECH_DONE');
		expect(derivePhase({ ...base, current: 'ANSWER', stopTimer: true })).toBe('ANSWER_DONE');
		expect(derivePhase({ ...base, current: 'QUESTION', stopTimer: true })).toBeUndefined();
	});
	it('resumes when starting', () => {
		expect(derivePhase({ ...base, current: 'SPEECH_DONE', starting: true })).toBe('SPEECH');
		expect(derivePhase({ ...base, current: 'ANSWER_DONE', starting: true })).toBe('ANSWER');
		expect(derivePhase({ ...base, current: 'SPEECH', starting: true })).toBeUndefined();
	});
	it('leaves the phase otherwise', () => {
		expect(derivePhase({ ...base, current: 'SPEECH' })).toBeUndefined();
	});
});

describe('timerStart', () => {
	const now = new Date(1);
	it('clears on stop, stamps on start, leaves it otherwise', () => {
		expect(timerStart({ stopTimer: true, starting: true, now })).toBeNull();
		expect(timerStart({ stopTimer: false, starting: true, now })).toBe(now);
		expect(timerStart({ stopTimer: false, starting: false, now })).toBeUndefined();
	});
});
