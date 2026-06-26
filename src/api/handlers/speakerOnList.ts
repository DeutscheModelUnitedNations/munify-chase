import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { GraphQLError } from 'graphql';
import { db, schema } from '$api/db/db';
import { and, count, eq, gte, sql } from 'drizzle-orm';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { SpeakersListRef } from './speakersList';
import {
	isTeamInConference,
	isParticipantInConference
} from '$api/services/authHelper';
import { nanoidValidation } from '$lib/helpers/nanoid';

abilityBuilder.speakerOnList.allow('read').when((ctx) => {
	return {
		where: {
			speakersList: {
				agendaItem: {
					committee: isParticipantInConference(ctx)
				}
			}
		}
	};
});

abilityBuilder.speakerOnList.allow(['update', 'delete']).when((ctx) => {
	return {
		where: {
			speakersList: {
				agendaItem: {
					committee: isTeamInConference(ctx)
				}
			}
		}
	};
});

const ref = object({ table: 'speakerOnList' });
export const SpeakerOnListRef = ref;

const pubsub = rumblePubsub({ table: 'speakerOnList' });
query({ table: 'speakerOnList' });

// TODO: These could use some validation for the position values. E.g. only allow positions
// which are in bounds and so on

schemaBuilder.mutationFields((t) => {
	return {
		updateSpeakerOnList: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true }),
				overwriteName: t.arg.string()
			},
			resolve: async (query, _root, args, ctx) => {
				const updated = await db
					.update(schema.speakerOnList)
					.set({
						overwriteName: args.overwriteName ? args.overwriteName : null
					})
					.where(
						ctx.abilities.speakerOnList.filter('update').merge({ where: { id: args.id } }).sql.where
					)
					.returning()
					.then(assertFirstEntryExists);

				pubsub.updated(args.id);

				return db.query.speakerOnList
					.findFirst(
						query(
							ctx.abilities.speakerOnList.filter('read').merge({ where: { id: updated.id } }).query
								.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),
		addSpeakerOnList: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id().validate(nanoidValidation),
				//TOOD do we need the userId here?
				//TOOD do we need the reference by nation here?
				committeeMemberId: t.arg.id(),
				conferenceMemberId: t.arg.id(),
				speakersListId: t.arg.id({ required: true }),
				position: t.arg.int()
			},
			resolve: async (query, root, args, ctx) => {

				if (args.committeeMemberId && args.conferenceMemberId) {
					throw new GraphQLError('Cannot set both committeeMemberId and conferenceMemberId');
				}

				if (!args.committeeMemberId && !args.conferenceMemberId) {
					throw new GraphQLError('Must set either committeeMemberId or conferenceMemberId');
				}

				const createdId = await db.transaction(
					async (tx) => {
						const speakersList = await tx.query.speakersList
							.findFirst(
								ctx.abilities.speakersList
									.filter('update')
									.merge({ where: { id: args.speakersListId } }).query.single
							)
							.then(assertFindFirstExists);

						let position = args.position;
						if (!position) {
							// in case the caller did not provide a position, just append as last entry
							position = (
								await tx
									.select({ count: count() })
									.from(schema.speakerOnList)
									.where(eq(schema.speakerOnList.speakersListId, args.speakersListId))
									.then(assertFirstEntryExists)
							).count; // since the position is 0 based, we can just use the count as new position
						} else {
							// if they did provide a position, we want to shift all the entries up which are
							// equal or higher in position
							await tx
								.update(schema.speakerOnList)
								.set({
									position: sql`${schema.speakerOnList.position} + 1`
								})
								.where(
									and(
										eq(schema.speakerOnList.speakersListId, args.speakersListId),
										gte(schema.speakerOnList.position, position)
									)
								);
						}

						const created = await tx
							.insert(schema.speakerOnList)
							.values({
								id: args.id,
								committeeMemberId: args.committeeMemberId,
								conferenceMemberId: args.conferenceMemberId,
								speakersListId: speakersList.id,
								position
							})
							.returning({ id: schema.speakerOnList.id })
							.then(assertFirstEntryExists);

						return created.id;
					},
					{
						// since we do calculations on the positions we want full isolation
						isolationLevel: 'serializable',
						deferrable: true
					}
				);

				pubsub.created();

				return db.query.speakerOnList
					.findFirst(
						query(
							ctx.abilities.speakerOnList.filter('read').merge({ where: { id: createdId } }).query
								.single
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
			resolve: async (query, root, args, ctx) => {
				const removed = await db.transaction(
					async (tx) => {
						const deleted = await tx
							.delete(schema.speakerOnList)
							.where(
								ctx.abilities.speakerOnList
									.filter('delete')
									.merge({ where: { id: args.speakerOnListId } }).sql.where
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
							// this needs to be done in sequence to prevent unique constraint violations on the position column
							await tx
								.update(schema.speakerOnList)
								.set({
									position: sql`${schema.speakerOnList.position} - 1`
								})
								.where(eq(schema.speakerOnList.id, speaker.id));
						}

						return deleted;
					},
					{
						// since we do calculations on the positions we want full isolation
						isolationLevel: 'serializable',
						deferrable: true
					}
				);
				pubsub.removed();

				return db.query.speakersList
					.findFirst(
						query(
							ctx.abilities.speakersList
								.filter('read')
								.merge({ where: { id: removed.speakersListId } }).query.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),
		selfAddToSpeakersList: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id().validate(nanoidValidation),
				speakersListId: t.arg.id({ required: true })
			},
			resolve: async (query, root, args, ctx) => {

				const user = ctx.mustBeLoggedIn();
				if (!user.email) {
					throw new GraphQLError('User email is required');
				}

				const createdId = await db.transaction(
					async (tx) => {
						// Find the user's conferenceUser record
						const conferenceUser = await tx.query.conferenceUser
							.findFirst({
								where: {
									userEmail: user.email!,
									conference: {
										committees: {
											agendaItems: {
												speakersList: {
													id: args.speakersListId
												}
											}
										}
									}
								},
								with: {
									committeeMember: {
										with: { committee: true }
									},
									conferenceMember: true
								}
							})
							.then(assertFindFirstExists);

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

						const committee = speakersList.agendaItem?.committee;
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

						if (conferenceUser.conferenceUserType === 'DELEGATE') {
							if (!conferenceUser.committeeMember) {
								throw new GraphQLError('Delegate is not assigned to a committee');
							}
							if (!conferenceUser.committeeMember.present) {
								throw new GraphQLError(
									'Delegate must be marked as present to add to speakers list'
								);
							}
							if (conferenceUser.committeeMember.committeeId !== committee.id) {
								throw new GraphQLError('Delegate is not a member of this committee');
							}
							committeeMemberId = conferenceUser.committeeMember.id;
						} else {
							// NON_STATE_ACTOR
							if (!conferenceUser.conferenceMember) {
								throw new GraphQLError('Non-state actor is not assigned a conference member');
							}
							conferenceMemberId = conferenceUser.conferenceMember.id;
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
								.from(schema.speakerOnList)
								.where(eq(schema.speakerOnList.speakersListId, args.speakersListId))
								.then(assertFirstEntryExists)
						).count;

						const created = await tx
							.insert(schema.speakerOnList)
							.values({
								id: args.id,
								committeeMemberId,
								conferenceMemberId,
								speakersListId: args.speakersListId,
								position
							})
							.returning({ id: schema.speakerOnList.id })
							.then(assertFirstEntryExists);

						return created.id;
					},
					{
						// since we do calculations on the positions we want full isolation
						isolationLevel: 'serializable',
						deferrable: true
					}
				);

				pubsub.created();

				return db.query.speakerOnList
					.findFirst(
						query(
							ctx.abilities.speakerOnList.filter('read').merge({ where: { id: createdId } }).query
								.single
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
			resolve: async (query, root, args, ctx) => {
				const user = ctx.mustBeLoggedIn();
				if (!user.email) {
					throw new GraphQLError('User email is required');
				}

				const removed = await db.transaction(
					async (tx) => {
						// Fetch the speakers list first so we can scope the conferenceUser
						// lookup to the right conference (fixes multi-conference users).
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

						const committee = speakersList.agendaItem?.committee;
						if (!committee) {
							throw new GraphQLError('Committee not found for this speakers list');
						}
						if (!committee.allowDelegationsToAddThemselvesToSpeakersList) {
							throw new GraphQLError(
								'Self-removing from speakers list is not enabled for this committee'
							);
						}

						const conferenceUser = await tx.query.conferenceUser.findFirst({
							where: {
								userEmail: user.email!,
								conferenceId: committee.conferenceId
							},
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
							.delete(schema.speakerOnList)
							.where(eq(schema.speakerOnList.id, speakerOnList.id))
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
								.update(schema.speakerOnList)
								.set({
									position: sql`${schema.speakerOnList.position} - 1`
								})
								.where(eq(schema.speakerOnList.id, speaker.id));
						}

						return deleted;
					},
					{
						// since we do calculations on the positions we want full isolation
						isolationLevel: 'serializable',
						deferrable: true
					}
				);

				pubsub.removed();

				return db.query.speakersList
					.findFirst(
						query(
							ctx.abilities.speakersList
								.filter('read')
								.merge({ where: { id: removed.speakersListId } }).query.single
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
			resolve: async (query, root, args, ctx) => {
				if (args.position < 0) {
					throw new GraphQLError('Position must be a non-negative integer');
				}

				const updatedEntityIds = await db.transaction(
					async (tx) => {
						const aboutToMoveSpeakerOnList = await tx.query.speakerOnList
							.findFirst(
								ctx.abilities.speakerOnList.filter('update').merge({ where: { id: args.id } }).query
									.single
							)
							.then(assertFindFirstExists);

						// Clamp target to the occupied range so moving a speaker beyond the
						// last position never creates sparse gaps in the list.
						const maxPositionRow = await tx.query.speakerOnList.findFirst({
							where: {
								speakersListId: aboutToMoveSpeakerOnList.speakersListId
							},
							orderBy: (t, { desc }) => desc(t.position),
							columns: { position: true }
						});
						const maxPosition = maxPositionRow?.position ?? aboutToMoveSpeakerOnList.position;
						const targetPosition = Math.max(0, Math.min(maxPosition, args.position));

						if (targetPosition === aboutToMoveSpeakerOnList.position) {
							// Already at the boundary — no-op. Return the correct type so
							// pubsub.updated receives a valid ID array.
							return [aboutToMoveSpeakerOnList.id];
						}

						await tx
							.update(schema.speakerOnList)
							.set({
								position: -1
							})
							.where(eq(schema.speakerOnList.id, aboutToMoveSpeakerOnList.id));

						const updatedEntityIds = [aboutToMoveSpeakerOnList.id];

						if (targetPosition > aboutToMoveSpeakerOnList.position) {
							const toUpdate = await tx.query.speakerOnList.findMany({
								where: {
									AND: [
										{
											position: {
												gt: aboutToMoveSpeakerOnList.position,
												lte: targetPosition
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
									.update(schema.speakerOnList)
									.set({
										position: sql`${schema.speakerOnList.position} - 1`
									})
									.where(eq(schema.speakerOnList.id, entry.id));

								updatedEntityIds.push(entry.id);
							}
						} else if (targetPosition < aboutToMoveSpeakerOnList.position) {
							const toUpdate = await tx.query.speakerOnList.findMany({
								where: {
									AND: [
										{
											position: {
												lt: aboutToMoveSpeakerOnList.position,
												gte: targetPosition
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
									.update(schema.speakerOnList)
									.set({
										position: sql`${schema.speakerOnList.position} + 1`
									})
									.where(eq(schema.speakerOnList.id, entry.id));

								updatedEntityIds.push(entry.id);
							}
						}

						await tx
							.update(schema.speakerOnList)
							.set({
								position: targetPosition
							})
							.where(eq(schema.speakerOnList.id, aboutToMoveSpeakerOnList.id));

						return updatedEntityIds;
					},
					{
						// since we do calculations on the positions we want full isolation
						isolationLevel: 'serializable',
						deferrable: true
					}
				);
				pubsub.updated(updatedEntityIds);

				return db.query.speakerOnList
					.findFirst(
						query(
							ctx.abilities.speakerOnList.filter('read').merge({ where: { id: args.id } }).query
								.single
						)
					)
					.then(assertFindFirstExists);
			}
		})
	};
});
