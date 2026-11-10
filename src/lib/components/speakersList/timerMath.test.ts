import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import { countdownSeconds, formatDuration, secondsLeft, timerStatus } from './timerMath';

const now = dayjs('2026-01-01T10:00:00Z');

describe('secondsLeft', () => {
	it('counts down a running timer', () => {
		const startTimestamp = new Date('2026-01-01T09:59:30Z');
		expect(secondsLeft({ startTimestamp, timeLeft: 60, now })).toBe(30);
		expect(secondsLeft({ startTimestamp, timeLeft: 10, now })).toBe(-20);
	});

	it('shows a stopped timer as it is, and nothing without time', () => {
		expect(secondsLeft({ startTimestamp: null, timeLeft: 45, now })).toBe(45);
		expect(secondsLeft({ startTimestamp: new Date(), timeLeft: null, now })).toBeUndefined();
	});
});

describe('countdownSeconds', () => {
	const base = {
		noSpeaker: false,
		startTimestamp: new Date(),
		timeLeft: 30,
		speakingTime: 90,
		calculatedTimeLeft: -12
	};

	it('shows the speaking time without a speaker', () => {
		expect(countdownSeconds({ ...base, noSpeaker: true })).toBe(90);
		expect(countdownSeconds({ ...base, noSpeaker: true, speakingTime: null })).toBe(0);
	});

	it('shows the stopped time, or the speaking time when none is left', () => {
		expect(countdownSeconds({ ...base, startTimestamp: null, timeLeft: -30 })).toBe(30);
		expect(countdownSeconds({ ...base, startTimestamp: null, timeLeft: 0 })).toBe(90);
		expect(
			countdownSeconds({ ...base, calculatedTimeLeft: undefined, speakingTime: null, timeLeft: 0 })
		).toBe(0);
	});

	it('shows the running time without its sign', () => {
		expect(countdownSeconds(base)).toBe(12);
	});
});

describe('timerStatus', () => {
	it('is paused without a start, else active or overtime', () => {
		expect(timerStatus({ startTimestamp: null, calculatedTimeLeft: -5 })).toBe('paused');
		expect(timerStatus({ startTimestamp: new Date(), calculatedTimeLeft: 5 })).toBe('active');
		expect(timerStatus({ startTimestamp: new Date(), calculatedTimeLeft: undefined })).toBe(
			'active'
		);
		expect(timerStatus({ startTimestamp: new Date(), calculatedTimeLeft: -1 })).toBe('overtime');
	});
});

describe('formatDuration', () => {
	it('adds hours only when there are some', () => {
		expect(formatDuration(dayjs.duration(65, 'seconds'))).toBe('1:05');
		expect(formatDuration(dayjs.duration(3665, 'seconds'))).toBe('1:01:05');
	});
});
