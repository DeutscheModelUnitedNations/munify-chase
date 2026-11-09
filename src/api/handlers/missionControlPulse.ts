import { schemaBuilder } from '#api/rumble';
import { db, schema } from '#api/db/db';
import { and, count, desc, eq, gte, isNotNull, sql } from 'drizzle-orm';
import { building } from '$app/env';
import { refreshMaterializedViewsWithLock } from '#api/db/refreshMaterializedViews';
import { logger } from '#lib/logger';
import {
	countOf,
	speakingByRegion as sumSpeakingByRegion,
	speakingByRepresentationType as sumSpeakingByType,
	statusCount,
	toCommitteeActivity,
	type CommitteeActivity,
	type RegionalSpeaking,
	type RepresentationTypeSpeaking
} from './helpers/statisticsMath';
import {
	busiestOf,
	closestVoteOf,
	heartbeatOf,
	longestSpeechOf,
	voteOutcomes,
	type BusiestCommittee,
	type ClosestVote,
	type HeartbeatStats,
	type LongestSpeechToday
} from './helpers/missionControlMath';
import { committeeActivityType, forReadableConference } from './helpers/statisticsTypes';

// Mission control is a near-live dashboard (client polls every 60s, see
// mission-control/+page.svelte) so these views refresh more often than the
// statistics ones.
const MISSION_CONTROL_REFRESH_INTERVAL_MS = 30_000;
const MISSION_CONTROL_VIEWS = [
	'mission_control_heartbeat_stats',
	'committee_recent_activity_stats',
	'voting_session_results_stats',
	'resolution_adoption_stats'
];

if (!building) {
	setInterval(() => {
		refreshMaterializedViewsWithLock('refresh_mission_control_pulse', MISSION_CONTROL_VIEWS).catch(
			(err) => logger.error('Refreshing the mission control materialized views failed', err)
		);
	}, MISSION_CONTROL_REFRESH_INTERVAL_MS);
}

// ─── Result interfaces ─────────────────────────────────────────────────────

interface RecentAdoption {
	committeeId: string;
	committeeName: string;
	committeeAbbreviation: string;
	paperTitle: string | null;
	documentNumber: string | null;
	agendaItemTitle: string;
	adoptedAt: Date;
}

type CommitteeActivityEntry = CommitteeActivity;
type RegionSpeakingEntry = RegionalSpeaking;

interface ConferenceOverview {
	totalDelegates: number;
	totalCommittees: number;
	totalSpeechesAllTime: number;
	totalResolutionsAdoptedAllTime: number;
}

interface ResolutionFunnelEntry {
	status: string;
	count: number;
}

type RepresentationTypeSpeakingEntry = RepresentationTypeSpeaking;

interface AmendmentActivityEntry {
	status: string;
	count: number;
}

interface VoteOutcomeEntry {
	outcome: string;
	count: number;
}

interface CommitteePaperCountEntry {
	committeeId: string;
	committeeName: string;
	committeeAbbreviation: string;
	paperCount: number;
}

interface MissionControlPulseResult {
	heartbeat: HeartbeatStats;
	busiestCommittee: BusiestCommittee | null;
	closestVote: ClosestVote | null;
	recentAdoptions: RecentAdoption[];
	committeeActivityLeaderboard: CommitteeActivityEntry[];
	speakingByRegion: RegionSpeakingEntry[];
	conferenceOverview: ConferenceOverview;
	resolutionFunnel: ResolutionFunnelEntry[];
	speakingByRepresentationType: RepresentationTypeSpeakingEntry[];
	longestSpeechToday: LongestSpeechToday | null;
	amendmentActivity: AmendmentActivityEntry[];
	voteOutcomesToday: VoteOutcomeEntry[];
	papersAwaitingVote: number;
	papersPerCommittee: CommitteePaperCountEntry[];
}

// ─── GraphQL types ──────────────────────────────────────────────────────────

const HeartbeatStatsRef = schemaBuilder.objectRef<HeartbeatStats>('HeartbeatStats');
schemaBuilder.objectType(HeartbeatStatsRef, {
	fields: (t) => ({
		speechesToday: t.exposeInt('speechesToday'),
		votesHeldToday: t.exposeInt('votesHeldToday'),
		resolutionsAdoptedToday: t.exposeInt('resolutionsAdoptedToday'),
		debateSecondsToday: t.exposeInt('debateSecondsToday')
	})
});

const BusiestCommitteeRef = schemaBuilder.objectRef<BusiestCommittee>('BusiestCommittee');
schemaBuilder.objectType(BusiestCommitteeRef, {
	fields: (t) => ({
		committeeId: t.exposeID('committeeId'),
		committeeName: t.exposeString('committeeName'),
		committeeAbbreviation: t.exposeString('committeeAbbreviation'),
		interventionCount: t.exposeInt('interventionCount')
	})
});

const ClosestVoteRef = schemaBuilder.objectRef<ClosestVote>('ClosestVote');
schemaBuilder.objectType(ClosestVoteRef, {
	fields: (t) => ({
		committeeId: t.exposeID('committeeId'),
		committeeName: t.exposeString('committeeName'),
		committeeAbbreviation: t.exposeString('committeeAbbreviation'),
		voteName: t.exposeString('voteName', { nullable: true }),
		votesPro: t.exposeInt('votesPro'),
		votesCon: t.exposeInt('votesCon'),
		margin: t.exposeInt('margin')
	})
});

const RecentAdoptionRef = schemaBuilder.objectRef<RecentAdoption>('RecentAdoption');
schemaBuilder.objectType(RecentAdoptionRef, {
	fields: (t) => ({
		committeeId: t.exposeID('committeeId'),
		committeeName: t.exposeString('committeeName'),
		committeeAbbreviation: t.exposeString('committeeAbbreviation'),
		paperTitle: t.exposeString('paperTitle', { nullable: true }),
		documentNumber: t.exposeString('documentNumber', { nullable: true }),
		agendaItemTitle: t.exposeString('agendaItemTitle'),
		adoptedAt: t.field({ type: 'DateTime', resolve: (p) => p.adoptedAt })
	})
});

const CommitteeActivityEntryRef = committeeActivityType({
	name: 'MissionControlCommitteeActivityEntry',
	idAs: 'ID'
});

const RegionSpeakingEntryRef = schemaBuilder.objectRef<RegionSpeakingEntry>(
	'MissionControlRegionSpeakingEntry'
);
schemaBuilder.objectType(RegionSpeakingEntryRef, {
	fields: (t) => ({
		group: t.exposeString('group'),
		totalSeconds: t.exposeInt('totalSeconds'),
		delegationCount: t.exposeInt('delegationCount'),
		speechCount: t.exposeInt('speechCount')
	})
});

const ConferenceOverviewRef = schemaBuilder.objectRef<ConferenceOverview>('ConferenceOverview');
schemaBuilder.objectType(ConferenceOverviewRef, {
	fields: (t) => ({
		totalDelegates: t.exposeInt('totalDelegates'),
		totalCommittees: t.exposeInt('totalCommittees'),
		totalSpeechesAllTime: t.exposeInt('totalSpeechesAllTime'),
		totalResolutionsAdoptedAllTime: t.exposeInt('totalResolutionsAdoptedAllTime')
	})
});

const ResolutionFunnelEntryRef =
	schemaBuilder.objectRef<ResolutionFunnelEntry>('ResolutionFunnelEntry');
schemaBuilder.objectType(ResolutionFunnelEntryRef, {
	fields: (t) => ({
		status: t.exposeString('status'),
		count: t.exposeInt('count')
	})
});

const RepresentationTypeSpeakingEntryRef = schemaBuilder.objectRef<RepresentationTypeSpeakingEntry>(
	'RepresentationTypeSpeakingEntry'
);
schemaBuilder.objectType(RepresentationTypeSpeakingEntryRef, {
	fields: (t) => ({
		representationType: t.exposeString('representationType'),
		totalSeconds: t.exposeInt('totalSeconds'),
		delegationCount: t.exposeInt('delegationCount')
	})
});

const LongestSpeechTodayRef = schemaBuilder.objectRef<LongestSpeechToday>('LongestSpeechToday');
schemaBuilder.objectType(LongestSpeechTodayRef, {
	fields: (t) => ({
		committeeId: t.exposeID('committeeId'),
		committeeName: t.exposeString('committeeName'),
		committeeAbbreviation: t.exposeString('committeeAbbreviation'),
		durationSeconds: t.exposeInt('durationSeconds')
	})
});

const AmendmentActivityEntryRef =
	schemaBuilder.objectRef<AmendmentActivityEntry>('AmendmentActivityEntry');
schemaBuilder.objectType(AmendmentActivityEntryRef, {
	fields: (t) => ({
		status: t.exposeString('status'),
		count: t.exposeInt('count')
	})
});

const VoteOutcomeEntryRef = schemaBuilder.objectRef<VoteOutcomeEntry>('VoteOutcomeEntry');
schemaBuilder.objectType(VoteOutcomeEntryRef, {
	fields: (t) => ({
		outcome: t.exposeString('outcome'),
		count: t.exposeInt('count')
	})
});

const CommitteePaperCountEntryRef = schemaBuilder.objectRef<CommitteePaperCountEntry>(
	'CommitteePaperCountEntry'
);
schemaBuilder.objectType(CommitteePaperCountEntryRef, {
	fields: (t) => ({
		committeeId: t.exposeID('committeeId'),
		committeeName: t.exposeString('committeeName'),
		committeeAbbreviation: t.exposeString('committeeAbbreviation'),
		paperCount: t.exposeInt('paperCount')
	})
});

const MissionControlPulseRef =
	schemaBuilder.objectRef<MissionControlPulseResult>('MissionControlPulse');
schemaBuilder.objectType(MissionControlPulseRef, {
	fields: (t) => ({
		heartbeat: t.field({ type: HeartbeatStatsRef, resolve: (p) => p.heartbeat }),
		busiestCommittee: t.field({
			type: BusiestCommitteeRef,
			nullable: true,
			resolve: (p) => p.busiestCommittee
		}),
		closestVote: t.field({ type: ClosestVoteRef, nullable: true, resolve: (p) => p.closestVote }),
		recentAdoptions: t.field({ type: [RecentAdoptionRef], resolve: (p) => p.recentAdoptions }),
		committeeActivityLeaderboard: t.field({
			type: [CommitteeActivityEntryRef],
			resolve: (p) => p.committeeActivityLeaderboard
		}),
		speakingByRegion: t.field({
			type: [RegionSpeakingEntryRef],
			resolve: (p) => p.speakingByRegion
		}),
		conferenceOverview: t.field({
			type: ConferenceOverviewRef,
			resolve: (p) => p.conferenceOverview
		}),
		resolutionFunnel: t.field({
			type: [ResolutionFunnelEntryRef],
			resolve: (p) => p.resolutionFunnel
		}),
		speakingByRepresentationType: t.field({
			type: [RepresentationTypeSpeakingEntryRef],
			resolve: (p) => p.speakingByRepresentationType
		}),
		longestSpeechToday: t.field({
			type: LongestSpeechTodayRef,
			nullable: true,
			resolve: (p) => p.longestSpeechToday
		}),
		amendmentActivity: t.field({
			type: [AmendmentActivityEntryRef],
			resolve: (p) => p.amendmentActivity
		}),
		voteOutcomesToday: t.field({
			type: [VoteOutcomeEntryRef],
			resolve: (p) => p.voteOutcomesToday
		}),
		papersAwaitingVote: t.exposeInt('papersAwaitingVote'),
		papersPerCommittee: t.field({
			type: [CommitteePaperCountEntryRef],
			resolve: (p) => p.papersPerCommittee
		})
	})
});

// ─── Query ──────────────────────────────────────────────────────────────────

const durationExpr = sql<number>`EXTRACT(EPOCH FROM (${schema.spokenTimePeriod.endTimestamp} - ${schema.spokenTimePeriod.startTimestamp}))`;

const paperCommittee = eq(schema.resolutionPaper.committeeId, schema.committee.id);

/** Everything the pulse shows, read off the mission control views and the live tables. */
function loadPulseRows(conferenceId: string) {
	const todayStart = new Date();
	todayStart.setHours(0, 0, 0, 0);
	const inConference = eq(schema.committee.conferenceId, conferenceId);

	return Promise.all([
		db.query.missionControlHeartbeatStats.findFirst({ where: { conferenceId } }),
		db
			.select()
			.from(schema.committeeRecentActivityStats)
			.where(eq(schema.committeeRecentActivityStats.conferenceId, conferenceId))
			.orderBy(desc(schema.committeeRecentActivityStats.interventionCount))
			.limit(1),
		db
			.select()
			.from(schema.votingSessionResultsStats)
			.where(
				and(
					eq(schema.votingSessionResultsStats.conferenceId, conferenceId),
					gte(schema.votingSessionResultsStats.completedAt, todayStart)
				)
			)
			.orderBy(schema.votingSessionResultsStats.margin)
			.limit(1),
		db
			.select()
			.from(schema.resolutionAdoptionStats)
			.where(eq(schema.resolutionAdoptionStats.conferenceId, conferenceId))
			.orderBy(desc(schema.resolutionAdoptionStats.adoptedAt))
			.limit(5),
		db
			.select()
			.from(schema.committeeActivityStats)
			.where(eq(schema.committeeActivityStats.conferenceId, conferenceId))
			.orderBy(desc(schema.committeeActivityStats.totalSpeakingSeconds))
			.limit(5),
		db
			.select()
			.from(schema.representationSpeakingStats)
			.where(eq(schema.representationSpeakingStats.conferenceId, conferenceId)),
		db
			.select({ cnt: count() })
			.from(schema.representation)
			.where(
				and(
					eq(schema.representation.conferenceId, conferenceId),
					eq(schema.representation.type, 'DELEGATION')
				)
			),
		db.select({ cnt: count() }).from(schema.committee).where(inConference),
		// per status, which also answers the adopted papers and those awaiting a vote
		db
			.select({ status: schema.resolutionPaper.status, cnt: count() })
			.from(schema.resolutionPaper)
			.innerJoin(schema.committee, paperCommittee)
			.where(inConference)
			.groupBy(schema.resolutionPaper.status),
		db
			.select({
				committeeId: schema.committee.id,
				committeeName: schema.committee.name,
				committeeAbbreviation: schema.committee.abbreviation,
				duration: durationExpr
			})
			.from(schema.spokenTimePeriod)
			.innerJoin(
				schema.speakersList,
				eq(schema.spokenTimePeriod.speakersListId, schema.speakersList.id)
			)
			.innerJoin(schema.agendaItem, eq(schema.speakersList.agendaItemId, schema.agendaItem.id))
			.innerJoin(schema.committee, eq(schema.agendaItem.committeeId, schema.committee.id))
			.where(and(inConference, gte(schema.spokenTimePeriod.startTimestamp, todayStart)))
			.orderBy(desc(durationExpr))
			.limit(1),
		db
			.select({ status: schema.amendment.status, cnt: count() })
			.from(schema.amendment)
			.innerJoin(
				schema.committeeMember,
				eq(schema.amendment.proposerCommitteeMemberId, schema.committeeMember.id)
			)
			.innerJoin(schema.committee, eq(schema.committeeMember.committeeId, schema.committee.id))
			.where(inConference)
			.groupBy(schema.amendment.status),
		db
			.select({ outcome: schema.votingSession.outcome, cnt: count() })
			.from(schema.votingSession)
			.innerJoin(schema.committee, eq(schema.votingSession.committeeId, schema.committee.id))
			.where(
				and(
					inConference,
					gte(schema.votingSession.completedAt, todayStart),
					isNotNull(schema.votingSession.outcome)
				)
			)
			.groupBy(schema.votingSession.outcome),
		db
			.select({
				committeeId: schema.committee.id,
				committeeName: schema.committee.name,
				committeeAbbreviation: schema.committee.abbreviation,
				cnt: count()
			})
			.from(schema.resolutionPaper)
			.innerJoin(schema.committee, paperCommittee)
			.where(inConference)
			.groupBy(schema.committee.id, schema.committee.name, schema.committee.abbreviation)
			.orderBy(desc(count()))
			.limit(5)
	]);
}

/** The pulse of the conference right now. */
async function pulseOf(conferenceId: string): Promise<MissionControlPulseResult> {
	const [
		heartbeat,
		busiestRows,
		closestVoteRows,
		recentAdoptionRows,
		committeeActivityRows,
		speakingRows,
		totalDelegatesRows,
		totalCommitteesRows,
		resolutionFunnelRows,
		longestSpeechRows,
		amendmentActivityRows,
		voteOutcomeRows,
		papersPerCommitteeRows
	] = await loadPulseRows(conferenceId);

	// Aggregated by regional group and representation type (delegation/NSA/UN), not by
	// delegation — mission control deliberately avoids spotlighting individual delegations.
	const spoken = (r: { totalSeconds: number }) => r.totalSeconds > 0;

	const result: MissionControlPulseResult = {
		heartbeat: heartbeatOf(heartbeat),
		busiestCommittee: busiestOf(busiestRows[0]),
		closestVote: closestVoteOf(closestVoteRows[0]),
		recentAdoptions: recentAdoptionRows.map((r) => ({
			committeeId: r.committeeId,
			committeeName: r.committeeName,
			committeeAbbreviation: r.committeeAbbreviation,
			paperTitle: r.paperTitle,
			documentNumber: r.documentNumber,
			agendaItemTitle: r.agendaItemTitle,
			adoptedAt: r.adoptedAt
		})),
		committeeActivityLeaderboard: committeeActivityRows.map(toCommitteeActivity),
		speakingByRegion: sumSpeakingByRegion(speakingRows).filter(spoken),
		conferenceOverview: {
			totalDelegates: countOf(totalDelegatesRows),
			totalCommittees: countOf(totalCommitteesRows),
			totalSpeechesAllTime: speakingRows.reduce((acc, r) => acc + r.speechCount, 0),
			totalResolutionsAdoptedAllTime: statusCount({
				rows: resolutionFunnelRows,
				status: 'FINAL'
			})
		},
		resolutionFunnel: resolutionFunnelRows.map((r) => ({ status: r.status, count: r.cnt })),
		speakingByRepresentationType: sumSpeakingByType(speakingRows).filter(spoken),
		longestSpeechToday: longestSpeechOf(longestSpeechRows[0]),
		amendmentActivity: amendmentActivityRows.map((r) => ({ status: r.status, count: r.cnt })),
		voteOutcomesToday: voteOutcomes(voteOutcomeRows),
		papersAwaitingVote: statusCount({ rows: resolutionFunnelRows, status: 'VOTING_PHASE' }),
		papersPerCommittee: papersPerCommitteeRows.map((r) => ({
			committeeId: r.committeeId,
			committeeName: r.committeeName,
			committeeAbbreviation: r.committeeAbbreviation,
			paperCount: r.cnt
		}))
	};

	return result;
}

schemaBuilder.queryFields((t) => ({
	missionControlPulse: t.field({
		type: MissionControlPulseRef,
		nullable: true,
		args: { conferenceId: t.arg.id({ required: true }) },
		resolve: forReadableConference(pulseOf)
	})
}));
