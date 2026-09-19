import { schemaBuilder } from '$api/rumble';
import { db, schema } from '$api/db/db';
import { and, count, eq, isNotNull, or, sql } from 'drizzle-orm';
import { building } from '$app/environment';
import { refreshMaterializedViewsWithLock } from '$api/db/refreshMaterializedViews';

// Conference-wide stats are heavy aggregations, not time-critical — refreshed
// every 5 minutes rather than on every request.
const STATISTICS_REFRESH_INTERVAL_MS = 5 * 60_000;
const STATISTICS_VIEWS = [
	'representation_speaking_stats',
	'committee_activity_stats',
	'amendment_success_stats',
	'paper_sponsor_stats',
	'contrarian_vote_stats',
	'voting_alignment_stats',
	'attendance_trend_stats',
	'speaking_timeline_stats'
];

if (!building) {
	setInterval(() => {
		refreshMaterializedViewsWithLock('refresh_statistics', STATISTICS_VIEWS).catch((err) =>
			console.error('Failed to refresh statistics materialized views', err)
		);
	}, STATISTICS_REFRESH_INTERVAL_MS);
}

// ─── Result interfaces ─────────────────────────────────────────────────────

interface PersonalSpeakingStats {
	totalSeconds: number;
	speechCount: number;
	commentCount: number;
	avgSpeechSeconds: number;
	longestSpeechSeconds: number;
	avgWaitSeconds: number;
	speakingPercentile: number;
	speakingToAttendanceRatio: number;
}

interface PersonalAttendanceStats {
	totalSeconds: number;
	committeesCount: number;
}

interface PersonalVotingStats {
	pro: number;
	con: number;
	abstain: number;
	total: number;
}

interface PersonalActivityStats {
	papersSponsored: number;
	amendmentsProposed: number;
	amendmentsAccepted: number;
}

interface PersonalStatsResult {
	speaking: PersonalSpeakingStats;
	attendance: PersonalAttendanceStats;
	voting: PersonalVotingStats;
	activity: PersonalActivityStats;
}

interface DelegationSpeakingStats {
	representationId: string;
	representationName: string | null;
	alpha2Code: string | null;
	regionalGroup: string | null;
	representationType: string | null;
	totalSeconds: number;
	speechCount: number;
	commentCount: number;
}

interface RegionalStats {
	group: string;
	totalSeconds: number;
	delegationCount: number;
	speechCount: number;
}

interface AmendmentCountStats {
	representationId: string;
	representationName: string | null;
	alpha2Code: string | null;
	total: number;
	accepted: number;
}

interface PaperSponsorStats {
	representationId: string;
	representationName: string | null;
	alpha2Code: string | null;
	sponsorships: number;
}

interface CommitteeActivityStats {
	committeeId: string;
	committeeName: string;
	committeeAbbreviation: string;
	totalSpeakingSeconds: number;
	speechCount: number;
	voteCount: number;
}

interface VotingAlignmentStats {
	representation1Id: string;
	representation1Name: string | null;
	representation1Alpha2Code: string | null;
	representation2Id: string;
	representation2Name: string | null;
	representation2Alpha2Code: string | null;
	agreementRate: number;
	votesCompared: number;
}

interface ContraryStats {
	representationId: string;
	representationName: string | null;
	alpha2Code: string | null;
	contraryVotes: number;
	totalVotes: number;
}

interface AttendanceTrendPoint {
	date: string;
	uniqueUsersPresent: number;
}

interface SpeakingTimelineBucket {
	bucket: string;
	totalSeconds: number;
}

interface SpeakingFairness {
	gini: number;
	stdDevSeconds: number;
}

interface ConferenceStatsResult {
	speakingLeaderboard: DelegationSpeakingStats[];
	commentLeaderboard: DelegationSpeakingStats[];
	nsaLeaderboard: DelegationSpeakingStats[];
	speakingByRegion: RegionalStats[];
	amendmentSuccessRate: AmendmentCountStats[];
	paperSponsorLeaderboard: PaperSponsorStats[];
	committeeActivity: CommitteeActivityStats[];
	speakingFairness: SpeakingFairness;
	mostContrarian: ContraryStats[];
	votingAlignment: VotingAlignmentStats[];
	attendanceTrend: AttendanceTrendPoint[];
	speakingTimeline: SpeakingTimelineBucket[];
}

// ─── Reusable SQL expressions ─────────────────────────────────────────────

const durationExpr = sql<number>`EXTRACT(EPOCH FROM (${schema.spokenTimePeriod.endTimestamp} - ${schema.spokenTimePeriod.startTimestamp}))`;
const waitExpr = sql<number>`GREATEST(0, EXTRACT(EPOCH FROM (${schema.spokenTimePeriod.startTimestamp} - ${schema.spokenTimePeriod.queuedAt})))`;

// ─── Algorithmic helpers ──────────────────────────────────────────────────

function gini(values: number[]): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const n = sorted.length;
	const total = sorted.reduce((a, b) => a + b, 0);
	if (total === 0) return 0;
	let numerator = 0;
	for (let i = 0; i < n; i++) numerator += (2 * (i + 1) - n - 1) * sorted[i];
	return Math.max(0, numerator / (n * total));
}

function stdDev(values: number[]): number {
	if (values.length === 0) return 0;
	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	return Math.sqrt(values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length);
}

function computeAttendance(events: { present: boolean; timestamp: Date; committeeId: string }[]): {
	totalSeconds: number;
	committeeIds: Set<string>;
} {
	const sorted = [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
	let totalSeconds = 0;
	const committeeIds = new Set<string>();
	let openIn: (typeof sorted)[0] | null = null;

	for (const e of sorted) {
		if (e.present) {
			openIn = e;
			committeeIds.add(e.committeeId);
		} else if (openIn) {
			totalSeconds += Math.max(
				0,
				Math.floor((e.timestamp.getTime() - openIn.timestamp.getTime()) / 1000)
			);
			openIn = null;
		}
	}
	if (openIn) {
		totalSeconds += Math.max(0, Math.floor((Date.now() - openIn.timestamp.getTime()) / 1000));
	}
	return { totalSeconds, committeeIds };
}

// ─── Pothos object types ──────────────────────────────────────────────────

const PersonalSpeakingStatsRef =
	schemaBuilder.objectRef<PersonalSpeakingStats>('PersonalSpeakingStats');
schemaBuilder.objectType(PersonalSpeakingStatsRef, {
	fields: (t) => ({
		totalSeconds: t.exposeInt('totalSeconds'),
		speechCount: t.exposeInt('speechCount'),
		commentCount: t.exposeInt('commentCount'),
		avgSpeechSeconds: t.exposeFloat('avgSpeechSeconds'),
		longestSpeechSeconds: t.exposeInt('longestSpeechSeconds'),
		avgWaitSeconds: t.exposeFloat('avgWaitSeconds'),
		speakingPercentile: t.exposeFloat('speakingPercentile'),
		speakingToAttendanceRatio: t.exposeFloat('speakingToAttendanceRatio')
	})
});

const PersonalAttendanceStatsRef =
	schemaBuilder.objectRef<PersonalAttendanceStats>('PersonalAttendanceStats');
schemaBuilder.objectType(PersonalAttendanceStatsRef, {
	fields: (t) => ({
		totalSeconds: t.exposeInt('totalSeconds'),
		committeesCount: t.exposeInt('committeesCount')
	})
});

const PersonalVotingStatsRef = schemaBuilder.objectRef<PersonalVotingStats>('PersonalVotingStats');
schemaBuilder.objectType(PersonalVotingStatsRef, {
	fields: (t) => ({
		pro: t.exposeInt('pro'),
		con: t.exposeInt('con'),
		abstain: t.exposeInt('abstain'),
		total: t.exposeInt('total')
	})
});

const PersonalActivityStatsRef =
	schemaBuilder.objectRef<PersonalActivityStats>('PersonalActivityStats');
schemaBuilder.objectType(PersonalActivityStatsRef, {
	fields: (t) => ({
		papersSponsored: t.exposeInt('papersSponsored'),
		amendmentsProposed: t.exposeInt('amendmentsProposed'),
		amendmentsAccepted: t.exposeInt('amendmentsAccepted')
	})
});

const PersonalStatsRef = schemaBuilder.objectRef<PersonalStatsResult>('PersonalStats');
schemaBuilder.objectType(PersonalStatsRef, {
	fields: (t) => ({
		speaking: t.field({ type: PersonalSpeakingStatsRef, resolve: (p) => p.speaking }),
		attendance: t.field({ type: PersonalAttendanceStatsRef, resolve: (p) => p.attendance }),
		voting: t.field({ type: PersonalVotingStatsRef, resolve: (p) => p.voting }),
		activity: t.field({ type: PersonalActivityStatsRef, resolve: (p) => p.activity })
	})
});

const DelegationSpeakingStatsRef =
	schemaBuilder.objectRef<DelegationSpeakingStats>('DelegationSpeakingStats');
schemaBuilder.objectType(DelegationSpeakingStatsRef, {
	fields: (t) => ({
		representationId: t.exposeString('representationId'),
		representationName: t.exposeString('representationName', { nullable: true }),
		alpha2Code: t.exposeString('alpha2Code', { nullable: true }),
		regionalGroup: t.exposeString('regionalGroup', { nullable: true }),
		representationType: t.exposeString('representationType', { nullable: true }),
		totalSeconds: t.exposeInt('totalSeconds'),
		speechCount: t.exposeInt('speechCount'),
		commentCount: t.exposeInt('commentCount')
	})
});

const RegionalStatsRef = schemaBuilder.objectRef<RegionalStats>('RegionalStats');
schemaBuilder.objectType(RegionalStatsRef, {
	fields: (t) => ({
		group: t.exposeString('group'),
		totalSeconds: t.exposeInt('totalSeconds'),
		delegationCount: t.exposeInt('delegationCount'),
		speechCount: t.exposeInt('speechCount')
	})
});

const AmendmentCountStatsRef = schemaBuilder.objectRef<AmendmentCountStats>('AmendmentCountStats');
schemaBuilder.objectType(AmendmentCountStatsRef, {
	fields: (t) => ({
		representationId: t.exposeString('representationId'),
		representationName: t.exposeString('representationName', { nullable: true }),
		alpha2Code: t.exposeString('alpha2Code', { nullable: true }),
		total: t.exposeInt('total'),
		accepted: t.exposeInt('accepted')
	})
});

const PaperSponsorStatsRef = schemaBuilder.objectRef<PaperSponsorStats>('PaperSponsorStats');
schemaBuilder.objectType(PaperSponsorStatsRef, {
	fields: (t) => ({
		representationId: t.exposeString('representationId'),
		representationName: t.exposeString('representationName', { nullable: true }),
		alpha2Code: t.exposeString('alpha2Code', { nullable: true }),
		sponsorships: t.exposeInt('sponsorships')
	})
});

const CommitteeActivityStatsRef =
	schemaBuilder.objectRef<CommitteeActivityStats>('CommitteeActivityStats');
schemaBuilder.objectType(CommitteeActivityStatsRef, {
	fields: (t) => ({
		committeeId: t.exposeString('committeeId'),
		committeeName: t.exposeString('committeeName'),
		committeeAbbreviation: t.exposeString('committeeAbbreviation'),
		totalSpeakingSeconds: t.exposeInt('totalSpeakingSeconds'),
		speechCount: t.exposeInt('speechCount'),
		voteCount: t.exposeInt('voteCount')
	})
});

const VotingAlignmentStatsRef =
	schemaBuilder.objectRef<VotingAlignmentStats>('VotingAlignmentStats');
schemaBuilder.objectType(VotingAlignmentStatsRef, {
	fields: (t) => ({
		representation1Id: t.exposeString('representation1Id'),
		representation1Name: t.exposeString('representation1Name', { nullable: true }),
		representation1Alpha2Code: t.exposeString('representation1Alpha2Code', { nullable: true }),
		representation2Id: t.exposeString('representation2Id'),
		representation2Name: t.exposeString('representation2Name', { nullable: true }),
		representation2Alpha2Code: t.exposeString('representation2Alpha2Code', { nullable: true }),
		agreementRate: t.exposeFloat('agreementRate'),
		votesCompared: t.exposeInt('votesCompared')
	})
});

const ContraryStatsRef = schemaBuilder.objectRef<ContraryStats>('ContraryStats');
schemaBuilder.objectType(ContraryStatsRef, {
	fields: (t) => ({
		representationId: t.exposeString('representationId'),
		representationName: t.exposeString('representationName', { nullable: true }),
		alpha2Code: t.exposeString('alpha2Code', { nullable: true }),
		contraryVotes: t.exposeInt('contraryVotes'),
		totalVotes: t.exposeInt('totalVotes')
	})
});

const AttendanceTrendPointRef =
	schemaBuilder.objectRef<AttendanceTrendPoint>('AttendanceTrendPoint');
schemaBuilder.objectType(AttendanceTrendPointRef, {
	fields: (t) => ({
		date: t.exposeString('date'),
		uniqueUsersPresent: t.exposeInt('uniqueUsersPresent')
	})
});

const SpeakingTimelineBucketRef =
	schemaBuilder.objectRef<SpeakingTimelineBucket>('SpeakingTimelineBucket');
schemaBuilder.objectType(SpeakingTimelineBucketRef, {
	fields: (t) => ({
		bucket: t.exposeString('bucket'),
		totalSeconds: t.exposeInt('totalSeconds')
	})
});

const SpeakingFairnessRef = schemaBuilder.objectRef<SpeakingFairness>('SpeakingFairness');
schemaBuilder.objectType(SpeakingFairnessRef, {
	fields: (t) => ({
		gini: t.exposeFloat('gini'),
		stdDevSeconds: t.exposeFloat('stdDevSeconds')
	})
});

const ConferenceStatsRef = schemaBuilder.objectRef<ConferenceStatsResult>('ConferenceStats');
schemaBuilder.objectType(ConferenceStatsRef, {
	fields: (t) => ({
		speakingLeaderboard: t.field({
			type: [DelegationSpeakingStatsRef],
			resolve: (p) => p.speakingLeaderboard
		}),
		commentLeaderboard: t.field({
			type: [DelegationSpeakingStatsRef],
			resolve: (p) => p.commentLeaderboard
		}),
		nsaLeaderboard: t.field({
			type: [DelegationSpeakingStatsRef],
			resolve: (p) => p.nsaLeaderboard
		}),
		speakingByRegion: t.field({ type: [RegionalStatsRef], resolve: (p) => p.speakingByRegion }),
		amendmentSuccessRate: t.field({
			type: [AmendmentCountStatsRef],
			resolve: (p) => p.amendmentSuccessRate
		}),
		paperSponsorLeaderboard: t.field({
			type: [PaperSponsorStatsRef],
			resolve: (p) => p.paperSponsorLeaderboard
		}),
		committeeActivity: t.field({
			type: [CommitteeActivityStatsRef],
			resolve: (p) => p.committeeActivity
		}),
		speakingFairness: t.field({ type: SpeakingFairnessRef, resolve: (p) => p.speakingFairness }),
		mostContrarian: t.field({ type: [ContraryStatsRef], resolve: (p) => p.mostContrarian }),
		votingAlignment: t.field({
			type: [VotingAlignmentStatsRef],
			resolve: (p) => p.votingAlignment
		}),
		attendanceTrend: t.field({
			type: [AttendanceTrendPointRef],
			resolve: (p) => p.attendanceTrend
		}),
		speakingTimeline: t.field({
			type: [SpeakingTimelineBucketRef],
			resolve: (p) => p.speakingTimeline
		})
	})
});

// ─── Queries ──────────────────────────────────────────────────────────────

schemaBuilder.queryFields((t) => ({
	// ── Personal stats — any conference participant sees their own data ──────
	myStats: t.field({
		type: PersonalStatsRef,
		nullable: true,
		args: { conferenceId: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const conferenceUser = await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					conferenceId: args.conferenceId
				}
			});
			if (!conferenceUser) return null;

			const { committeeMemberId, conferenceMemberId } = conferenceUser;

			// ── Speaking ─────────────────────────────────────────────────────
			const memberConditions = [
				committeeMemberId
					? eq(schema.spokenTimePeriod.committeeMemberId, committeeMemberId)
					: undefined,
				conferenceMemberId
					? eq(schema.spokenTimePeriod.conferenceMemberId, conferenceMemberId)
					: undefined
			].filter(Boolean) as ReturnType<typeof eq>[];

			const periods =
				memberConditions.length > 0
					? await db
							.select({
								duration: durationExpr,
								waitSeconds: waitExpr,
								listType: schema.speakersList.type
							})
							.from(schema.spokenTimePeriod)
							.innerJoin(
								schema.speakersList,
								eq(schema.spokenTimePeriod.speakersListId, schema.speakersList.id)
							)
							.where(memberConditions.length === 1 ? memberConditions[0] : or(...memberConditions))
					: [];

			const totalSeconds = Math.round(periods.reduce((acc, p) => acc + (p.duration ?? 0), 0));
			const speeches = periods.filter((p) => p.listType === 'SPEAKERS_LIST');
			const comments = periods.filter((p) => p.listType === 'COMMENT_LIST');
			const speechDurations = speeches.map((p) => p.duration ?? 0);
			const avgSpeechSeconds =
				speeches.length > 0 ? speechDurations.reduce((a, b) => a + b, 0) / speeches.length : 0;
			const longestSpeechSeconds = Math.round(
				speeches.length > 0 ? Math.max(...speechDurations) : 0
			);
			const avgWaitSeconds =
				periods.length > 0
					? periods.reduce((acc, p) => acc + (p.waitSeconds ?? 0), 0) / periods.length
					: 0;

			// ── Percentile against all speakers in the conference ────────────
			const [delegateTotals, nsaTotals] = await Promise.all([
				db
					.select({ total: sql<number>`COALESCE(SUM(${durationExpr}), 0)` })
					.from(schema.spokenTimePeriod)
					.innerJoin(
						schema.committeeMember,
						eq(schema.spokenTimePeriod.committeeMemberId, schema.committeeMember.id)
					)
					.innerJoin(schema.committee, eq(schema.committeeMember.committeeId, schema.committee.id))
					.where(
						and(
							eq(schema.committee.conferenceId, args.conferenceId),
							isNotNull(schema.spokenTimePeriod.committeeMemberId)
						)
					)
					.groupBy(schema.spokenTimePeriod.committeeMemberId),
				db
					.select({ total: sql<number>`COALESCE(SUM(${durationExpr}), 0)` })
					.from(schema.spokenTimePeriod)
					.innerJoin(
						schema.conferenceMember,
						eq(schema.spokenTimePeriod.conferenceMemberId, schema.conferenceMember.id)
					)
					.where(
						and(
							eq(schema.conferenceMember.conferenceId, args.conferenceId),
							isNotNull(schema.spokenTimePeriod.conferenceMemberId)
						)
					)
					.groupBy(schema.spokenTimePeriod.conferenceMemberId)
			]);
			const allTotals = [...delegateTotals, ...nsaTotals].map((r) => r.total);
			const speakingPercentile =
				allTotals.length > 0
					? Math.round(
							(allTotals.filter((t) => t < totalSeconds).length / allTotals.length) * 1000
						) / 10
					: 0;

			// ── Attendance ───────────────────────────────────────────────────
			const presenceRows = await db
				.select({
					present: schema.presenceEvent.present,
					timestamp: schema.presenceEvent.timestamp,
					committeeId: schema.presenceEvent.committeeId
				})
				.from(schema.presenceEvent)
				.where(eq(schema.presenceEvent.conferenceUserId, conferenceUser.id));

			const { totalSeconds: attendanceSeconds, committeeIds } = computeAttendance(presenceRows);

			// ── Voting ───────────────────────────────────────────────────────
			const voteRows = committeeMemberId
				? await db
						.select({ vote: schema.votingVote.vote })
						.from(schema.votingVote)
						.where(eq(schema.votingVote.committeeMemberId, committeeMemberId))
				: [];
			const pro = voteRows.filter((v) => v.vote === 'PRO').length;
			const con = voteRows.filter((v) => v.vote === 'CON').length;
			const abstain = voteRows.filter((v) => v.vote === 'ABSTAIN').length;

			// ── Papers & amendments ──────────────────────────────────────────
			let papersSponsored = 0;
			let amendmentsProposed = 0;
			let amendmentsAccepted = 0;
			if (committeeMemberId) {
				const [paperCount, amendmentRows] = await Promise.all([
					db
						.select({ cnt: count() })
						.from(schema.paperSponsor)
						.where(eq(schema.paperSponsor.committeeMemberId, committeeMemberId))
						.then((r) => r[0]?.cnt ?? 0),
					db
						.select({ status: schema.amendment.status })
						.from(schema.amendment)
						.where(eq(schema.amendment.proposerCommitteeMemberId, committeeMemberId))
				]);
				papersSponsored = paperCount;
				amendmentsProposed = amendmentRows.length;
				amendmentsAccepted = amendmentRows.filter(
					(a) => a.status === 'ACCEPTED' || a.status === 'CONSENSUS_ADOPTED'
				).length;
			}

			return {
				speaking: {
					totalSeconds: totalSeconds || 0,
					speechCount: speeches.length,
					commentCount: comments.length,
					avgSpeechSeconds: Math.round(avgSpeechSeconds * 10) / 10 || 0,
					longestSpeechSeconds: longestSpeechSeconds || 0,
					avgWaitSeconds: Math.round(avgWaitSeconds * 10) / 10 || 0,
					speakingPercentile: speakingPercentile || 0,
					speakingToAttendanceRatio:
						attendanceSeconds > 0
							? Math.round((totalSeconds / attendanceSeconds) * 1000) / 10 || 0
							: 0
				},
				attendance: {
					totalSeconds: attendanceSeconds || 0,
					committeesCount: committeeIds.size || 0
				},
				voting: { pro, con, abstain, total: pro + con + abstain },
				activity: { papersSponsored, amendmentsProposed, amendmentsAccepted }
			};
		}
	}),

	// ── Conference-wide stats — any participant. Reads straight off the
	// statistics materialized views, which the refresh-statistics job keeps
	// current; no per-request aggregation, no app-level cache.
	conferenceStats: t.field({
		type: ConferenceStatsRef,
		nullable: true,
		args: { conferenceId: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			ctx.mustBeLoggedIn();

			const { conferenceId } = args;

			const conference = await db.query.conference.findFirst(
				ctx.abilities.conference.filter('read').merge({ where: { id: conferenceId } }).query.single
			);
			if (!conference) return null;

			const [
				speakingRows,
				committeeActivityRows,
				amendmentRows,
				paperSponsorRows,
				contrarianRows,
				votingAlignmentRows,
				attendanceTrendRows,
				speakingTimelineRows
			] = await Promise.all([
				db
					.select()
					.from(schema.representationSpeakingStats)
					.where(eq(schema.representationSpeakingStats.conferenceId, conferenceId)),
				db
					.select()
					.from(schema.committeeActivityStats)
					.where(eq(schema.committeeActivityStats.conferenceId, conferenceId)),
				db
					.select()
					.from(schema.amendmentSuccessStats)
					.where(eq(schema.amendmentSuccessStats.conferenceId, conferenceId)),
				db
					.select()
					.from(schema.paperSponsorStats)
					.where(eq(schema.paperSponsorStats.conferenceId, conferenceId)),
				db
					.select()
					.from(schema.contrarianVoteStats)
					.where(eq(schema.contrarianVoteStats.conferenceId, conferenceId)),
				db
					.select()
					.from(schema.votingAlignmentStats)
					.where(eq(schema.votingAlignmentStats.conferenceId, conferenceId)),
				db
					.select()
					.from(schema.attendanceTrendStats)
					.where(eq(schema.attendanceTrendStats.conferenceId, conferenceId)),
				db
					.select()
					.from(schema.speakingTimelineStats)
					.where(eq(schema.speakingTimelineStats.conferenceId, conferenceId))
			]);

			// ── Speaking leaderboards + by-region + fairness ──────────────────
			const allSpeaking: DelegationSpeakingStats[] = speakingRows.map((r) => ({
				representationId: r.representationId,
				representationName: r.representationName,
				alpha2Code: r.alpha2Code,
				regionalGroup: r.regionalGroup,
				representationType: r.representationType,
				totalSeconds: r.totalSeconds,
				speechCount: r.speechCount,
				commentCount: r.commentCount
			}));

			const speakingLeaderboard = allSpeaking
				.filter((r) => r.representationType !== 'NSA')
				.toSorted((a, b) => b.totalSeconds - a.totalSeconds);
			const commentLeaderboard = allSpeaking
				.filter((r) => r.representationType !== 'NSA')
				.toSorted((a, b) => b.commentCount - a.commentCount);
			const nsaLeaderboard = allSpeaking
				.filter((r) => r.representationType === 'NSA')
				.toSorted((a, b) => b.totalSeconds - a.totalSeconds);

			const regionMap = new Map<string, RegionalStats>();
			for (const row of allSpeaking) {
				const group = row.regionalGroup ?? 'OTHER';
				const existing = regionMap.get(group);
				if (existing) {
					existing.totalSeconds += row.totalSeconds;
					existing.delegationCount++;
					existing.speechCount += row.speechCount;
				} else {
					regionMap.set(group, {
						group,
						totalSeconds: row.totalSeconds,
						delegationCount: 1,
						speechCount: row.speechCount
					});
				}
			}
			const speakingByRegion = Array.from(regionMap.values()).toSorted(
				(a, b) => b.totalSeconds - a.totalSeconds
			);

			const speakingFairness: SpeakingFairness = {
				gini: Math.round(gini(allSpeaking.map((r) => r.totalSeconds)) * 1000) / 1000,
				stdDevSeconds: Math.round(stdDev(allSpeaking.map((r) => r.totalSeconds)))
			};

			// ── Amendment success + paper sponsors ─────────────────────────────
			const amendmentSuccessRate: AmendmentCountStats[] = amendmentRows
				.map((r) => ({
					representationId: r.representationId,
					representationName: r.representationName,
					alpha2Code: r.alpha2Code,
					total: r.total,
					accepted: r.accepted
				}))
				.toSorted((a, b) => b.total - a.total);

			const paperSponsorLeaderboard: PaperSponsorStats[] = paperSponsorRows
				.map((r) => ({
					representationId: r.representationId,
					representationName: r.representationName,
					alpha2Code: r.alpha2Code,
					sponsorships: r.sponsorships
				}))
				.toSorted((a, b) => b.sponsorships - a.sponsorships);

			// ── Committee activity ──────────────────────────────────────────────
			const committeeActivity: CommitteeActivityStats[] = committeeActivityRows.map((r) => ({
				committeeId: r.committeeId,
				committeeName: r.committeeName,
				committeeAbbreviation: r.committeeAbbreviation,
				totalSpeakingSeconds: r.totalSpeakingSeconds,
				speechCount: r.speechCount,
				voteCount: r.voteCount
			}));

			// ── Most contrarian votes ───────────────────────────────────────────
			const mostContrarian: ContraryStats[] = contrarianRows
				.map((r) => ({
					representationId: r.representationId,
					representationName: r.representationName,
					alpha2Code: r.alpha2Code,
					contraryVotes: r.contraryVotes,
					totalVotes: r.totalVotes
				}))
				.toSorted((a, b) => b.contraryVotes - a.contraryVotes)
				.slice(0, 20);

			// ── Voting alignment ────────────────────────────────────────────────
			const votingAlignment: VotingAlignmentStats[] = votingAlignmentRows
				.map((r) => ({
					representation1Id: r.representation1Id,
					representation1Name: r.representation1Name,
					representation1Alpha2Code: r.representation1Alpha2Code,
					representation2Id: r.representation2Id,
					representation2Name: r.representation2Name,
					representation2Alpha2Code: r.representation2Alpha2Code,
					agreementRate: Math.round(r.agreementRate * 1000) / 1000,
					votesCompared: r.votesCompared
				}))
				.toSorted((a, b) => b.agreementRate - a.agreementRate)
				.slice(0, 20);

			// ── Attendance trend + speaking timeline ────────────────────────────
			const attendanceTrend: AttendanceTrendPoint[] = attendanceTrendRows
				.toSorted((a, b) => a.date.getTime() - b.date.getTime())
				.map((r) => ({
					date: r.date.toISOString().split('T')[0],
					uniqueUsersPresent: r.uniqueUsersPresent
				}));

			const speakingTimeline: SpeakingTimelineBucket[] = speakingTimelineRows
				.toSorted((a, b) => a.bucket.getTime() - b.bucket.getTime())
				.map((r) => ({
					bucket: `${r.bucket.toISOString().slice(0, 19)}Z`,
					totalSeconds: r.totalSeconds
				}));

			return {
				speakingLeaderboard,
				commentLeaderboard,
				nsaLeaderboard,
				speakingByRegion,
				amendmentSuccessRate,
				paperSponsorLeaderboard,
				committeeActivity,
				speakingFairness,
				mostContrarian,
				votingAlignment,
				attendanceTrend,
				speakingTimeline
			};
		}
	})
}));
