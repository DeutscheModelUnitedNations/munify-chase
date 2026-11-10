import { describe, expect, it } from 'vitest';
import {
	commentLeaders,
	committeesBySpeakingTime,
	fmtTime,
	hasRows,
	pct,
	regionLabel,
	repLabel,
	speakingMinutesLabel,
	timelineLabels,
	trendChartHeight,
	type CommitteeRow,
	type SpeakingRow
} from './conferenceStats';

describe('labels', () => {
	it('names a representation by its name, its country, or a short id', () => {
		expect(repLabel({ name: 'Peru', alpha2: 'DE', id: 'x' })).toBe('Peru');
		expect(repLabel({ name: null, alpha2: null, id: '0123456789abc' })).toBe('01234567');
		expect(repLabel({ name: null, alpha2: 'de', id: 'x' })).toBeTruthy();
	});

	it('names regional groups, passing unknown ones through', () => {
		expect(regionLabel('ASIA_PACIFIC')).toBe('Asia-Pacific');
		expect(regionLabel('MARS')).toBe('MARS');
	});
});

describe('fmtTime', () => {
	it('formats seconds', () => {
		expect(fmtTime(0)).toBe('0s');
		expect(fmtTime(-3)).toBe('0s');
		expect(fmtTime(187)).toBe('3m 07s');
		expect(fmtTime(3900)).toBe('1h 05m');
	});
});

describe('pct', () => {
	it('rounds a share, or shows a dash without a whole', () => {
		expect(pct({ part: 1, whole: 3 })).toBe('33%');
		expect(pct({ part: 1, whole: 0 })).toBe('—');
	});
});

describe('lists', () => {
	const speaker = (id: string, commentCount: number): SpeakingRow => ({
		representationId: id,
		representationName: id,
		alpha2Code: null,
		totalSeconds: 0,
		speechCount: 0,
		commentCount
	});

	it('knows whether a list has rows', () => {
		expect(hasRows([1])).toBe(true);
		expect(hasRows([])).toBe(false);
		expect(hasRows(null)).toBe(false);
	});

	it('keeps up to twenty delegations that commented', () => {
		const rows = [speaker('a', 0), ...Array.from({ length: 25 }, (_, i) => speaker(`${i}`, 1))];
		expect(commentLeaders(rows)).toHaveLength(20);
		expect(commentLeaders(rows)[0].representationId).toBe('0');
		expect(commentLeaders(undefined)).toEqual([]);
	});

	it('sorts committees by speaking time without touching the input', () => {
		const committee = (id: string, totalSpeakingSeconds: number): CommitteeRow => ({
			committeeId: id,
			committeeName: id,
			committeeAbbreviation: id,
			totalSpeakingSeconds,
			speechCount: 0,
			voteCount: 0
		});
		const rows = [committee('a', 1), committee('b', 5)];
		expect(committeesBySpeakingTime(rows).map((r) => r.committeeId)).toEqual(['b', 'a']);
		expect(rows[0].committeeId).toBe('a');
		expect(committeesBySpeakingTime(null)).toEqual([]);
	});
});

describe('charts', () => {
	it('shows the date only at the first bucket of a day', () => {
		const dates = [
			new Date(2026, 0, 1, 9, 0),
			new Date(2026, 0, 1, 9, 15),
			new Date(2026, 0, 2, 9, 0)
		];
		const time = (d: Date) =>
			d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
		const labels = timelineLabels(dates);
		expect(labels[0]).not.toBe(time(dates[0]));
		expect(labels[0].endsWith(` ${time(dates[0])}`)).toBe(true);
		expect(labels[1]).toBe(time(dates[1]));
		expect(labels[2].endsWith(` ${time(dates[2])}`)).toBe(true);
	});

	it('labels speaking minutes', () => {
		expect(speakingMinutesLabel(5)).toBe(' 5m speaking');
		expect(speakingMinutesLabel(65)).toBe(' 1h 05m speaking');
	});

	it('sizes the trend chart by its days', () => {
		expect(trendChartHeight(1)).toBe(180);
		expect(trendChartHeight(8)).toBe(240);
		expect(trendChartHeight(20)).toBe(280);
	});
});
