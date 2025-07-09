import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { GraphQLError } from 'graphql';
import { basics } from './basics';
import { db, schema } from '$api/db/db';
import { and, count, eq, gt, gte, sql } from 'drizzle-orm';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { SpeakersListRef } from './speakersList';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';

const { arg, ref, pubsub, table } = basics('speakerOnList');

export const SpeakerOnListRef = ref;
export const SpeakerOnWhereArgs = arg;

// TODO: These could use some validation for the position values. E.g. only allow positons
// which are in bounds and so on

abilityBuilder.speakerOnList.allow(['read', 'update', 'delete']).when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

schemaBuilder.mutationFields((t) => {
	return {
		updateSpeakerOnList: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true }),
				overwriteName: t.arg.string()
			},
			resolve: async (query, _root, args, ctx, _info) => {
				const updated = await db
					.update(table)
					.set({
						overwriteName: args.overwriteName ? args.overwriteName : null
					})
					.where(
						and(
							eq(schema.speakerOnList.id, args.id),
							ctx.abilities.speakerOnList.filter('update').sql.where
						)
					)
					.returning()
					.then(assertFirstEntryExists);

				pubsub.updated(args.id);

				return db.query.speakerOnList
					.findFirst(
						query(
							ctx.abilities.speakerOnList.filter('read', {
								inject: { where: { id: updated.id } }
							}).query.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),
		addSpeakerOnList: t.drizzleField({
			type: ref,
			args: {
				//TOOD do we need the userId here?
				//TOOD do we need the reference by nation here?
				committeeMemberId: t.arg.id(),
				conferenceMemberId: t.arg.id(),
				speakersListId: t.arg.id({ required: true }),
				position: t.arg.int()
			},
			resolve: async (query, root, args, ctx, info) => {
				if (args.committeeMemberId && args.conferenceMemberId) {
					throw new GraphQLError('Cannot set both committeeMemberId and conferenceMemberId');
				}

				if (!args.committeeMemberId && !args.conferenceMemberId) {
					throw new GraphQLError('Must set either committeeMemberId or conferenceMemberId');
				}

				const createdId = await db.transaction(async (tx) => {
					let position = args.position;
					if (!position) {
						// in case the caller did not provide a position, just append as last entry
						position = (
							await tx
								.select({ count: count() })
								.from(table)
								.where(eq(table.speakersListId, args.speakersListId))
								.then(assertFirstEntryExists)
						).count; // since the position is 0 based, we can just use the count as new position
					} else {
						// if they did provide a position, we want to shift all the entries up which are
						// equal or higher in position
						await tx
							.update(table)
							.set({
								position: sql`${table.position} + 1`
							})
							.where(
								and(
									eq(table.speakersListId, args.speakersListId),
									gte(table.position, position),
									ctx.abilities.speakerOnList.filter('update').sql.where
								)
							);
					}

					// we do query this for checking the required permissions
					const speakersList = await tx.query.speakersList
						.findFirst(
							ctx.abilities.speakersList.filter('update', {
								inject: { where: { id: args.speakersListId } }
							}).query.single
						)
						.then(assertFindFirstExists);

					const created = await tx
						.insert(table)
						.values({
							committeeMemberId: args.committeeMemberId,
							conferenceMemberId: args.conferenceMemberId,
							speakersListId: speakersList.id,
							position
						})
						.returning({ id: table.id })
						.then(assertFirstEntryExists);

					return created.id;
				});
				pubsub.created();

				return db.query.speakerOnList
					.findFirst(
						query(
							ctx.abilities.speakerOnList.filter('read', {
								inject: { where: { id: createdId } }
							}).query.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),
		removeSpeakerOnList: t.drizzleField({
			type: SpeakersListRef,
			args: {
				//TOOD do we need the userId here?
				//TOOD do we need the reference by nation here?
				speakerOnListId: t.arg.id({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				const removed = await db.transaction(async (tx) => {
					const deleted = await tx
						.delete(table)
						.where(
							and(
								eq(table.id, args.speakerOnListId),
								ctx.abilities.speakerOnList.filter('delete').sql.where
							)
						)
						.returning()
						.then(assertFirstEntryExists);

					const aboutToBeShiftedDown = await tx.query.speakerOnList.findMany({
						where: {
							speakersListId: deleted.speakersListId,
							position: {
								gt: deleted.position
							}
						},
						orderBy: { position: 'asc' }
					});

					for (const speaker of aboutToBeShiftedDown) {
						await tx
							.update(table)
							.set({
								position: sql`${table.position} - 1`
							})
							.where(eq(table.id, speaker.id));
					}

					return deleted;
				});
				pubsub.removed(removed.id);

				return db.query.speakersList
					.findFirst(
						query(
							ctx.abilities.speakersList.filter('read', {
								inject: { where: { id: removed.speakersListId } }
							}).query.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),
		moveSpeakerToPosition: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true }),
				position: t.arg.int({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				if (args.position < 0) {
					throw new GraphQLError('Position must be a non-negative integer');
				}
				const updatedEntityIds = await db.transaction(async (tx) => {
					const aboutToMoveSpeakerOnList = await tx.query.speakerOnList
						.findFirst(
							ctx.abilities.speakerOnList.filter('update', { inject: { where: { id: args.id } } })
								.query.single
						)
						.then(assertFindFirstExists);
					if (args.position === aboutToMoveSpeakerOnList.position) {
						throw new GraphQLError('Cannot move to the same position');
					}

					await tx
						.update(table)
						.set({
							position: -1
						})
						.where(eq(table.id, aboutToMoveSpeakerOnList.id));

					const updatedEntityIds = [aboutToMoveSpeakerOnList.id];

					if (args.position > aboutToMoveSpeakerOnList.position) {
						const toUpdate = await tx.query.speakerOnList.findMany({
							where: {
								AND: [
									{
										position: {
											gt: aboutToMoveSpeakerOnList.position,
											lte: args.position
										}
									},
									{
										speakersListId: aboutToMoveSpeakerOnList.speakersListId
									}
								]
							},
							orderBy: {
								position: 'asc'
							}
						});

						for (const entry of toUpdate) {
							await tx
								.update(table)
								.set({
									position: sql`${table.position} - 1`
								})
								.where(eq(table.id, entry.id));

							updatedEntityIds.push(entry.id);
						}
					} else if (args.position < aboutToMoveSpeakerOnList.position) {
						const toUpdate = await tx.query.speakerOnList.findMany({
							where: {
								AND: [
									{
										position: {
											lt: aboutToMoveSpeakerOnList.position,
											gte: args.position
										}
									},
									{
										speakersListId: aboutToMoveSpeakerOnList.speakersListId
									}
								]
							},
							orderBy: {
								position: 'desc'
							}
						});

						for (const entry of toUpdate) {
							await tx
								.update(table)
								.set({
									position: sql`${table.position} + 1`
								})
								.where(eq(table.id, entry.id));

							updatedEntityIds.push(entry.id);
						}
					}

					await tx
						.update(table)
						.set({
							position: args.position
						})
						.where(eq(table.id, aboutToMoveSpeakerOnList.id));

					return updatedEntityIds;
				});
				pubsub.updated(updatedEntityIds);

				return db.query.speakerOnList
					.findFirst(
						query(
							ctx.abilities.speakerOnList.filter('read', {
								inject: { where: { id: args.id } }
							}).query.single
						)
					)
					.then(assertFindFirstExists);
			}
		})
	};
});
