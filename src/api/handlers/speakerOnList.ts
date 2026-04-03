import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { GraphQLError } from 'graphql';
import { basics } from './basics';
import { db, schema } from '$api/db/db';
import { and, count, eq, gt, gte, sql } from 'drizzle-orm';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { SpeakersListRef } from './speakersList';
import { isGlobalAdmin } from '$api/services/isAdminEmail';
import { assertCommitteeChairOrAdmin } from './resolutionPaper';

const { arg, ref, pubsub, table } = basics('speakerOnList');

export const SpeakerOnListRef = ref;
export const SpeakerOnWhereArgs = arg;

// TODO: These could use some validation for the position values. E.g. only allow positons
// which are in bounds and so on

abilityBuilder.speakerOnList.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.speakerOnList.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
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
				// Verify chair/admin access
				const speaker = await db.query.speakerOnList
					.findFirst({
						where: { id: args.id },
						with: { speakersList: { with: { agendaItem: { columns: { committeeId: true } } } } }
					})
					.then(assertFindFirstExists);
				await assertCommitteeChairOrAdmin(
					ctx,
					(speaker as any).speakersList.agendaItem.committeeId
				);

				const updated = await db
					.update(table)
					.set({
						overwriteName: args.overwriteName ? args.overwriteName : null
					})
					.where(eq(schema.speakerOnList.id, args.id))
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

				// Verify chair/admin access
				const speakersListForAuth = await db.query.speakersList
					.findFirst({
						where: { id: args.speakersListId },
						with: { agendaItem: { columns: { committeeId: true } } }
					})
					.then(assertFindFirstExists);
				await assertCommitteeChairOrAdmin(ctx, (speakersListForAuth as any).agendaItem.committeeId);

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
								and(eq(table.speakersListId, args.speakersListId), gte(table.position, position))
							);
					}

					const speakersList = await tx.query.speakersList
						.findFirst({ where: { id: args.speakersListId } })
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
				// Verify chair/admin access
				const speaker = await db.query.speakerOnList
					.findFirst({
						where: { id: args.speakerOnListId },
						with: { speakersList: { with: { agendaItem: { columns: { committeeId: true } } } } }
					})
					.then(assertFindFirstExists);
				await assertCommitteeChairOrAdmin(
					ctx,
					(speaker as any).speakersList.agendaItem.committeeId
				);

				const removed = await db.transaction(async (tx) => {
					const deleted = await tx
						.delete(table)
						.where(eq(table.id, args.speakerOnListId))
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
		selfAddToSpeakersList: t.drizzleField({
			type: ref,
			args: {
				speakersListId: t.arg.id({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				const user = ctx.mustBeLoggedIn();
				if (!user.email) {
					throw new GraphQLError('User email is required');
				}

				const createdId = await db.transaction(async (tx) => {
					// Find the user's conferenceUser record
					const conferenceUser = await tx.query.conferenceUser.findFirst({
						where: { userEmail: user.email! },
						with: {
							committeeMember: {
								with: { committee: true }
							},
							conferenceMember: true
						}
					});

					if (!conferenceUser) {
						throw new GraphQLError('Conference user not found');
					}

					if (
						conferenceUser.conferenceUserType !== 'DELEGATE' &&
						conferenceUser.conferenceUserType !== 'NON_STATE_ACTOR'
					) {
						throw new GraphQLError(
							'Only delegates and non-state actors can self-add to speakers lists'
						);
					}

					// Get the speakers list and traverse to committee to check the flag
					const speakersList = await tx.query.speakersList.findFirst({
						where: { id: args.speakersListId },
						with: {
							agendaItem: {
								with: {
									committee: true
								}
							}
						}
					});

					if (!speakersList) {
						throw new GraphQLError('Speakers list not found');
					}

					if (speakersList.isClosed) {
						throw new GraphQLError('Speakers list is closed');
					}

					const committee = (speakersList as any).agendaItem?.committee;
					if (!committee) {
						throw new GraphQLError('Committee not found for this speakers list');
					}
					if (!committee.allowDelegationsToAddThemselvesToSpeakersList) {
						throw new GraphQLError(
							'Self-adding to speakers list is not enabled for this committee'
						);
					}

					let committeeMemberId: string | null = null;
					let conferenceMemberId: string | null = null;

					const confUser = conferenceUser as any;
					if (conferenceUser.conferenceUserType === 'DELEGATE') {
						if (!confUser.committeeMember) {
							throw new GraphQLError('Delegate is not assigned to a committee');
						}
						if (!confUser.committeeMember.present) {
							throw new GraphQLError('Delegate must be marked as present to add to speakers list');
						}
						if (confUser.committeeMember.committeeId !== committee.id) {
							throw new GraphQLError('Delegate is not a member of this committee');
						}
						committeeMemberId = confUser.committeeMember.id;
					} else {
						// NON_STATE_ACTOR
						if (!confUser.conferenceMember) {
							throw new GraphQLError('Non-state actor is not assigned a conference member');
						}
						conferenceMemberId = confUser.conferenceMember.id;
					}

					// Check not already on list
					const existing = await tx.query.speakerOnList.findFirst({
						where: {
							speakersListId: args.speakersListId,
							...(committeeMemberId ? { committeeMemberId } : {}),
							...(conferenceMemberId ? { conferenceMemberId } : {})
						}
					});

					if (existing) {
						throw new GraphQLError('Already on speakers list');
					}

					// Append at end
					const position = (
						await tx
							.select({ count: count() })
							.from(table)
							.where(eq(table.speakersListId, args.speakersListId))
							.then(assertFirstEntryExists)
					).count;

					const created = await tx
						.insert(table)
						.values({
							committeeMemberId,
							conferenceMemberId,
							speakersListId: args.speakersListId,
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
		selfRemoveFromSpeakersList: t.drizzleField({
			type: SpeakersListRef,
			args: {
				speakersListId: t.arg.id({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				const user = ctx.mustBeLoggedIn();
				if (!user.email) {
					throw new GraphQLError('User email is required');
				}

				const removed = await db.transaction(async (tx) => {
					const conferenceUser = await tx.query.conferenceUser.findFirst({
						where: { userEmail: user.email! },
						with: {
							committeeMember: true,
							conferenceMember: true
						}
					});

					if (!conferenceUser) {
						throw new GraphQLError('Conference user not found');
					}

					// Find own speaker entry on this list
					let speakerOnList;
					if (conferenceUser.committeeMemberId) {
						speakerOnList = await tx.query.speakerOnList.findFirst({
							where: {
								speakersListId: args.speakersListId,
								committeeMemberId: conferenceUser.committeeMemberId
							}
						});
					}
					if (!speakerOnList && conferenceUser.conferenceMemberId) {
						speakerOnList = await tx.query.speakerOnList.findFirst({
							where: {
								speakersListId: args.speakersListId,
								conferenceMemberId: conferenceUser.conferenceMemberId
							}
						});
					}

					if (!speakerOnList) {
						throw new GraphQLError('You are not on this speakers list');
					}

					const deleted = await tx
						.delete(table)
						.where(eq(table.id, speakerOnList.id))
						.returning()
						.then(assertFirstEntryExists);

					// Shift positions down
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

				// Verify chair/admin access
				const speakerForAuth = await db.query.speakerOnList
					.findFirst({
						where: { id: args.id },
						with: { speakersList: { with: { agendaItem: { columns: { committeeId: true } } } } }
					})
					.then(assertFindFirstExists);
				await assertCommitteeChairOrAdmin(
					ctx,
					(speakerForAuth as any).speakersList.agendaItem.committeeId
				);

				const updatedEntityIds = await db.transaction(async (tx) => {
					const aboutToMoveSpeakerOnList = await tx.query.speakerOnList
						.findFirst({ where: { id: args.id } })
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
