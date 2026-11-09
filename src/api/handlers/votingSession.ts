import { db, schema } from '#api/db/db';
import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '#api/rumble';
import {
	isTeamInConference,
	isParticipantInConference,
	linkedDelegator,
	SYNCED_CONFERENCE
} from '#api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { nanoidValidation } from '#lib/helpers/nanoid';
import {
	findOwnConferenceUser,
	findUpdatableCommittee,
	type HandlerContext,
	type Transaction
} from './helpers/scopedLookups';
import { setActiveSession } from './helpers/committeeSessions';
import { givenFields, hasFields } from './helpers/givenFields';
import {
	assertActiveSession,
	assertDeviceWindowOpen,
	deviceVoterSeat,
	votingSessionStart
} from './helpers/votingRules';

abilityBuilder.votingSession.allow('read').when((ctx) => ({
	where: { committee: isParticipantInConference(ctx) }
}));

// The outcome of the vote that concluded a paper, for the linked DELEGATOR (`docs/plans/delegator-link.md`).
abilityBuilder.votingSession.allow('read').when(
	linkedDelegator({
		where: { committee: { conference: SYNCED_CONFERENCE } },
		columns: { id: true, committeeId: true, outcome: true, completedAt: true }
	})
);

abilityBuilder.votingSession.allow('update').when((ctx) => ({
	where: { committee: isTeamInConference(ctx) }
}));

abilityBuilder.votingVote.allow('read').when((ctx) => ({
	where: { votingSession: { committee: isParticipantInConference(ctx) } }
}));

abilityBuilder.votingVote.allow('update').when((ctx) => ({
	where: { votingSession: { committee: isTeamInConference(ctx) } }
}));

const sessionRef = object({ table: 'votingSession' });
const voteRef = object({ table: 'votingVote' });

const sessionPubsub = rumblePubsub({ table: 'votingSession' });
const votePubsub = rumblePubsub({ table: 'votingVote' });
// committee.activeVotingSessionId is now the source of truth for "is a vote running?"
// so start/complete must republish the committee record too.
const committeePubsub = rumblePubsub({ table: 'committee' });

query({ table: 'votingSession' });
query({ table: 'votingVote' });

const modeEnum = enum_({ tsName: 'votingMode' });
const majorityEnum = enum_({ tsName: 'votingMajorityType' });
const stageEnum = enum_({ tsName: 'votingStage' });
const outcomeEnum = enum_({ tsName: 'votingOutcome' });
const voteChoiceEnum = enum_({ tsName: 'voteChoice' });

async function readableSession(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.votingSession.filter('read')).merge({ where: { id } }).query.single;
}

async function readableVote(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.votingVote.filter('read')).merge({ where: { id } }).query.single;
}

/** A session still open and the one its committee is running; anything else takes no votes. */
async function findActiveSession(tx: Transaction, sessionId: string) {
	const session = await tx.query.votingSession.findFirst({
		where: { id: sessionId, completedAt: { isNull: true } }
	});
	if (!session) throw new GraphQLError('Voting session not found or already completed');
	const committee = await tx.query.committee.findFirst({ where: { id: session.committeeId } });
	assertActiveSession({ activeVotingSessionId: committee?.activeVotingSessionId, sessionId });
	return session;
}

/** Records a seat's vote, replacing the one it cast before. Returns the vote's id. */
async function upsertVote({
	tx,
	id,
	sessionId,
	committeeMemberId,
	vote
}: {
	tx: Transaction;
	id: string | undefined;
	sessionId: string;
	committeeMemberId: string;
	vote: typeof schema.votingVote.$inferInsert.vote;
}) {
	const existing = await tx.query.votingVote.findFirst({
		where: { votingSessionId: sessionId, committeeMemberId }
	});
	if (existing) {
		await tx.update(schema.votingVote).set({ vote }).where(eq(schema.votingVote.id, existing.id));
		return existing.id;
	}
	const inserted = await tx
		.insert(schema.votingVote)
		.values({ id, votingSessionId: sessionId, committeeMemberId, vote })
		.returning({ id: schema.votingVote.id })
		.then(assertFirstEntryExists);
	return inserted.id;
}

/** The caller's own seat, the only one a device vote may be cast for. */
async function ownDeviceSeat({
	tx,
	email,
	committeeId
}: {
	tx: Transaction;
	email: string;
	committeeId: string;
}) {
	// Never trust a client-supplied committeeMemberId here: resolve the caller's own seat
	// server-side so a delegate can only vote for themselves. Mirrors selfAddToSpeakersList's
	// conferenceUser lookup.
	const conferenceUser = await tx.query.conferenceUser
		.findFirst({
			where: { userEmail: email, conference: { committees: { id: committeeId } } },
			with: { committeeMember: true }
		})
		.then(assertFindFirstExists);
	return deviceVoterSeat({ conferenceUser, committeeId });
}

schemaBuilder.mutationFields((t) => ({
	startVotingSession: t.drizzleField({
		type: sessionRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			committeeId: t.arg.id({ required: true }),
			mode: t.arg({ type: modeEnum, required: true }),
			majority: t.arg({ type: majorityEnum, required: true }),
			majorityAmount: t.arg.int({ required: true }),
			withAbstentions: t.arg.boolean({ required: true }),
			voteName: t.arg.string(),
			currentStage: t.arg({ type: stageEnum }),
			deviceVotingWindowSeconds: t.arg.int()
		},
		resolve: async (q, _root, args, ctx) => {
			const committee = await findUpdatableCommittee(ctx, args.committeeId);

			// Resume the session the committee is already running (its `activeVotingSessionId` is
			// the single source of truth).
			if (committee.activeVotingSessionId) {
				return db.query.votingSession
					.findFirst(q(await readableSession(ctx, committee.activeVotingSessionId)))
					.then(assertFindFirstExists);
			}

			const startedBy = await findOwnConferenceUser(ctx, committee.conferenceId);

			const result = await db.transaction(async (tx) => {
				const inserted = await tx
					.insert(schema.votingSession)
					.values({
						id: args.id,
						committeeId: args.committeeId,
						startedByConferenceUserId: startedBy?.id ?? null,
						mode: args.mode,
						majority: args.majority,
						majorityAmount: args.majorityAmount,
						withAbstentions: args.withAbstentions,
						voteName: args.voteName ?? null,
						...votingSessionStart({ ...args, now: new Date() })
					})
					.returning()
					.then(assertFirstEntryExists);
				await setActiveSession({
					tx,
					committeeId: args.committeeId,
					active: { activeVotingSessionId: inserted.id }
				});
				return inserted;
			});

			sessionPubsub.created();
			sessionPubsub.updated(result.id);
			committeePubsub.updated(args.committeeId);

			return db.query.votingSession
				.findFirst(q(await readableSession(ctx, result.id)))
				.then(assertFindFirstExists);
		}
	}),

	updateVotingSession: t.drizzleField({
		type: sessionRef,
		args: {
			id: t.arg.id({ required: true }),
			currentStage: t.arg({ type: stageEnum }),
			votesPro: t.arg.int(),
			votesCon: t.arg.int(),
			votesAbstain: t.arg.int(),
			currentMemberIndex: t.arg.int()
		},
		resolve: async (q, _root, args, ctx) => {
			const updateSet = givenFields({
				args,
				keys: ['currentStage', 'votesPro', 'votesCon', 'votesAbstain', 'currentMemberIndex']
			});

			if (hasFields(updateSet)) {
				await db
					.update(schema.votingSession)
					.set(updateSet)
					.where(
						(await ctx.abilities.votingSession.filter('update')).merge({ where: { id: args.id } })
							.sql.where
					);
			}

			sessionPubsub.updated(args.id);

			return db.query.votingSession
				.findFirst(q(await readableSession(ctx, args.id)))
				.then(assertFindFirstExists);
		}
	}),

	setVoteForMember: t.drizzleField({
		type: voteRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			sessionId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id({ required: true }),
			vote: t.arg({ type: voteChoiceEnum, required: true })
		},
		resolve: async (q, _root, args, ctx) => {
			const resultId = await db.transaction(async (tx) => {
				// Defense in depth: only accept votes for the session the committee is currently
				// running, so stale clients cannot write votes into a superseded session.
				await findActiveSession(tx, args.sessionId);
				return upsertVote({ tx, ...args });
			});

			sessionPubsub.updated(args.sessionId);
			votePubsub.updated(resultId);

			return db.query.votingVote
				.findFirst(q(await readableVote(ctx, resultId)))
				.then(assertFindFirstExists);
		}
	}),

	castDeviceVote: t.drizzleField({
		type: voteRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			sessionId: t.arg.id({ required: true }),
			vote: t.arg({ type: voteChoiceEnum, required: true }),
			// Cache hint only — the caller's committeeMemberId is always resolved
			// server-side below and this value is never read here. It exists so the
			// offline-first client can key its optimistic cache entity/list updates
			// without waiting for a round trip; a spoofed value has no effect since
			// it's ignored for authorization and never written to the database.
			committeeMemberId: t.arg.id()
		},
		resolve: async (q, _root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();
			if (!user.email) {
				throw new GraphQLError('User email is required');
			}
			const email = user.email;

			const resultId = await db.transaction(async (tx) => {
				const session = await findActiveSession(tx, args.sessionId);
				assertDeviceWindowOpen({ session, now: Date.now() });
				const committeeMemberId = await ownDeviceSeat({
					tx,
					email,
					committeeId: session.committeeId
				});
				return upsertVote({
					tx,
					id: args.id,
					sessionId: args.sessionId,
					committeeMemberId,
					vote: args.vote
				});
			});

			sessionPubsub.updated(args.sessionId);
			votePubsub.updated(resultId);

			return db.query.votingVote
				.findFirst(q(await readableVote(ctx, resultId)))
				.then(assertFindFirstExists);
		}
	}),

	completeVotingSession: t.field({
		type: 'Boolean',
		args: {
			id: t.arg.id({ required: true }),
			outcome: t.arg({ type: outcomeEnum })
		},
		resolve: async (_root, args, ctx) => {
			// Locate the committee so we can clear its `activeVotingSessionId` in
			// the same transaction. Reading through the session row preserves the
			// ability scope check.
			const sessionFilter = (await ctx.abilities.votingSession.filter('update')).merge({
				where: { id: args.id }
			});
			const session = await db.query.votingSession
				.findFirst(sessionFilter.query.single)
				.then(assertFindFirstExists);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.votingSession)
					.set({ completedAt: new Date(), outcome: args.outcome ?? null })
					.where(sessionFilter.sql.where);
				await setActiveSession({
					tx,
					committeeId: session.committeeId,
					active: { activeVotingSessionId: null }
				});
			});

			sessionPubsub.updated(args.id);
			sessionPubsub.removed();
			committeePubsub.updated(session.committeeId);

			return true;
		}
	})
}));
