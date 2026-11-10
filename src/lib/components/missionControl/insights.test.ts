import { describe, expect, it } from 'vitest';
import {
	buildInsightTiles,
	committeesOnBreak,
	committeesRunning,
	isChartTile,
	isListTile,
	isStatTile,
	speakerLabel,
	type InsightCommittee,
	type InsightPulse
} from './insights';

function committee(overrides: Partial<InsightCommittee> = {}): InsightCommittee {
	return {
		id: 'c1',
		abbreviation: 'GA',
		name: 'General Assembly',
		status: 'FORMAL',
		statusUntil: new Date(0),
		...overrides
	};
}

function pulse(overrides: Partial<InsightPulse> = {}): InsightPulse {
	return {
		heartbeat: {
			speechesToday: 0,
			votesHeldToday: 0,
			resolutionsAdoptedToday: 0,
			debateSecondsToday: 0
		},
		busiestCommittee: null,
		closestVote: null,
		recentAdoptions: [],
		committeeActivityLeaderboard: [],
		speakingByRegion: [],
		conferenceOverview: {
			totalDelegates: 0,
			totalCommittees: 0,
			totalSpeechesAllTime: 0,
			totalResolutionsAdoptedAllTime: 0
		},
		resolutionFunnel: [],
		speakingByRepresentationType: [],
		longestSpeechToday: null,
		amendmentActivity: [],
		voteOutcomesToday: [],
		papersAwaitingVote: 0,
		papersPerCommittee: [],
		...overrides
	};
}

const kinds = (tiles: { kind: string }[]) => tiles.map((t) => t.kind);

describe('committeesOnBreak / committeesRunning', () => {
	const formal = committee({ id: 'a', abbreviation: 'SC', status: 'FORMAL' });
	const formal2 = committee({ id: 'b', abbreviation: 'AC', status: 'FORMAL' });
	const pauseLate = committee({ id: 'c', status: 'PAUSE', statusUntil: new Date(2000) });
	const pauseEarly = committee({ id: 'd', status: 'INFORMAL', statusUntil: new Date(1000) });
	const all = [formal, pauseLate, formal2, pauseEarly];

	it('sorts timed statuses by their end', () => {
		expect(committeesOnBreak(all).map((c) => c.id)).toEqual(['d', 'c']);
	});

	it('sorts the rest by abbreviation', () => {
		expect(committeesRunning(all).map((c) => c.id)).toEqual(['b', 'a']);
	});
});

describe('speakerLabel', () => {
	it('prefers the overwritten name, then the representation name', () => {
		expect(speakerLabel({ id: 's', position: 0, overwriteName: 'Ann' }, { name: 'X' })).toBe('Ann');
		expect(speakerLabel({ id: 's', position: 0 }, { name: 'X' })).toBe('X');
	});

	it('falls back to the country name', () => {
		expect(speakerLabel({ id: 's', position: 0 }, { alpha3Code: 'DEU' })).toBeTruthy();
	});
});

describe('buildInsightTiles', () => {
	it('has nothing for an empty conference', () => {
		expect(buildInsightTiles([], null)).toEqual([]);
	});

	it('builds the committee tiles', () => {
		const speaker = {
			id: 's1',
			position: 0,
			overwriteName: 'Speaker',
			committeeMember: { representation: { name: 'Rep' } }
		};
		const live = committee({
			id: 'live',
			totalPresent: 1,
			members: [
				{ present: true, representation: { type: 'DELEGATION' } },
				{ present: false, representation: { type: 'NSA' } }
			],
			votingSessions: [{ id: 'v', mode: 'SHOW_OF_HANDS', createdAt: new Date(0) }],
			activeAgendaItem: {
				speakersList: [
					{ isClosed: true, startTimestamp: new Date(0), speakers: [speaker] },
					{ isClosed: false, startTimestamp: new Date(0), speakers: [] },
					{ isClosed: false, startTimestamp: new Date(0), speakers: [speaker] }
				]
			}
		});
		const tiles = buildInsightTiles([live, committee({ id: 'idle' })], null);
		expect(kinds(tiles)).toEqual([
			'votingSessions',
			'speakingPulse',
			'speakersListSpotlight',
			'attendance'
		]);
		expect(tiles[3]).toMatchObject({ present: 1, total: 1, committeeCount: 2 });
		expect(tiles[2]).toMatchObject({ key: 'speakersList-live' });
	});

	it('always shows the overview, and an empty pulse nothing else', () => {
		expect(kinds(buildInsightTiles([], pulse()))).toEqual(['conferenceOverview']);
	});

	it('builds every pulse tile in order', () => {
		const named = { committeeAbbreviation: 'GA', committeeName: 'GA' };
		const tiles = buildInsightTiles(
			[],
			pulse({
				heartbeat: {
					speechesToday: 0,
					votesHeldToday: 0,
					resolutionsAdoptedToday: 0,
					debateSecondsToday: 5
				},
				recentAdoptions: [{ ...named, agendaItemTitle: 'A', adoptedAt: new Date(0) }],
				busiestCommittee: { ...named, interventionCount: 3 },
				closestVote: { ...named, votesPro: 2, votesCon: 1, margin: 1 },
				committeeActivityLeaderboard: [
					{ ...named, totalSpeakingSeconds: 1, speechCount: 1, voteCount: 1 }
				],
				speakingByRegion: [{ group: 'x', totalSeconds: 1, delegationCount: 1, speechCount: 1 }],
				amendmentActivity: [{ status: 'x', count: 1 }],
				voteOutcomesToday: [{ outcome: 'x', count: 1 }],
				papersAwaitingVote: 2,
				papersPerCommittee: [{ ...named, paperCount: 1 }],
				resolutionFunnel: [{ status: 'x', count: 1 }],
				speakingByRepresentationType: [
					{ representationType: 'x', totalSeconds: 1, delegationCount: 1 }
				],
				longestSpeechToday: { ...named, durationSeconds: 9 }
			})
		);
		expect(kinds(tiles)).toEqual([
			'heartbeat',
			'adoptions',
			'busiestCommittee',
			'closestVote',
			'committeeActivity',
			'speakingByRegion',
			'amendmentActivity',
			'voteOutcomesToday',
			'papersAwaitingVote',
			'papersPerCommittee',
			'conferenceOverview',
			'resolutionFunnel',
			'speakingByRepresentationType',
			'longestSpeechToday'
		]);
		expect(tiles[2]).toMatchObject({ key: 'busiest', interventionCount: 3 });
	});
});

describe('tile groups', () => {
	it('puts every tile in exactly one group', () => {
		const tiles = buildInsightTiles([], pulse({ papersAwaitingVote: 1 }));
		for (const tile of tiles) {
			expect([isListTile(tile), isChartTile(tile), isStatTile(tile)].filter(Boolean)).toHaveLength(
				1
			);
		}
		expect(isStatTile(tiles[0])).toBe(true);
	});
});
