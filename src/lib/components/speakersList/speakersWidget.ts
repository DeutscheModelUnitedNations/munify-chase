import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { m } from '#lib/paraglide/messages';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

dayjs.extend(duration);

export type WidgetState =
	| 'speech_idle'
	| 'speech_running'
	| 'speech_stopped'
	| 'question_idle'
	| 'question_running'
	| 'answer_idle'
	| 'answer_running'
	| 'answer_stopped';

/** Where the speech/question/answer cycle of the speakers list stands */
export function widgetStateFor({
	phase,
	speechRunning,
	questionRunning
}: {
	phase: string | null | undefined;
	speechRunning: boolean;
	questionRunning: boolean;
}): WidgetState {
	const states: Record<string, WidgetState> = {
		SPEECH_DONE: 'speech_stopped',
		ANSWER_DONE: 'answer_stopped',
		SPEECH: speechRunning ? 'speech_running' : 'speech_idle',
		QUESTION: questionRunning ? 'question_running' : 'question_idle',
		ANSWER: speechRunning ? 'answer_running' : 'answer_idle'
	};
	const key = phase ?? 'SPEECH';
	return Object.hasOwn(states, key) ? states[key] : 'speech_idle';
}

/** What the widget's button does next */
export type WidgetAction =
	| 'startSpeech'
	| 'stopSpeech'
	| 'startQuestion'
	| 'stopQuestion'
	| 'startAnswer'
	| 'stopAnswer'
	| 'nextQuestioner'
	| 'nextSpeaker';

export function widgetAction({
	state,
	commentCount
}: {
	state: WidgetState;
	/** Speakers on the comment list, the current questioner included */
	commentCount: number;
}): WidgetAction {
	const actions: Record<WidgetState, WidgetAction> = {
		speech_idle: 'startSpeech',
		speech_running: 'stopSpeech',
		speech_stopped: commentCount > 0 ? 'startQuestion' : 'nextSpeaker',
		question_idle: 'startQuestion',
		question_running: 'stopQuestion',
		answer_idle: 'startAnswer',
		answer_running: 'stopAnswer',
		answer_stopped: commentCount > 1 ? 'nextQuestioner' : 'nextSpeaker'
	};
	return actions[state];
}

const RUNNING: WidgetState[] = ['speech_running', 'question_running', 'answer_running'];
const STOPPED: WidgetState[] = ['speech_stopped', 'answer_stopped'];

/** The button's label (as the message, so the command palette searches it in English too), icon and colour */
export function widgetButton({
	state,
	hasQuestioner,
	commentCount
}: {
	state: WidgetState;
	hasQuestioner: boolean;
	commentCount: number;
}) {
	const messages: Record<WidgetState, () => string> = {
		speech_idle: m.startSpeech,
		speech_running: m.stopSpeech,
		speech_stopped: hasQuestioner ? m.startQuestion : m.nextSpeaker,
		question_idle: m.startQuestion,
		question_running: m.stopQuestion,
		answer_idle: m.startAnswer,
		answer_running: m.stopAnswer,
		answer_stopped: commentCount > 1 ? m.nextQuestion : m.nextSpeaker
	};
	if (RUNNING.includes(state))
		return { message: messages[state], icon: 'pause', class: 'btn-error' };
	if (STOPPED.includes(state))
		return { message: messages[state], icon: 'steps', class: 'btn-info' };
	return { message: messages[state], icon: 'play', class: 'btn-success' };
}

/** Whether the questioner shows: from the end of the speech until the next speaker */
export function showsQuestioner(state: WidgetState) {
	return state !== 'speech_idle' && state !== 'speech_running';
}

/** Seconds left as `m:ss` (or `H:mm:ss`), overtime with a leading `+` */
export function formatTimeLeft(timeLeft: number | null): string {
	if (timeLeft === null) return '-:--';
	const d = dayjs.duration(Math.abs(timeLeft), 'seconds');
	const prefix = timeLeft < 0 ? '+' : '';
	return `${prefix}${d.hours() ? d.format('H:mm:ss') : d.format('m:ss')}`;
}

type Representation = { name?: string | null; alpha3Code?: string | null } | null | undefined;

/** The name a speaker shows under: overwritten, the representation's, or the country's */
export function speakerDisplayName(
	speaker:
		| {
				overwriteName?: string | null;
				committeeMember?: { representation?: Representation } | null;
				conferenceMember?: { representation?: Representation } | null;
		  }
		| null
		| undefined
): string {
	if (!speaker) return '';
	const rep = speaker.committeeMember?.representation ?? speaker.conferenceMember?.representation;
	return (
		speaker.overwriteName ||
		rep?.name ||
		getTranslatedCountryNameFromAlpha3Code(rep?.alpha3Code) ||
		''
	);
}
