import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { eq, inArray } from 'drizzle-orm';
import { basics } from './basics';
import { isGlobalAdmin } from '$api/services/isAdminEmail';
import { assertConferenceAdmin } from './conferenceUser';
import { assertCommitteeChairOrAdmin } from './resolutionPaper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

const { arg, ref, pubsub, table } = basics('committeeMember');

abilityBuilder.committeeMember.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.committeeMember.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

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

				if (!committee) {
					throw new GraphQLError('Committee not found');
				}

				await assertConferenceAdmin(ctx, committee.conferenceId);

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
							ctx.abilities.committeeMember.filter('read', {
								inject: {
									where: { id: result.id }
								}
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
			resolve: async (root, args, ctx, info) => {
				const committeeMember = await db.query.committeeMember.findFirst({
					where: { id: args.id },
					with: { committee: true }
				});

				if (!committeeMember) {
					throw new GraphQLError('Committee member not found');
				}

				await assertConferenceAdmin(ctx, committeeMember.committee.conferenceId);

				await db.delete(schema.committeeMember).where(eq(schema.committeeMember.id, args.id));

				pubsub.removed(args.id);

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
				// Look up committee for the given members and verify chair/admin access
				const members = await db.query.committeeMember.findMany({
					where: { id: { in: args.ids } },
					columns: { committeeId: true }
				});
				const committeeIds = [...new Set(members.map((m) => m.committeeId))];
				for (const committeeId of committeeIds) {
					await assertCommitteeChairOrAdmin(ctx, committeeId);
				}

				const res = await db
					.update(table)
					.set({
						present: args.present
					})
					.where(inArray(table.id, args.ids))
					.returning({
						id: table.id
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
						ctx.abilities.committeeMember.filter('read', {
							inject: {
								where: {
									id: {
										in: args.ids
									}
								}
							}
						}).query.single
					)
				);
			}
		})
	};
});
