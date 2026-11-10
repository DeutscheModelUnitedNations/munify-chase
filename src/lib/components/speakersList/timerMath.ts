import dayjs from 'dayjs';
import duration, { type Duration } from 'dayjs/plugin/duration';

dayjs.extend(duration);

/** Seconds left on a running timer (negative in overtime), what it stopped at, or nothing */
export function secondsLeft({
	startTimestamp,
	timeLeft,
	now
}: {
	startTimestamp: Date | null | undefined;
	timeLeft: number | null | undefined;
	now: dayjs.Dayjs;
}): number | undefined {
	if (timeLeft === null || timeLeft === undefined) return undefined;
	if (!startTimestamp) return timeLeft;
	return Math.round(dayjs(startTimestamp).diff(now) / 1000) + timeLeft;
}

/** What the timer shows: the full speaking time without a speaker, else the time left */
export function countdownSeconds({
	noSpeaker,
	startTimestamp,
	timeLeft,
	speakingTime,
	calculatedTimeLeft
}: {
	noSpeaker: boolean;
	startTimestamp: Date | null | undefined;
	timeLeft: number | null | undefined;
	speakingTime: number | null | undefined;
	calculatedTimeLeft: number | undefined;
}): number {
	if (noSpeaker) return speakingTime ?? 0;
	if (!startTimestamp || calculatedTimeLeft === undefined) {
		return timeLeft ? Math.abs(timeLeft) : (speakingTime ?? 0);
	}
	return Math.abs(calculatedTimeLeft);
}

export type TimerStatus = 'overtime' | 'active' | 'paused';

export function timerStatus({
	startTimestamp,
	calculatedTimeLeft
}: {
	startTimestamp: Date | null | undefined;
	calculatedTimeLeft: number | undefined;
}): TimerStatus {
	if (!startTimestamp) return 'paused';
	return (calculatedTimeLeft ?? 0) < 0 ? 'overtime' : 'active';
}

/** `m:ss`, or `H:mm:ss` once there are hours */
export function formatDuration(delta: Duration): string {
	return delta.hours() !== 0 ? delta.format('H:mm:ss') : delta.format('m:ss');
}
