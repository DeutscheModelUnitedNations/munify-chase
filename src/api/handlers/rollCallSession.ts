import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isTeamInConference, isParticipantInConference } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.rollCallSession.allow('read').when((ctx) => ({
	where: { committee: isParticipantInConference(ctx) }
}));

abilityBuilder.rollCallSession.allow('update').when((ctx) => ({
	where: { committee: isTeamInConference(ctx) }
}));

const ref = object({ table: 'rollCallSession' });
const pubsub = rumblePubsub({ table: 'rollCallSession' });
// committee.activeRollCallSessionId is now the source of truth for "is a roll call
// happening?", so every start/complete must republish the committee record too.
const committeePubsub = rumblePubsub({ table: 'committee' });
query({ table: 'rollCallSession' });

schemaBuilder.mutationFields((t) => {
	return {
		startRollCallSession: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id(),
				committeeId: t.arg.id({ required: true })
			},
			resolve: async (q, _root, args, ctx) => {
				if (args.id != null && !isValidNanoid(args.id)) {
					throw new GraphQLError('Invalid ID format');
				}
				const entityId = args.id ?? nanoid();

				const committee = await db.query.committee
					.findFirst(
						ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } })
							.query.single
					)
					.then(assertFindFirstExists);

				// Resume an already-active session if one is referenced. This is the
				// single source of truth — no need to scan rollCallSession for null
				// completedAt anymore, the FK on the committee tells us directly.
				if (committee.activeRollCallSessionId) {
					return db.query.rollCallSession
						.findFirst(
							q(
								ctx.abilities.rollCallSession
									.filter('read')
									.merge({ where: { id: committee.activeRollCallSessionId } }).query.single
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
						.insert(schema.rollCallSession)
						.values({
							id: entityId,
							committeeId: args.committeeId,
							startedByConferenceUserId: startedBy?.id ?? null,
							currentMemberIndex: 0
						})
						.returning()
						.then(assertFirstEntryExists);
					await tx
						.update(schema.committee)
						.set({ activeRollCallSessionId: inserted.id })
						.where(eq(schema.committee.id, args.committeeId));
					return inserted;
				});

				pubsub.created();
				pubsub.updated(result.id);
				committeePubsub.updated(args.committeeId);

				return db.query.rollCallSession
					.findFirst(
						q(
							ctx.abilities.rollCallSession.filter('read').merge({ where: { id: result.id } }).query
								.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),

		setRollCallSessionIndex: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true }),
				currentMemberIndex: t.arg.int({ required: true })
			},
			resolve: async (q, _root, args, ctx) => {
				await db
					.update(schema.rollCallSession)
					.set({ currentMemberIndex: args.currentMemberIndex })
					.where(
						ctx.abilities.rollCallSession.filter('update').merge({ where: { id: args.id } }).sql
							.where
					);

				pubsub.updated(args.id);

				return db.query.rollCallSession
					.findFirst(
						q(
							ctx.abilities.rollCallSession.filter('read').merge({ where: { id: args.id } }).query
								.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),

		completeRollCallSession: t.field({
			type: 'Boolean',
			args: {
				id: t.arg.id({ required: true })
			},
			resolve: async (_root, args, ctx) => {
				// Look up the committee whose `activeRollCallSessionId` points at us so
				// we can clear it in the same transaction. Reading via the session row
				// keeps the ability scope check intact.
				const session = await db.query.rollCallSession
					.findFirst(
						ctx.abilities.rollCallSession.filter('update').merge({ where: { id: args.id } }).query
							.single
					)
					.then(assertFindFirstExists);

				await db.transaction(async (tx) => {
					await tx
						.update(schema.rollCallSession)
						.set({ completedAt: new Date() })
						.where(
							ctx.abilities.rollCallSession.filter('update').merge({ where: { id: args.id } }).sql
								.where
						);
					await tx
						.update(schema.committee)
						.set({ activeRollCallSessionId: null })
						.where(eq(schema.committee.id, session.committeeId));
				});

				pubsub.updated(args.id);
				pubsub.removed();
				committeePubsub.updated(session.committeeId);

				return true;
			}
		})
	};
});
