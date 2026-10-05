/**
 * Puts the seeded dev conference (`bun run db:seed:dev`) into a state that makes
 * for representative manual screenshots: people present, speakers queued, requests,
 * non-state actors, today's speeches and votes, and a paper owned by the delegate
 * the screenshots log in as (Germany).
 *
 * Idempotent, so it runs before every single shot.
 */
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq, inArray, sql } from 'drizzle-orm';
import * as schema from '../../src/api/db/schema';
import type { StageIds, Translate } from './types';
import en from '../../messages/en.json';

const db = drizzle(process.env.DATABASE_URL!);

const MINUTE = 60 * 1000;
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * MINUTE);

const STAGE = {
	conferenceTitle: 'Dev Conference',
	committeeAbbreviation: 'GV',
	presentShare: 0.75,
	// Germany (the logged-in delegate) is #2 in the queue
	mainSpeakers: ['FR', 'BR', 'DE', 'JP', 'NG'],
	commentSpeakers: ['US', 'AR'],
	// Named like the app's default set, in the language being captured
	requestTypes: [
		{ message: 'requestTypeRightToInformation', faIcon: 'fa-circle-info', delegatesOnly: false },
		{ message: 'requestTypeRollCallVote', faIcon: 'fa-bullhorn', delegatesOnly: false },
		{ message: 'requestTypeInformalSession', faIcon: 'fa-comments', delegatesOnly: false },
		{ message: 'requestTypeEndDebate', faIcon: 'fa-flag-checkered', delegatesOnly: true }
	],
	// country -> index into requestTypes
	pendingRequests: [
		['FR', 2],
		['BR', 0],
		['DE', 1]
	],
	nsaPeople: [
		{ name: 'Lena Fischer', email: 'l.fischer@icrc.dev', code: 'K7M2QX', checkedIn: true },
		{ name: 'Tomás Ribeiro', email: 't.ribeiro@icrc.dev', code: 'P4W9HN', checkedIn: false },
		{ name: 'Amara Okafor', email: 'a.okafor@icrc.dev', code: 'R3T8ZD', checkedIn: false }
	],
	// country, minutes ago it ended, seconds spoken
	speeches: [
		['FR', 150, 145],
		['DE', 130, 170],
		['BR', 110, 90],
		['JP', 95, 120],
		['NG', 80, 175],
		['DE', 55, 60],
		['US', 40, 110],
		['AR', 20, 80]
	],
	votes: [
		{ name: 'Motion for an informal session', outcome: 'ADOPTED', minutesAgo: 70, share: 0.7 },
		{ name: 'Motion to close the speakers list', outcome: 'REJECTED', minutesAgo: 30, share: 0.4 }
	]
} as const;

function byCountry<T>(rows: T[], code: (row: T) => string | null | undefined) {
	return new Map(rows.map((row) => [code(row)?.toUpperCase(), row]));
}

/** `t` names the request types, the screenshots show them in the captured language */
export async function stage(t?: Translate): Promise<StageIds> {
	const [conference] = await db
		.select()
		.from(schema.conference)
		.where(eq(schema.conference.title, STAGE.conferenceTitle));
	if (!conference) throw new Error('Dev conference missing, run `bun run db:seed:dev` first');

	const committees = await db
		.select()
		.from(schema.committee)
		.where(eq(schema.committee.conferenceId, conference.id));
	const committee = committees.find((c) => c.abbreviation === STAGE.committeeAbbreviation);
	if (!committee?.activeAgendaItemId) throw new Error('Committee or active agenda item missing');
	const agendaItemId = committee.activeAgendaItemId;

	await db
		.update(schema.committee)
		.set({
			allowRequests: true,
			allowDelegationsToAddThemselvesToSpeakersList: true,
			status: 'FORMAL',
			statusHeadline: '',
			statusUntil: new Date(Date.now() + 45 * MINUTE),
			stateOfDebate: 'General debate',
			whiteboardContent:
				'<h2>Schedule</h2><p>10:30 Coffee break</p><p>12:00 Voting on draft resolutions</p>',
			activeDraftResolutionId: null,
			activeVotingSessionId: null,
			activeAmendmentId: null,
			presentationLayout: 'default'
		})
		.where(eq(schema.committee.id, committee.id));

	// Other committees sit in a timed break, so Mission Control shows both kinds of cards
	await db
		.update(schema.committee)
		.set({ status: 'PAUSE', statusUntil: new Date(Date.now() + 10 * MINUTE) })
		.where(
			and(
				eq(schema.committee.conferenceId, conference.id),
				sql`${schema.committee.id} <> ${committee.id}`
			)
		);

	// Members by country code
	const memberRows = await db
		.select({ id: schema.committeeMember.id, alpha2: schema.representation.alpha2Code })
		.from(schema.committeeMember)
		.innerJoin(
			schema.representation,
			eq(schema.committeeMember.representationId, schema.representation.id)
		)
		.where(eq(schema.committeeMember.committeeId, committee.id));
	const members = byCountry(memberRows, (m) => m.alpha2);
	const memberId = (code: string) => {
		const id = members.get(code)?.id;
		if (!id) throw new Error(`No ${code} delegation in ${committee.abbreviation}`);
		return id;
	};

	const delegateUsers = byCountry(
		await db
			.select({ id: schema.conferenceUser.id, email: schema.conferenceUser.userEmail })
			.from(schema.conferenceUser)
			.where(eq(schema.conferenceUser.conferenceId, conference.id)),
		(u) => /^gv\.([a-z]{2})@delegate\.dev$/.exec(u.email)?.[1]
	);
	const delegateUserId = (code: string) => {
		const id = delegateUsers.get(code)?.id;
		if (!id) throw new Error(`No delegate user for ${code}`);
		return id;
	};

	// Presence
	const present = new Set(
		memberRows.slice(0, Math.round(memberRows.length * STAGE.presentShare)).map((m) => m.id)
	);
	for (const code of [...STAGE.mainSpeakers, ...STAGE.commentSpeakers]) present.add(memberId(code));
	await db
		.update(schema.committeeMember)
		.set({ present: false })
		.where(eq(schema.committeeMember.committeeId, committee.id));
	await db
		.update(schema.committeeMember)
		.set({ present: true })
		.where(inArray(schema.committeeMember.id, [...present]));

	// Speakers lists: queued speakers and today's finished speeches
	const lists = await db
		.select()
		.from(schema.speakersList)
		.where(eq(schema.speakersList.agendaItemId, agendaItemId));
	const mainList = lists.find((l) => l.type === 'SPEAKERS_LIST');
	const commentList = lists.find((l) => l.type === 'COMMENT_LIST');
	if (!mainList || !commentList) throw new Error('Speakers lists missing');
	for (const list of lists) {
		const codes = list === mainList ? STAGE.mainSpeakers : STAGE.commentSpeakers;
		await db.delete(schema.speakerOnList).where(eq(schema.speakerOnList.speakersListId, list.id));
		await db
			.delete(schema.spokenTimePeriod)
			.where(eq(schema.spokenTimePeriod.speakersListId, list.id));
		await db
			.update(schema.speakersList)
			.set({ startTimestamp: null, timeLeft: list.speakingTime, isClosed: false, phase: 'SPEECH' })
			.where(eq(schema.speakersList.id, list.id));
		await db.insert(schema.speakerOnList).values(
			codes.map((code, position) => ({
				speakersListId: list.id,
				committeeMemberId: memberId(code),
				position
			}))
		);
	}
	await db.insert(schema.spokenTimePeriod).values(
		STAGE.speeches.map(([code, endedMinutesAgo, seconds]) => {
			const end = minutesAgo(endedMinutesAgo);
			return {
				speakersListId: STAGE.commentSpeakers.includes(code as never)
					? commentList.id
					: mainList.id,
				committeeMemberId: memberId(code),
				startTimestamp: new Date(end.getTime() - seconds * 1000),
				endTimestamp: end,
				queuedAt: new Date(end.getTime() - seconds * 1000 - 8 * MINUTE),
				phase: 'SPEECH' as const
			};
		})
	);

	// Completed votes from today
	const voteNames = STAGE.votes.map((v) => v.name);
	await db
		.delete(schema.votingSession)
		.where(
			and(
				eq(schema.votingSession.committeeId, committee.id),
				inArray(schema.votingSession.voteName, [...voteNames, DEVICE_VOTE_NAME])
			)
		);
	const presentIds = [...present];
	for (const vote of STAGE.votes) {
		const pro = Math.round(presentIds.length * vote.share);
		const abstain = 3;
		const con = presentIds.length - pro - abstain;
		const [session] = await db
			.insert(schema.votingSession)
			.values({
				committeeId: committee.id,
				mode: 'ROLL_CALL',
				voteName: vote.name,
				majority: 'SIMPLE',
				withAbstentions: true,
				majorityAmount: Math.floor((pro + con) / 2) + 1,
				currentStage: 'EVALUATION',
				votesPro: pro,
				votesCon: con,
				votesAbstain: abstain,
				completedAt: minutesAgo(vote.minutesAgo),
				outcome: vote.outcome
			})
			.returning();
		await db.insert(schema.votingVote).values(
			presentIds.map((committeeMemberId, i) => ({
				votingSessionId: session.id,
				committeeMemberId,
				vote: i < pro ? ('PRO' as const) : i < pro + con ? ('CON' as const) : ('ABSTAIN' as const)
			}))
		);
	}

	// Request types and pending requests
	const existingTypes = await db
		.select()
		.from(schema.requestType)
		.where(eq(schema.requestType.conferenceId, conference.id));
	const typeIds: string[] = [];
	for (const [priority, { message, ...type }] of STAGE.requestTypes.entries()) {
		const values = { ...type, name: t ? t(message) : en[message], priority };
		const existing = existingTypes.find((e) => e.priority === priority);
		if (existing) {
			await db.update(schema.requestType).set(values).where(eq(schema.requestType.id, existing.id));
			typeIds.push(existing.id);
		} else {
			const [row] = await db
				.insert(schema.requestType)
				.values({ ...values, conferenceId: conference.id })
				.returning();
			typeIds.push(row.id);
		}
	}
	await db.delete(schema.request).where(eq(schema.request.committeeId, committee.id));
	await db.insert(schema.request).values(
		STAGE.pendingRequests.map(([code, typeIndex]) => ({
			committeeId: committee.id,
			conferenceUserId: delegateUserId(code),
			requestTypeId: typeIds[typeIndex]
		}))
	);

	// Non-state actor people with attendance codes, one of them checked into this committee
	const [icrc] = await db
		.select({ id: schema.conferenceMember.id })
		.from(schema.conferenceMember)
		.innerJoin(
			schema.representation,
			eq(schema.conferenceMember.representationId, schema.representation.id)
		)
		.where(
			and(
				eq(schema.conferenceMember.conferenceId, conference.id),
				eq(schema.representation.type, 'NSA')
			)
		);
	if (!icrc) throw new Error('Seed has no NSA conference member');
	await db.delete(schema.conferenceUser).where(
		and(
			eq(schema.conferenceUser.conferenceId, conference.id),
			inArray(
				schema.conferenceUser.userEmail,
				STAGE.nsaPeople.map((p) => p.email)
			)
		)
	);
	for (const person of STAGE.nsaPeople) {
		const [user] = await db
			.insert(schema.conferenceUser)
			.values({
				conferenceId: conference.id,
				conferenceUserType: 'NON_STATE_ACTOR',
				userEmail: person.email,
				name: person.name,
				conferenceMemberId: icrc.id,
				attendanceCode: person.code
			})
			.returning();
		if (person.checkedIn) {
			await db.insert(schema.presenceEvent).values({
				conferenceUserId: user.id,
				committeeId: committee.id,
				timestamp: minutesAgo(90),
				present: true,
				type: 'NSA_SCAN'
			});
		}
	}

	// Germany checked in this morning, for the personal statistics
	const germanyUserId = delegateUserId('DE');
	await db
		.delete(schema.presenceEvent)
		.where(eq(schema.presenceEvent.conferenceUserId, germanyUserId));
	await db.insert(schema.presenceEvent).values({
		conferenceUserId: germanyUserId,
		committeeId: committee.id,
		timestamp: minutesAgo(180),
		present: true,
		type: 'ROLL_CALL'
	});

	// Papers on the active agenda item. Germany owns and edits the working paper and
	// has a pending amendment on the paper in the amendment phase.
	const papers = await db
		.select({ id: schema.resolutionPaper.id, status: schema.resolutionPaper.status })
		.from(schema.resolutionPaper)
		.where(
			and(
				eq(schema.resolutionPaper.committeeId, committee.id),
				eq(schema.resolutionPaper.agendaItemId, agendaItemId)
			)
		);
	const paperWith = (status: (typeof papers)[number]['status']) => {
		const paper = papers.find((p) => p.status === status);
		if (!paper) throw new Error(`Seed has no ${status} paper on the active agenda item`);
		return paper.id;
	};
	const ids = {
		conferenceId: conference.id,
		committeeId: committee.id,
		workingPaperId: paperWith('WORKING_PAPER'),
		submittedPaperId: paperWith('SUBMITTED'),
		draftResolutionId: paperWith('DRAFT_RESOLUTION'),
		amendmentPhasePaperId: paperWith('AMENDMENT_PHASE'),
		votingPhasePaperId: paperWith('VOTING_PHASE')
	} satisfies StageIds;

	await db
		.update(schema.resolutionPaper)
		.set({ creatorCommitteeMemberId: memberId('DE') })
		.where(eq(schema.resolutionPaper.id, ids.workingPaperId));
	await db
		.insert(schema.paperEditor)
		.values({ paperId: ids.workingPaperId, conferenceUserId: germanyUserId })
		.onConflictDoNothing();

	const [pendingAmendment] = await db
		.select({ id: schema.amendment.id })
		.from(schema.amendment)
		.where(
			and(
				eq(schema.amendment.paperId, ids.amendmentPhasePaperId),
				eq(schema.amendment.status, 'PENDING')
			)
		);
	if (pendingAmendment) {
		await db
			.update(schema.amendment)
			.set({ proposerCommitteeMemberId: memberId('DE') })
			.where(eq(schema.amendment.id, pendingAmendment.id));
		await db
			.insert(schema.amendmentSponsor)
			.values({ amendmentId: pendingAmendment.id, committeeMemberId: memberId('DE') })
			.onConflictDoNothing();
	}

	// Statistics and Mission Control read materialized views, refreshed by the server
	// every 30 seconds. Refresh now so the screenshots don't depend on that timing.
	const { rows: views } = await db.execute<{ matviewname: string }>(
		sql`select matviewname from pg_matviews where schemaname = 'public'`
	);
	for (const { matviewname } of views) {
		await db.execute(sql.raw(`refresh materialized view "${matviewname}"`));
	}

	return ids;
}

// Per-shot setups, applied after stage() for the few shots that need extra state

const DEVICE_VOTE_NAME = 'Draft Resolution GV/I/1';

export async function setActiveDraftResolution(ids: StageIds, paperId: string) {
	await db
		.update(schema.committee)
		.set({ activeDraftResolutionId: paperId })
		.where(eq(schema.committee.id, ids.committeeId));
}

/** Starts the current speech on the main list, so its timer runs */
export async function startSpeech(ids: StageIds) {
	const [committee] = await db
		.select({ agendaItemId: schema.committee.activeAgendaItemId })
		.from(schema.committee)
		.where(eq(schema.committee.id, ids.committeeId));
	await db
		.update(schema.speakersList)
		.set({ startTimestamp: minutesAgo(0.5) })
		.where(
			and(
				eq(schema.speakersList.agendaItemId, committee.agendaItemId!),
				eq(schema.speakersList.type, 'SPEAKERS_LIST')
			)
		);
}

/** A device-based vote that stays open long enough for all captures */
export async function startDeviceVote(ids: StageIds) {
	const [session] = await db
		.insert(schema.votingSession)
		.values({
			committeeId: ids.committeeId,
			mode: 'DEVICE_BASED',
			voteName: DEVICE_VOTE_NAME,
			majority: 'SIMPLE',
			withAbstentions: true,
			majorityAmount: 1,
			currentStage: 'PRO',
			deviceVotingStartedAt: new Date(),
			deviceVotingWindowSeconds: 600
		})
		.returning();
	await db
		.update(schema.committee)
		.set({ activeVotingSessionId: session.id })
		.where(eq(schema.committee.id, ids.committeeId));
}

if (import.meta.main) {
	console.info(JSON.stringify(await stage()));
	process.exit(0);
}
