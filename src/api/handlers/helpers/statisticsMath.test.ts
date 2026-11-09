import { describe, expect, test } from 'vitest';
import {
	acceptedAmendments,
	computeAttendance,
	countOf,
	gini,
	personalSpeaking,
	speakingByRegion,
	speakingByRepresentationType,
	speakingPercentile,
	speakingToAttendanceRatio,
	statusCount,
	stdDev,
	tallyVotes,
	toCommitteeActivity
} from './statisticsMath';

describe('gini and stdDev', () => {
	test('are 0 for nothing or an even spread', () => {
		expect(gini([])).toBe(0);
		expect(gini([0, 0])).toBe(0);
		expect(gini([5, 5, 5])).toBe(0);
		expect(stdDev([])).toBe(0);
		expect(stdDev([3, 3])).toBe(0);
	});

	test('grow with inequality', () => {
		expect(gini([0, 0, 10])).toBeCloseTo(2 / 3);
		expect(stdDev([0, 10])).toBe(5);
	});
});

describe('computeAttendance', () => {
	const at = (seconds: number) => new Date(seconds * 1000);

	test('sums each stay, an open one until now, and lists the committees', () => {
		const result = computeAttendance(
			[
				{ present: false, timestamp: at(100), committeeId: 'a' },
				{ present: true, timestamp: at(0), committeeId: 'a' },
				{ present: true, timestamp: at(200), committeeId: 'b' }
			],
			250_000
		);
		expect(result.totalSeconds).toBe(150);
		expect([...result.committeeIds]).toEqual(['a', 'b']);
	});

	test('ignores a departure without an arrival', () => {
		expect(
			computeAttendance([{ present: false, timestamp: at(5), committeeId: 'a' }], 0).totalSeconds
		).toBe(0);
	});
});

describe('speaking aggregates', () => {
	const rows = [
		{ regionalGroup: 'WEOG', representationType: 'DELEGATION', totalSeconds: 10, speechCount: 1 },
		{ regionalGroup: null, representationType: null, totalSeconds: 30, speechCount: 2 },
		{ regionalGroup: 'WEOG', representationType: 'DELEGATION', totalSeconds: 5, speechCount: 3 }
	];

	test('by region, most first, without a group as OTHER', () => {
		expect(speakingByRegion(rows)).toEqual([
			{ group: 'OTHER', totalSeconds: 30, delegationCount: 1, speechCount: 2 },
			{ group: 'WEOG', totalSeconds: 15, delegationCount: 2, speechCount: 4 }
		]);
	});

	test('by representation type, most first, without a type as OTHER', () => {
		expect(speakingByRepresentationType(rows)).toEqual([
			{ representationType: 'OTHER', totalSeconds: 30, delegationCount: 1 },
			{ representationType: 'DELEGATION', totalSeconds: 15, delegationCount: 2 }
		]);
	});

	test('committee activity keeps only its fields', () => {
		const activity = {
			committeeId: 'c',
			committeeName: 'General Assembly',
			committeeAbbreviation: 'GA',
			totalSpeakingSeconds: 1,
			speechCount: 2,
			voteCount: 3
		};
		expect(toCommitteeActivity({ ...activity, ...{ conferenceId: 'x' } })).toEqual(activity);
	});
});

describe('personal statistics', () => {
	test('summarise speeches, comments and waiting', () => {
		expect(
			personalSpeaking([
				{ duration: 60, waitSeconds: 10, listType: 'SPEAKERS_LIST' },
				{ duration: 30.5, waitSeconds: null, listType: 'SPEAKERS_LIST' },
				{ duration: null, waitSeconds: 20, listType: 'COMMENT_LIST' }
			])
		).toEqual({
			totalSeconds: 91,
			speechCount: 2,
			commentCount: 1,
			avgSpeechSeconds: 45.3,
			longestSpeechSeconds: 60,
			avgWaitSeconds: 10
		});
	});

	test('are all zero without periods', () => {
		expect(personalSpeaking([])).toEqual({
			totalSeconds: 0,
			speechCount: 0,
			commentCount: 0,
			avgSpeechSeconds: 0,
			longestSpeechSeconds: 0,
			avgWaitSeconds: 0
		});
	});

	test('place the speaker among all speakers', () => {
		expect(speakingPercentile({ allTotals: [], seconds: 5 })).toBe(0);
		expect(speakingPercentile({ allTotals: [1, 2, 10], seconds: 5 })).toBe(66.7);
	});

	test('relate speaking to presence', () => {
		expect(speakingToAttendanceRatio({ speakingSeconds: 30, attendanceSeconds: 0 })).toBe(0);
		expect(speakingToAttendanceRatio({ speakingSeconds: 30, attendanceSeconds: 90 })).toBe(33.3);
	});

	test('count votes and accepted amendments', () => {
		expect(
			tallyVotes([{ vote: 'PRO' }, { vote: 'PRO' }, { vote: 'CON' }, { vote: 'ABSTAIN' }])
		).toEqual({ pro: 2, con: 1, abstain: 1, total: 4 });
		expect(
			acceptedAmendments([
				{ status: 'ACCEPTED' },
				{ status: 'CONSENSUS_ADOPTED' },
				{ status: 'REJECTED' }
			])
		).toBe(2);
	});
});

describe('counts', () => {
	test('read a single count, 0 without a row', () => {
		expect(countOf([{ cnt: 4 }])).toBe(4);
		expect(countOf([])).toBe(0);
	});

	test('pick one status among per-status counts', () => {
		const rows = [
			{ status: 'FINAL', cnt: 2 },
			{ status: 'VOTING_PHASE', cnt: 1 }
		];
		expect(statusCount({ rows, status: 'FINAL' })).toBe(2);
		expect(statusCount({ rows, status: 'SUBMITTED' })).toBe(0);
	});
});
