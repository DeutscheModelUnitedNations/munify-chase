import { describe, expect, test } from 'vitest';
import {
	busiestOf,
	closestVoteOf,
	heartbeatOf,
	longestSpeechOf,
	voteOutcomes
} from './missionControlMath';

const committee = {
	committeeId: 'c',
	committeeName: 'Security Council',
	committeeAbbreviation: 'SC'
};

describe('mission control pulse', () => {
	test('a missing heartbeat is all zero', () => {
		expect(heartbeatOf(undefined)).toEqual({
			speechesToday: 0,
			votesHeldToday: 0,
			resolutionsAdoptedToday: 0,
			debateSecondsToday: 0
		});
		expect(heartbeatOf({ speechesToday: 3, votesHeldToday: 1 }).speechesToday).toBe(3);
	});

	test('the highlights are null without a row and keep only their fields', () => {
		expect(busiestOf(undefined)).toBeNull();
		expect(closestVoteOf(undefined)).toBeNull();
		expect(longestSpeechOf(undefined)).toBeNull();

		expect(busiestOf({ ...committee, interventionCount: 7 })).toEqual({
			...committee,
			interventionCount: 7
		});
		expect(
			closestVoteOf({ ...committee, voteName: null, votesPro: 5, votesCon: 4, margin: 1 })
		).toEqual({ ...committee, voteName: null, votesPro: 5, votesCon: 4, margin: 1 });
		expect(longestSpeechOf({ ...committee, duration: 61.6 })).toEqual({
			...committee,
			durationSeconds: 62
		});
	});

	test('vote outcomes leave out votes without one', () => {
		expect(
			voteOutcomes([
				{ outcome: 'ADOPTED', cnt: 2 },
				{ outcome: null, cnt: 9 }
			])
		).toEqual([{ outcome: 'ADOPTED', count: 2 }]);
	});
});
