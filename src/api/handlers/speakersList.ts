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
			resolve: async (query, root, args, ctx, info) => {
				if (args.startTimestamp && args.stopTimer) {
					throw new GraphQLError('startTimestamp and stopTimer are mutually exclusive');
				}

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
							await tx.insert(schema.spokenTimePeriod).values({
								endTimestamp: new Date(),
								startTimestamp: speakersList.startTimestamp!,
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
							timeLeft: mappedArgs.timeLeft,
							startTimestamp: args.stopTimer ? null : mappedArgs.startTimestamp,
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
			resolve: async (query, root, args, ctx, info) => {
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
