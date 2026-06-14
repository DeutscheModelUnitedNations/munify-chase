import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '$api/rumble';
import { isTeamInConference, isParticipantInConference } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';

abilityBuilder.votingSession.allow('read').when((ctx) => ({
	where: { committee: isParticipantInConference(ctx) }
}));

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

schemaBuilder.mutationFields((t) => ({
	startVotingSession: t.drizzleField({
		type: sessionRef,
		args: {
			id: t.arg.id(),
			committeeId: t.arg.id({ required: true }),
			mode: t.arg({ type: modeEnum, required: true }),
			majority: t.arg({ type: majorityEnum, required: true }),
			majorityAmount: t.arg.int({ required: true }),
			withAbstentions: t.arg.boolean({ required: true }),
			voteName: t.arg.string(),
			currentStage: t.arg({ type: stageEnum })
		},
		resolve: async (q, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			const committee = await db.query.committee
				.findFirst(
					ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).query
						.single
				)
				.then(assertFindFirstExists);

			// Resume existing active session if one is already running, identified by
			// the committee's `activeVotingSessionId` (the single source of truth).
			if (committee.activeVotingSessionId) {
				return db.query.votingSession
					.findFirst(
						q(
							ctx.abilities.votingSession
								.filter('read')
								.merge({ where: { id: committee.activeVotingSessionId } }).query.single
						)
					)
					.then(assertFindFirstExists);
			}

			const startedBy = await db.query.conferenceUser.findFirst({
				where: {
					userEmail: ctx.mustBeLoggedIn().email!,
					conferenceId: committee.conferenceId
				}
			});

			const result = await db.transaction(async (tx) => {
				const inserted = await tx
					.insert(schema.votingSession)
					.values({
						id: entityId,
						committeeId: args.committeeId,
						startedByConferenceUserId: startedBy?.id ?? null,
						mode: args.mode,
						majority: args.majority,
						majorityAmount: args.majorityAmount,
						withAbstentions: args.withAbstentions,
						voteName: args.voteName ?? null,
						currentStage: args.currentStage ?? (args.mode === 'SHOW_OF_HANDS' ? 'PRO' : null)
					})
					.returning()
					.then(assertFirstEntryExists);
				await tx
					.update(schema.committee)
					.set({ activeVotingSessionId: inserted.id })
					.where(eq(schema.committee.id, args.committeeId));
				return inserted;
			});

			sessionPubsub.created();
			sessionPubsub.updated(result.id);
			committeePubsub.updated(args.committeeId);

			return db.query.votingSession
				.findFirst(
					q(
						ctx.abilities.votingSession.filter('read').merge({ where: { id: result.id } }).query
							.single
					)
				)
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
			const updateSet: Record<string, unknown> = {};
			if (args.currentStage != null) updateSet.currentStage = args.currentStage;
			if (args.votesPro != null) updateSet.votesPro = args.votesPro;
			if (args.votesCon != null) updateSet.votesCon = args.votesCon;
			if (args.votesAbstain != null) updateSet.votesAbstain = args.votesAbstain;
			if (args.currentMemberIndex != null) updateSet.currentMemberIndex = args.currentMemberIndex;

			if (Object.keys(updateSet).length > 0) {
				await db
					.update(schema.votingSession)
					.set(updateSet)
					.where(
						ctx.abilities.votingSession.filter('update').merge({ where: { id: args.id } }).sql.where
					);
			}

			sessionPubsub.updated(args.id);

			return db.query.votingSession
				.findFirst(
					q(
						ctx.abilities.votingSession.filter('read').merge({ where: { id: args.id } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	setVoteForMember: t.drizzleField({
		type: voteRef,
		args: {
			id: t.arg.id(),
			sessionId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id({ required: true }),
			vote: t.arg({ type: voteChoiceEnum, required: true })
		},
		resolve: async (q, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			const resultId = await db.transaction(async (tx) => {
				const session = await tx.query.votingSession.findFirst({
					where: { id: args.sessionId, completedAt: { isNull: true } }
				});
				if (!session) throw new GraphQLError('Voting session not found or already completed');
				// Defense in depth: only accept votes for the session the committee is
				// currently actively running. Prevents stale clients from writing votes
				// against a session that's been superseded.
				const committee = await tx.query.committee.findFirst({
					where: { id: session.committeeId }
				});
				if (committee?.activeVotingSessionId !== args.sessionId) {
					throw new GraphQLError('Voting session is not the active session for this committee');
				}

				// Upsert: update if exists, insert if not
				const existing = await tx.query.votingVote.findFirst({
					where: {
						votingSessionId: args.sessionId,
						committeeMemberId: args.committeeMemberId
					}
				});

				if (existing) {
					await tx
						.update(schema.votingVote)
						.set({ vote: args.vote })
						.where(eq(schema.votingVote.id, existing.id));
					return existing.id;
				}

				const inserted = await tx
					.insert(schema.votingVote)
					.values({
						id: entityId,
						votingSessionId: args.sessionId,
						committeeMemberId: args.committeeMemberId,
						vote: args.vote
					})
					.returning({ id: schema.votingVote.id })
					.then(assertFirstEntryExists);

				return inserted.id;
			});

			sessionPubsub.updated(args.sessionId);
			votePubsub.updated(resultId);

			return db.query.votingVote
				.findFirst(
					q(ctx.abilities.votingVote.filter('read').merge({ where: { id: resultId } }).query.single)
				)
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
			const session = await db.query.votingSession
				.findFirst(
					ctx.abilities.votingSession.filter('update').merge({ where: { id: args.id } }).query
						.single
				)
				.then(assertFindFirstExists);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.votingSession)
					.set({ completedAt: new Date(), outcome: args.outcome ?? null })
					.where(
						ctx.abilities.votingSession.filter('update').merge({ where: { id: args.id } }).sql.where
					);
				await tx
					.update(schema.committee)
					.set({ activeVotingSessionId: null })
					.where(eq(schema.committee.id, session.committeeId));
			});

			sessionPubsub.updated(args.id);
			sessionPubsub.removed();
			committeePubsub.updated(session.committeeId);

			return true;
		}
	})
}));
