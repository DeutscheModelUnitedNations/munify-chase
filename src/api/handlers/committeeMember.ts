import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { assertCommitteeChairOrAdmin, assertConferenceAdmin, isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

abilityBuilder.committeeMember.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.committeeMember.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

abilityBuilder.committeeMember.allow(['update']).when((ctx) => {
	return {
		where: {
			committee: {
				...assertCommitteeChairOrAdmin(ctx)
			}
		}
	};
});

abilityBuilder.committeeMember.allow(['delete']).when((async (ctx: any) => {
	return { where: { committee: { conference: { ...await assertConferenceAdmin(ctx) } } } };
}) as any);

const ref = object({ table: 'committeeMember' });
const pubsub = rumblePubsub({ table: 'committeeMember' });
query({ table: 'committeeMember' });

schemaBuilder.mutationFields((t) => {
	return {
		createCommitteeMember: t.drizzleField({
			type: ref,
			args: {
				committeeId: t.arg.id({ required: true }),
				representationId: t.arg.id({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				const committee = await db.query.committee.findFirst({
					where: { id: args.committeeId }
				});
				if (!committee) throw new GraphQLError('Committee not found');

				await db.query.conference
					.findFirst(
						ctx.abilities.conference
							.filter('update')
							.merge({ where: { id: committee.conferenceId } }).query.single
					)
					.then(assertFindFirstExists);

				const result = await db
					.insert(schema.committeeMember)
					.values({
						committeeId: args.committeeId,
						representationId: args.representationId
					})
					.returning()
					.then(assertFirstEntryExists);

				pubsub.updated(result.id);

				return db.query.committeeMember
					.findFirst(
						query(
							ctx.abilities.committeeMember.filter('read').merge({
								where: { id: result.id }
							}).query.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),

		deleteCommitteeMember: t.field({
			type: 'Boolean',
			args: {
				id: t.arg.id({ required: true })
			},
			resolve: async (root, args, ctx) => {
				await db.delete(schema.committeeMember).where(
					ctx.abilities.committeeMember.filter('delete').merge({ where: { id: args.id } }).sql.where
				);

				pubsub.removed();

				return true;
			}
		}),

		setPresenceForCommitteeMembers: t.drizzleField({
			type: [ref],
			args: {
				ids: t.arg.idList({ required: true }),
				present: t.arg.boolean({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				const res = await db
					.update(schema.committeeMember)
					.set({
						present: args.present
					})
					.where(
						ctx.abilities.committeeMember
							.filter('update')
							.merge({ where: { id: { in: args.ids } } }).sql.where
					)
					.returning({
						id: schema.committeeMember.id
					});

				if (res.length > 0) {
					await db.insert(schema.presenceChangedTimestamp).values(
						res.map((committeeMember) => ({
							committeeMemberId: committeeMember.id,
							presentSetTo: args.present,
							timestamp: new Date()
						}))
					);
				}

				pubsub.updated(args.ids);

				return db.query.committeeMember.findMany(
					query(
						ctx.abilities.committeeMember.filter('read').merge({
							where: {
								id: {
									in: args.ids
								}
							}
						}).query.single
					)
				);
			}
		})
	};
});
