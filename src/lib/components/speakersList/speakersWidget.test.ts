import { describe, expect, it } from 'vitest';
import { m } from '#lib/paraglide/messages';
import {
	formatTimeLeft,
	showsQuestioner,
	speakerDisplayName,
	widgetAction,
	widgetButton,
	widgetStateFor,
	type WidgetState
} from './speakersWidget';

describe('widgetStateFor', () => {
	const idle = { speechRunning: false, questionRunning: false };
	const running = { speechRunning: true, questionRunning: true };

	it('maps each phase', () => {
		expect(widgetStateFor({ phase: null, ...idle })).toBe('speech_idle');
		expect(widgetStateFor({ phase: 'SPEECH', ...running })).toBe('speech_running');
		expect(widgetStateFor({ phase: 'SPEECH_DONE', ...idle })).toBe('speech_stopped');
		expect(widgetStateFor({ phase: 'QUESTION', ...idle })).toBe('question_idle');
		expect(widgetStateFor({ phase: 'QUESTION', ...running })).toBe('question_running');
		expect(widgetStateFor({ phase: 'ANSWER', ...idle })).toBe('answer_idle');
		expect(widgetStateFor({ phase: 'ANSWER', ...running })).toBe('answer_running');
		expect(widgetStateFor({ phase: 'ANSWER_DONE', ...idle })).toBe('answer_stopped');
		expect(widgetStateFor({ phase: 'toString', ...idle })).toBe('speech_idle');
	});
});

describe('widgetAction', () => {
	it('asks questions after a speech only when someone wants to', () => {
		expect(widgetAction({ state: 'speech_stopped', commentCount: 1 })).toBe('startQuestion');
		expect(widgetAction({ state: 'speech_stopped', commentCount: 0 })).toBe('nextSpeaker');
	});

	it('moves to the next questioner while there is one', () => {
		expect(widgetAction({ state: 'answer_stopped', commentCount: 2 })).toBe('nextQuestioner');
		expect(widgetAction({ state: 'answer_stopped', commentCount: 1 })).toBe('nextSpeaker');
	});

	it('starts and stops the timers', () => {
		const states: WidgetState[] = [
			'speech_idle',
			'speech_running',
			'question_idle',
			'question_running',
			'answer_idle',
			'answer_running'
		];
		expect(states.map((state) => widgetAction({ state, commentCount: 0 }))).toEqual([
			'startSpeech',
			'stopSpeech',
			'startQuestion',
			'stopQuestion',
			'startAnswer',
			'stopAnswer'
		]);
	});
});

describe('widgetButton', () => {
	it('pauses running timers, steps on after stopped ones, plays otherwise', () => {
		expect(
			widgetButton({ state: 'question_running', hasQuestioner: true, commentCount: 1 })
		).toEqual({ message: m.stopQuestion, icon: 'pause', class: 'btn-error' });
		expect(widgetButton({ state: 'speech_stopped', hasQuestioner: true, commentCount: 1 })).toEqual(
			{ message: m.startQuestion, icon: 'steps', class: 'btn-info' }
		);
		expect(
			widgetButton({ state: 'speech_stopped', hasQuestioner: false, commentCount: 0 }).message
		).toBe(m.nextSpeaker);
		expect(
			widgetButton({ state: 'answer_stopped', hasQuestioner: true, commentCount: 2 }).message
		).toBe(m.nextQuestion);
		expect(widgetButton({ state: 'answer_idle', hasQuestioner: true, commentCount: 1 })).toEqual({
			message: m.startAnswer,
			icon: 'play',
			class: 'btn-success'
		});
	});
});

describe('showsQuestioner', () => {
	it('hides the questioner during the speech', () => {
		expect(showsQuestioner('speech_idle')).toBe(false);
		expect(showsQuestioner('speech_running')).toBe(false);
		expect(showsQuestioner('answer_running')).toBe(true);
	});
});

describe('formatTimeLeft', () => {
	it('formats remaining and overtime seconds', () => {
		expect(formatTimeLeft(null)).toBe('-:--');
		expect(formatTimeLeft(65)).toBe('1:05');
		expect(formatTimeLeft(-5)).toBe('+0:05');
		expect(formatTimeLeft(3661)).toBe('1:01:01');
	});
});

describe('speakerDisplayName', () => {
	it('prefers the overwritten name, then the representation', () => {
		expect(speakerDisplayName(null)).toBe('');
		expect(
			speakerDisplayName({ overwriteName: 'A', committeeMember: { representation: { name: 'B' } } })
		).toBe('A');
		expect(speakerDisplayName({ conferenceMember: { representation: { name: 'C' } } })).toBe('C');
		expect(
			speakerDisplayName({ committeeMember: { representation: { alpha3Code: 'DEU' } } })
		).toBeTruthy();
	});
});
