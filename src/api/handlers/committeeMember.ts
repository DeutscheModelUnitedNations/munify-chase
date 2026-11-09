import { db, schema } from '#api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '#api/rumble';
import {
	isAdminInConference,
	isParticipantInConference,
	isTeamInConference,
	linkedDelegator,
	SYNCED_CONFERENCE
} from '#api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { NOT_MANAGED_BY_DELEGATOR } from '#api/services/link/managedRows';
import { findUpdatableConference, type Transaction } from './helpers/scopedLookups';
import { presenceEventsFor } from './helpers/rollCallPresence';

// The linked DELEGATOR reads back the presence of its conferences (`docs/plans/delegator-link.md`).
abilityBuilder.committeeMember.allow('read').when(
	linkedDelegator({
		where: { committee: { conference: SYNCED_CONFERENCE } },
		columns: { id: true, committeeId: true, representationId: true }
	})
);

abilityBuilder.committeeMember.allow('read').when((ctx) => {
	return {
		where: {
			committee: isParticipantInConference(ctx)
		}
	};
});

abilityBuilder.committeeMember.allow('update').when((ctx) => {
	return {
		where: {
			committee: isTeamInConference(ctx)
		}
	};
});

abilityBuilder.committeeMember.allow('delete').when((ctx) => {
	// a seat synced from a linked DELEGATOR is removed there
	return { where: { committee: isAdminInConference(ctx), ...NOT_MANAGED_BY_DELEGATOR } };
});

const ref = object({ table: 'committeeMember' });
const pubsub = rumblePubsub({ table: 'committeeMember' });
query({ table: 'committeeMember' });

/** Presence is only taken in a roll call that is still running. */
async function assertOpenRollCall(tx: Transaction, rollCallSessionId: string | null | undefined) {
	if (!rollCallSessionId) return;
	const session = await tx.query.rollCallSession.findFirst({
		where: { id: rollCallSessionId, completedAt: { isNull: true } }
	});
	if (!session) throw new GraphQLError('Roll call session not found or already completed');
}

/** Records the presence change of the seats people hold. */
async function recordPresenceEvents({
	tx,
	updated,
	rollCallSessionId,
	present
}: {
	tx: Transaction;
	updated: { id: string; committeeId: string }[];
	rollCallSessionId: string | null | undefined;
	present: boolean;
}) {
	if (updated.length === 0) return;
	const conferenceUsers = await tx.query.conferenceUser.findMany({
		where: { committeeMemberId: { in: updated.map((cm) => cm.id) } }
	});
	const events = presenceEventsFor({
		updated,
		conferenceUsers,
		rollCallSessionId,
		present,
		now: new Date()
	});
	if (events.length > 0) await tx.insert(schema.presenceEvent).values(events);
}

schemaBuilder.mutationFields((t) => {
	return {
		createCommitteeMember: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id().validate(nanoidValidation),
				committeeId: t.arg.id({ required: true }),
				representationId: t.arg.id({ required: true })
			},
			resolve: async (query, _root, args, ctx) => {
				const committee = await db.query.committee.findFirst({
					where: { id: args.committeeId }
				});
				if (!committee) throw new GraphQLError('Committee not found');

				await findUpdatableConference(ctx, committee.conferenceId);

				const result = await db
					.insert(schema.committeeMember)
					.values({
						id: args.id,
						committeeId: args.committeeId,
						representationId: args.representationId
					})
					.returning()
					.then(assertFirstEntryExists);

				pubsub.updated(result.id);

				return db.query.committeeMember
					.findFirst(
						query(
							(await ctx.abilities.committeeMember.filter('read')).merge({
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
			resolve: async (_root, args, ctx) => {
				await db
					.delete(schema.committeeMember)
					.where(
						(await ctx.abilities.committeeMember.filter('delete')).merge({ where: { id: args.id } })
							.sql.where
					);

				pubsub.removed();

				return true;
			}
		}),
		setPresenceForCommitteeMembers: t.drizzleField({
			type: [ref],
			args: {
				ids: t.arg.idList({ required: true }),
				present: t.arg.boolean({ required: true }),
				rollCallSessionId: t.arg.id({ required: false })
			},
			resolve: async (query, _root, args, ctx) => {
				await db.transaction(async (tx) => {
					await assertOpenRollCall(tx, args.rollCallSessionId);

					const updated = await tx
						.update(schema.committeeMember)
						.set({ present: args.present })
						.where(
							(await ctx.abilities.committeeMember.filter('update')).merge({
								where: { id: { in: args.ids } }
							}).sql.where
						)
						.returning({
							id: schema.committeeMember.id,
							committeeId: schema.committeeMember.committeeId
						});

					await recordPresenceEvents({
						tx,
						updated,
						rollCallSessionId: args.rollCallSessionId,
						present: args.present
					});
				});

				pubsub.updated(args.ids);

				return db.query.committeeMember.findMany(
					query(
						(await ctx.abilities.committeeMember.filter('read')).merge({
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
