import { schemaBuilder } from '$api/rumble';
import { db, schema } from '$api/db/db';
import { and, count, desc, eq, isNotNull, or, sql } from 'drizzle-orm';

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

// ─── TTL cache for expensive conference-wide aggregations ─────────────────

const CACHE_TTL_MS = 60_000;
const conferenceStatsCache = new Map<string, { data: ConferenceStatsResult; expiresAt: number }>();

function getCached(conferenceId: string): ConferenceStatsResult | null {
	const entry = conferenceStatsCache.get(conferenceId);
	if (entry && entry.expiresAt > Date.now()) return entry.data;
	conferenceStatsCache.delete(conferenceId);
	return null;
}

function setCached(conferenceId: string, data: ConferenceStatsResult): void {
	conferenceStatsCache.set(conferenceId, { data, expiresAt: Date.now() + CACHE_TTL_MS });
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

	// ── Conference-wide stats — any participant, cached 60 s ────────────────
	conferenceStats: t.field({
		type: ConferenceStatsRef,
		nullable: true,
		args: { conferenceId: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			ctx.mustBeLoggedIn();

			const { conferenceId } = args;

			// Ability check runs on every call — including cache hits — so a user
			// who left the conference cannot read a previously cached response.
			const conference = await db.query.conference.findFirst(
				ctx.abilities.conference.filter('read').merge({ where: { id: conferenceId } }).query.single
			);
			if (!conference) return null;

			const cached = getCached(conferenceId);
			if (cached) return cached;

			// ── Speaking leaderboard ─────────────────────────────────────────
			async function fetchSpeakingByRepresentation(source: 'committee' | 'conference') {
				if (source === 'committee') {
					return db
						.select({
							representationId: schema.representation.id,
							representationName: schema.representation.name,
							alpha2Code: schema.representation.alpha2Code,
							regionalGroup: schema.representation.regionalGroup,
							representationType: schema.representation.type,
							totalSeconds: sql<number>`COALESCE(SUM(${durationExpr}), 0)`,
							speechCount: sql<number>`COUNT(*) FILTER (WHERE ${schema.speakersList.type} = 'SPEAKERS_LIST')`,
							commentCount: sql<number>`COUNT(*) FILTER (WHERE ${schema.speakersList.type} = 'COMMENT_LIST')`
						})
						.from(schema.spokenTimePeriod)
						.innerJoin(
							schema.speakersList,
							eq(schema.spokenTimePeriod.speakersListId, schema.speakersList.id)
						)
						.innerJoin(
							schema.committeeMember,
							eq(schema.spokenTimePeriod.committeeMemberId, schema.committeeMember.id)
						)
						.innerJoin(
							schema.representation,
							eq(schema.committeeMember.representationId, schema.representation.id)
						)
						.innerJoin(
							schema.committee,
							eq(schema.committeeMember.committeeId, schema.committee.id)
						)
						.where(
							and(
								eq(schema.committee.conferenceId, conferenceId),
								isNotNull(schema.spokenTimePeriod.committeeMemberId)
							)
						)
						.groupBy(
							schema.representation.id,
							schema.representation.name,
							schema.representation.alpha2Code,
							schema.representation.regionalGroup,
							schema.representation.type
						);
				} else {
					return db
						.select({
							representationId: schema.representation.id,
							representationName: schema.representation.name,
							alpha2Code: schema.representation.alpha2Code,
							regionalGroup: schema.representation.regionalGroup,
							representationType: schema.representation.type,
							totalSeconds: sql<number>`COALESCE(SUM(${durationExpr}), 0)`,
							speechCount: sql<number>`COUNT(*) FILTER (WHERE ${schema.speakersList.type} = 'SPEAKERS_LIST')`,
							commentCount: sql<number>`COUNT(*) FILTER (WHERE ${schema.speakersList.type} = 'COMMENT_LIST')`
						})
						.from(schema.spokenTimePeriod)
						.innerJoin(
							schema.speakersList,
							eq(schema.spokenTimePeriod.speakersListId, schema.speakersList.id)
						)
						.innerJoin(
							schema.conferenceMember,
							eq(schema.spokenTimePeriod.conferenceMemberId, schema.conferenceMember.id)
						)
						.innerJoin(
							schema.representation,
							eq(schema.conferenceMember.representationId, schema.representation.id)
						)
						.where(
							and(
								eq(schema.conferenceMember.conferenceId, conferenceId),
								isNotNull(schema.spokenTimePeriod.conferenceMemberId)
							)
						)
						.groupBy(
							schema.representation.id,
							schema.representation.name,
							schema.representation.alpha2Code,
							schema.representation.regionalGroup,
							schema.representation.type
						);
				}
			}

			const [delegateSpeaking, nsaSpeaking] = await Promise.all([
				fetchSpeakingByRepresentation('committee'),
				fetchSpeakingByRepresentation('conference')
			]);

			const speakingMap = new Map<string, DelegationSpeakingStats>();
			for (const row of [...delegateSpeaking, ...nsaSpeaking]) {
				const existing = speakingMap.get(row.representationId);
				if (existing) {
					existing.totalSeconds += Math.round(row.totalSeconds) || 0;
					existing.speechCount += Number(row.speechCount) || 0;
					existing.commentCount += Number(row.commentCount) || 0;
				} else {
					speakingMap.set(row.representationId, {
						representationId: row.representationId,
						representationName: row.representationName,
						alpha2Code: row.alpha2Code,
						regionalGroup: row.regionalGroup,
						representationType: row.representationType,
						totalSeconds: Math.round(row.totalSeconds) || 0,
						speechCount: Number(row.speechCount) || 0,
						commentCount: Number(row.commentCount) || 0
					});
				}
			}

			const allSpeaking = Array.from(speakingMap.values());
			const speakingLeaderboard = [...allSpeaking]
				.filter((r) => r.representationType !== 'NSA')
				.sort((a, b) => b.totalSeconds - a.totalSeconds);
			const commentLeaderboard = [...allSpeaking]
				.filter((r) => r.representationType !== 'NSA')
				.sort((a, b) => b.commentCount - a.commentCount);
			const nsaLeaderboard = [...allSpeaking]
				.filter((r) => r.representationType === 'NSA')
				.sort((a, b) => b.totalSeconds - a.totalSeconds);

			// ── Speaking by regional group ────────────────────────────────────
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
			const speakingByRegion = Array.from(regionMap.values()).sort(
				(a, b) => b.totalSeconds - a.totalSeconds
			);

			// ── Amendment success by country ──────────────────────────────────
			const amendmentRows = await db
				.select({
					representationId: schema.representation.id,
					representationName: schema.representation.name,
					alpha2Code: schema.representation.alpha2Code,
					status: schema.amendment.status
				})
				.from(schema.amendment)
				.innerJoin(
					schema.committeeMember,
					eq(schema.amendment.proposerCommitteeMemberId, schema.committeeMember.id)
				)
				.innerJoin(
					schema.representation,
					eq(schema.committeeMember.representationId, schema.representation.id)
				)
				.innerJoin(schema.committee, eq(schema.committeeMember.committeeId, schema.committee.id))
				.where(eq(schema.committee.conferenceId, conferenceId));

			const amendmentMap = new Map<string, AmendmentCountStats>();
			for (const row of amendmentRows) {
				const existing = amendmentMap.get(row.representationId) ?? {
					representationId: row.representationId,
					representationName: row.representationName,
					alpha2Code: row.alpha2Code,
					total: 0,
					accepted: 0
				};
				existing.total++;
				if (row.status === 'ACCEPTED' || row.status === 'CONSENSUS_ADOPTED') existing.accepted++;
				amendmentMap.set(row.representationId, existing);
			}
			const amendmentSuccessRate = Array.from(amendmentMap.values()).sort(
				(a, b) => b.total - a.total
			);

			// ── Paper sponsor leaderboard ─────────────────────────────────────
			const paperSponsorRows = await db
				.select({
					representationId: schema.representation.id,
					representationName: schema.representation.name,
					alpha2Code: schema.representation.alpha2Code,
					sponsorships: sql<number>`COUNT(*)`
				})
				.from(schema.paperSponsor)
				.innerJoin(
					schema.committeeMember,
					eq(schema.paperSponsor.committeeMemberId, schema.committeeMember.id)
				)
				.innerJoin(
					schema.representation,
					eq(schema.committeeMember.representationId, schema.representation.id)
				)
				.innerJoin(schema.committee, eq(schema.committeeMember.committeeId, schema.committee.id))
				.where(eq(schema.committee.conferenceId, conferenceId))
				.groupBy(
					schema.representation.id,
					schema.representation.name,
					schema.representation.alpha2Code
				)
				.orderBy(desc(sql`COUNT(*)`));

			const paperSponsorLeaderboard: PaperSponsorStats[] = paperSponsorRows.map((r) => ({
				representationId: r.representationId,
				representationName: r.representationName,
				alpha2Code: r.alpha2Code,
				sponsorships: Number(r.sponsorships)
			}));

			// ── Committee activity ────────────────────────────────────────────
			const [committeeActivityRows, voteCountRows] = await Promise.all([
				db
					.select({
						committeeId: schema.committee.id,
						committeeName: schema.committee.name,
						committeeAbbreviation: schema.committee.abbreviation,
						totalSpeakingSeconds: sql<number>`COALESCE(SUM(${durationExpr}), 0)`,
						speechCount: sql<number>`COUNT(${schema.spokenTimePeriod.id})`
					})
					.from(schema.committee)
					.leftJoin(schema.agendaItem, eq(schema.agendaItem.committeeId, schema.committee.id))
					.leftJoin(schema.speakersList, eq(schema.speakersList.agendaItemId, schema.agendaItem.id))
					.leftJoin(
						schema.spokenTimePeriod,
						eq(schema.spokenTimePeriod.speakersListId, schema.speakersList.id)
					)
					.where(eq(schema.committee.conferenceId, conferenceId))
					.groupBy(schema.committee.id, schema.committee.name, schema.committee.abbreviation),
				db
					.select({
						committeeId: schema.votingSession.committeeId,
						voteCount: sql<number>`COUNT(*)`
					})
					.from(schema.votingSession)
					.innerJoin(schema.committee, eq(schema.votingSession.committeeId, schema.committee.id))
					.where(
						and(
							eq(schema.committee.conferenceId, conferenceId),
							isNotNull(schema.votingSession.completedAt)
						)
					)
					.groupBy(schema.votingSession.committeeId)
			]);

			const voteCountMap = new Map(voteCountRows.map((r) => [r.committeeId, Number(r.voteCount)]));
			const committeeActivity: CommitteeActivityStats[] = committeeActivityRows.map((r) => ({
				committeeId: r.committeeId,
				committeeName: r.committeeName,
				committeeAbbreviation: r.committeeAbbreviation,
				totalSpeakingSeconds: Math.round(r.totalSpeakingSeconds) || 0,
				speechCount: Number(r.speechCount) || 0,
				voteCount: voteCountMap.get(r.committeeId) ?? 0
			}));

			// ── Speaking fairness ─────────────────────────────────────────────
			const allSecondsArr = allSpeaking.map((r) => r.totalSeconds);
			const speakingFairness: SpeakingFairness = {
				gini: Math.round(gini(allSecondsArr) * 1000) / 1000,
				stdDevSeconds: Math.round(stdDev(allSecondsArr))
			};

			// ── Most contrarian votes ─────────────────────────────────────────
			const contraryRows = await db
				.select({
					representationId: schema.representation.id,
					representationName: schema.representation.name,
					alpha2Code: schema.representation.alpha2Code,
					contraryVotes: sql<number>`COUNT(*) FILTER (
						WHERE (${schema.votingVote.vote} = 'PRO' AND ${schema.votingSession.outcome} = 'REJECTED')
						   OR (${schema.votingVote.vote} = 'CON' AND ${schema.votingSession.outcome} = 'ADOPTED')
					)`,
					totalVotes: sql<number>`COUNT(*)`
				})
				.from(schema.votingVote)
				.innerJoin(
					schema.votingSession,
					eq(schema.votingVote.votingSessionId, schema.votingSession.id)
				)
				.innerJoin(
					schema.committeeMember,
					eq(schema.votingVote.committeeMemberId, schema.committeeMember.id)
				)
				.innerJoin(
					schema.representation,
					eq(schema.committeeMember.representationId, schema.representation.id)
				)
				.innerJoin(schema.committee, eq(schema.votingSession.committeeId, schema.committee.id))
				.where(
					and(
						eq(schema.committee.conferenceId, conferenceId),
						isNotNull(schema.votingSession.outcome)
					)
				)
				.groupBy(
					schema.representation.id,
					schema.representation.name,
					schema.representation.alpha2Code
				)
				.orderBy(
					desc(
						sql`COUNT(*) FILTER (
							WHERE (${schema.votingVote.vote} = 'PRO' AND ${schema.votingSession.outcome} = 'REJECTED')
							   OR (${schema.votingVote.vote} = 'CON' AND ${schema.votingSession.outcome} = 'ADOPTED')
						)`
					)
				)
				.limit(20);

			const mostContrarian: ContraryStats[] = contraryRows.map((r) => ({
				representationId: r.representationId,
				representationName: r.representationName,
				alpha2Code: r.alpha2Code,
				contraryVotes: Number(r.contraryVotes),
				totalVotes: Number(r.totalVotes)
			}));

			// ── Voting alignment ──────────────────────────────────────────────
			const allVoteRows = await db
				.select({
					votingSessionId: schema.votingVote.votingSessionId,
					representationId: schema.representation.id,
					representationName: schema.representation.name,
					alpha2Code: schema.representation.alpha2Code,
					vote: schema.votingVote.vote
				})
				.from(schema.votingVote)
				.innerJoin(
					schema.committeeMember,
					eq(schema.votingVote.committeeMemberId, schema.committeeMember.id)
				)
				.innerJoin(
					schema.representation,
					eq(schema.committeeMember.representationId, schema.representation.id)
				)
				.innerJoin(
					schema.votingSession,
					eq(schema.votingVote.votingSessionId, schema.votingSession.id)
				)
				.innerJoin(schema.committee, eq(schema.votingSession.committeeId, schema.committee.id))
				.where(eq(schema.committee.conferenceId, conferenceId));

			// Build per-session vote maps then compute pairwise agreement
			const bySession = new Map<
				string,
				Map<string, { vote: string; name: string | null; alpha2: string | null }>
			>();
			for (const row of allVoteRows) {
				let sessionMap = bySession.get(row.votingSessionId);
				if (!sessionMap) {
					sessionMap = new Map();
					bySession.set(row.votingSessionId, sessionMap);
				}
				sessionMap.set(row.representationId, {
					vote: row.vote,
					name: row.representationName,
					alpha2: row.alpha2Code
				});
			}

			const pairStats = new Map<
				string,
				{
					agree: number;
					total: number;
					name1: string | null;
					alpha2_1: string | null;
					name2: string | null;
					alpha2_2: string | null;
				}
			>();
			for (const sessionMap of bySession.values()) {
				const entries = Array.from(sessionMap.entries());
				for (let i = 0; i < entries.length; i++) {
					for (let j = i + 1; j < entries.length; j++) {
						const [id1, d1] = entries[i];
						const [id2, d2] = entries[j];
						const [lo, hi] = id1 < id2 ? [id1, id2] : [id2, id1];
						const loIsId1 = lo === id1;
						const key = `${lo}|${hi}`;
						const existing = pairStats.get(key) ?? {
							agree: 0,
							total: 0,
							name1: loIsId1 ? d1.name : d2.name,
							alpha2_1: loIsId1 ? d1.alpha2 : d2.alpha2,
							name2: loIsId1 ? d2.name : d1.name,
							alpha2_2: loIsId1 ? d2.alpha2 : d1.alpha2
						};
						existing.total++;
						if (d1.vote === d2.vote) existing.agree++;
						pairStats.set(key, existing);
					}
				}
			}

			const votingAlignment: VotingAlignmentStats[] = Array.from(pairStats.entries())
				.filter(([, v]) => v.total >= 3)
				.map(([key, v]) => {
					const [rep1Id, rep2Id] = key.split('|');
					return {
						representation1Id: rep1Id,
						representation1Name: v.name1,
						representation1Alpha2Code: v.alpha2_1,
						representation2Id: rep2Id,
						representation2Name: v.name2,
						representation2Alpha2Code: v.alpha2_2,
						agreementRate: Math.round((v.agree / v.total) * 1000) / 1000,
						votesCompared: v.total
					};
				})
				.sort((a, b) => b.agreementRate - a.agreementRate)
				.slice(0, 20);

			// ── Attendance trend (distinct check-ins per calendar day) ────────
			const trendRows = await db
				.select({
					conferenceUserId: schema.presenceEvent.conferenceUserId,
					timestamp: schema.presenceEvent.timestamp
				})
				.from(schema.presenceEvent)
				.innerJoin(schema.committee, eq(schema.presenceEvent.committeeId, schema.committee.id))
				.where(
					and(
						eq(schema.committee.conferenceId, conferenceId),
						eq(schema.presenceEvent.present, true)
					)
				);

			const byDate = new Map<string, Set<string>>();
			for (const row of trendRows) {
				const day = row.timestamp.toISOString().split('T')[0];
				const set = byDate.get(day) ?? new Set<string>();
				set.add(row.conferenceUserId);
				byDate.set(day, set);
			}
			const attendanceTrend: AttendanceTrendPoint[] = Array.from(byDate.entries())
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([date, users]) => ({ date, uniqueUsersPresent: users.size }));

			// ── Speaking activity timeline (30-min buckets) ─────────────────
			const bucketExpr = sql<string>`to_char(to_timestamp(floor(extract(epoch from ${schema.spokenTimePeriod.startTimestamp}) / 1800) * 1800), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')`;
			const bucketDuration = sql<number>`COALESCE(SUM(EXTRACT(EPOCH FROM (${schema.spokenTimePeriod.endTimestamp} - ${schema.spokenTimePeriod.startTimestamp}))), 0)`;

			const [timelineCommittee, timelineConference] = await Promise.all([
				db
					.select({ bucket: bucketExpr, totalSeconds: bucketDuration })
					.from(schema.spokenTimePeriod)
					.innerJoin(
						schema.committeeMember,
						eq(schema.spokenTimePeriod.committeeMemberId, schema.committeeMember.id)
					)
					.innerJoin(schema.committee, eq(schema.committeeMember.committeeId, schema.committee.id))
					.where(
						and(
							eq(schema.committee.conferenceId, conferenceId),
							isNotNull(schema.spokenTimePeriod.committeeMemberId)
						)
					)
					.groupBy(bucketExpr)
					.orderBy(bucketExpr),
				db
					.select({ bucket: bucketExpr, totalSeconds: bucketDuration })
					.from(schema.spokenTimePeriod)
					.innerJoin(
						schema.conferenceMember,
						eq(schema.spokenTimePeriod.conferenceMemberId, schema.conferenceMember.id)
					)
					.where(
						and(
							eq(schema.conferenceMember.conferenceId, conferenceId),
							isNotNull(schema.spokenTimePeriod.conferenceMemberId)
						)
					)
					.groupBy(bucketExpr)
					.orderBy(bucketExpr)
			]);

			const timelineMap = new Map<string, number>();
			for (const row of [...timelineCommittee, ...timelineConference]) {
				timelineMap.set(
					row.bucket,
					(timelineMap.get(row.bucket) ?? 0) + Math.round(row.totalSeconds)
				);
			}
			const speakingTimeline: SpeakingTimelineBucket[] = Array.from(timelineMap.entries())
				.sort(([a], [b]) => a.localeCompare(b))
				.map(([bucket, totalSeconds]) => ({ bucket, totalSeconds }));

			// ── Assemble, cache, return ──────────────────────────────────────
			const result: ConferenceStatsResult = {
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
			setCached(conferenceId, result);
			return result;
		}
	})
}));
