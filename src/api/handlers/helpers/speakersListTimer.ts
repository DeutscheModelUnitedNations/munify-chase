export type SpeakersListPhase = 'SPEECH' | 'SPEECH_DONE' | 'QUESTION' | 'ANSWER' | 'ANSWER_DONE';

/** Seconds left on a running timer at `now`, by the server clock. */
export function remainingSeconds({
	timeLeft,
	startedAt,
	now
}: {
	timeLeft: number;
	startedAt: Date;
	now: Date;
}) {
	return Math.round(timeLeft - (now.getTime() - startedAt.getTime()) / 1000);
}

const AFTER_STOP: Partial<Record<SpeakersListPhase, SpeakersListPhase>> = {
	SPEECH: 'SPEECH_DONE',
	ANSWER: 'ANSWER_DONE'
};
const AFTER_START: Partial<Record<SpeakersListPhase, SpeakersListPhase>> = {
	SPEECH_DONE: 'SPEECH',
	ANSWER_DONE: 'ANSWER'
};

/**
 * The phase a timer change leads to. An explicit phase from the client always wins (the widget's
 * direct transitions); otherwise stopping ends a speech or answer, starting resumes one, and
 * stopping with a fresh time left (next speaker, reset) starts a new speech.
 */
export function derivePhase({
	explicit,
	current,
	stopTimer,
	timeLeftGiven,
	starting
}: {
	explicit: SpeakersListPhase | undefined;
	current: SpeakersListPhase | undefined;
	stopTimer: boolean;
	timeLeftGiven: boolean;
	starting: boolean;
}): SpeakersListPhase | undefined {
	if (explicit !== undefined || current === undefined) return explicit;
	if (stopTimer) return timeLeftGiven ? 'SPEECH' : AFTER_STOP[current];
	if (starting) return AFTER_START[current];
	return undefined;
}

/** The start timestamp to store: cleared when stopping, the server's time when starting. */
export function timerStart({
	stopTimer,
	starting,
	now
}: {
	stopTimer: boolean;
	starting: boolean;
	now: Date;
}) {
	if (stopTimer) return null;
	return starting ? now : undefined;
}
