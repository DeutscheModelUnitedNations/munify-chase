import { db, schema } from '$api/db/db';
import { schemaBuilder, pubsub as rumblePubsub, abilityBuilder, object, query } from '$api/rumble';
import { eq } from 'drizzle-orm';
import { assertFindFirstExists, mapNullFieldsToUndefined } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { isChairInConference, isParticipantInConference } from '$api/services/authHelper';

abilityBuilder.speakersList.allow('read').when((ctx) => {
	return {
		where: {
			agendaItem: {
				committee: isParticipantInConference(ctx)
			}
		}
	};
});

abilityBuilder.speakersList.allow(['update', 'delete']).when((ctx) => {
	return {
		where: {
			agendaItem: {
				committee: isChairInConference(ctx)
			}
		}
	};
});

const ref = object({
	table: 'speakersList'
});

export const SpeakersListRef = ref;

const pubsub = rumblePubsub({ table: 'speakersList' });
query({
	table: 'speakersList'
});

schemaBuilder.mutationFields((t) => {
	return {
		updateSpeakersList: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true }),
				speakingTime: t.arg.int(),
				timeLeft: t.arg.int(),
				startTimestamp: t.arg({
					type: 'DateTime'
				}),
				stopTimer: t.arg({
					type: 'Boolean',
					defaultValue: false
				}),
				isClosed: t.arg.boolean()
			},
			resolve: async (query, root, args, ctx) => {
				if (args.startTimestamp && args.stopTimer) {
					throw new GraphQLError('startTimestamp and stopTimer are mutually exclusive');
				}

				// Single authoritative server timestamp for the whole mutation.
				const now = new Date();
				// Set when pausing a running timer: the remaining time is computed from the server
				// clock here instead of trusting the client, so every client converges on the same value.
				let computedTimeLeft: number | undefined;

				await db.transaction(async (tx) => {
					if (args.stopTimer) {
						const speakersList = await tx.query.speakersList
							.findFirst({
								...ctx.abilities.speakersList.filter('update').merge({
									where: {
										id: args.id
									}
								}).query.single,
								with: {
									speakers: {
										orderBy: {
											position: 'asc'
										},
										limit: 1
									}
								}
							})
							.then(assertFindFirstExists);

						if (speakersList.startTimestamp) {
							const elapsedSeconds = (now.getTime() - speakersList.startTimestamp.getTime()) / 1000;
							computedTimeLeft = Math.round(speakersList.timeLeft - elapsedSeconds);

							await tx.insert(schema.spokenTimePeriod).values({
								endTimestamp: now,
								startTimestamp: speakersList.startTimestamp,
								speakersListId: speakersList.id,
								committeeMemberId: speakersList.speakers[0].committeeMemberId,
								conferenceMemberId: speakersList.speakers[0].conferenceMemberId
							});
						}
					}

					const mappedArgs = mapNullFieldsToUndefined(args);
					await tx
						.update(schema.speakersList)
						.set({
							speakingTime: mappedArgs.speakingTime,
							// server-computed remaining time wins when pausing a running timer
							timeLeft: computedTimeLeft ?? mappedArgs.timeLeft,
							// server stamps the authoritative start time so all clients share one anchor
							startTimestamp: args.stopTimer ? null : mappedArgs.startTimestamp ? now : undefined,
							isClosed: mappedArgs.isClosed
						})
						.where(
							ctx.abilities.speakersList.filter('update').merge({ where: { id: args.id } }).sql
								.where
						);
				});

				pubsub.updated(args.id);

				return db.query.speakersList
					.findFirst(
						query(
							ctx.abilities.speakersList.filter('read').merge({ where: { id: args.id } }).query
								.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),
		clearSpeakersList: t.drizzleField({
			type: SpeakersListRef,
			args: {
				id: t.arg.id({ required: true })
			},
			resolve: async (query, root, args, ctx) => {
				await db.query.speakersList
					.findFirst(
						ctx.abilities.speakersList.filter('delete').merge({ where: { id: args.id } }).query
							.single
					)
					.then(assertFindFirstExists);

				const deleted = await db
					.delete(schema.speakerOnList)
					.where(eq(schema.speakerOnList.speakersListId, args.id))
					.returning();

				if (deleted.length > 0) {
					rumblePubsub({ table: 'speakerOnList' }).removed();
				}

				pubsub.updated(args.id);

				return db.query.speakersList
					.findFirst(
						query(
							ctx.abilities.speakersList.filter('read').merge({ where: { id: args.id } }).query
								.single
						)
					)
					.then(assertFindFirstExists);
			}
		})
	};
});
