import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isTeamInConference, isParticipantInConference } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { and, eq, isNull } from 'drizzle-orm';
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

				// Return the existing active session if one is already running so the
				// chair can resume after a page reload without losing their position.
				const [existing] = await db
					.select({ id: schema.rollCallSession.id })
					.from(schema.rollCallSession)
					.where(
						and(
							eq(schema.rollCallSession.committeeId, args.committeeId),
							isNull(schema.rollCallSession.completedAt)
						)
					)
					.limit(1);

				if (existing) {
					return db.query.rollCallSession
						.findFirst(
							q(
								ctx.abilities.rollCallSession.filter('read').merge({ where: { id: existing.id } })
									.query.single
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

				const result = await db
					.insert(schema.rollCallSession)
					.values({
						id: entityId,
						committeeId: args.committeeId,
						startedByConferenceUserId: startedBy?.id ?? null,
						currentMemberIndex: 0
					})
					.returning()
					.then(assertFirstEntryExists);

				pubsub.created();
				pubsub.updated(result.id);

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
				await db
					.update(schema.rollCallSession)
					.set({ completedAt: new Date() })
					.where(
						ctx.abilities.rollCallSession.filter('update').merge({ where: { id: args.id } }).sql
							.where
					);

				pubsub.updated(args.id);
				pubsub.removed();

				return true;
			}
		})
	};
});
