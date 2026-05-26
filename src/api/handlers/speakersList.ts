import { db, schema } from '$api/db/db';
import {
	schemaBuilder,
	pubsub as rumblePubsub,
	abilityBuilder,
	object,
	query,
	enum_
} from '$api/rumble';
import { eq } from 'drizzle-orm';
import { assertFindFirstExists, mapNullFieldsToUndefined } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { isTeamInConference, isParticipantInConference } from '$api/services/authHelper';

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
				committee: isTeamInConference(ctx)
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
				isClosed: t.arg.boolean(),
				phase: t.arg({ type: enum_({ tsName: 'speakersListPhase' }) })
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

				const mappedArgs = mapNullFieldsToUndefined(args);

				await db.transaction(async (tx) => {
					let currentPhase: string | undefined;

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

						currentPhase = speakersList.phase ?? undefined;

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
					} else if (mappedArgs.phase === undefined && mappedArgs.startTimestamp) {
						// Need current phase to auto-derive next phase on timer start
						const record = await tx.query.speakersList
							.findFirst(
								ctx.abilities.speakersList.filter('update').merge({ where: { id: args.id } }).query
									.single
							)
							.then(assertFindFirstExists);
						currentPhase = record.phase ?? undefined;
					}

					// Auto-derive phase when caller didn't provide one explicitly.
					// Explicit phase from the client always wins (widget direct transitions).
					let effectivePhase = mappedArgs.phase as
						| 'SPEECH'
						| 'SPEECH_DONE'
						| 'QUESTION'
						| 'ANSWER'
						| 'ANSWER_DONE'
						| undefined;

					if (effectivePhase === undefined && currentPhase !== undefined) {
						if (args.stopTimer && mappedArgs.timeLeft !== undefined) {
							// stopTimer + explicit timeLeft = next-speaker / reset pattern → fresh SPEECH
							effectivePhase = 'SPEECH';
						} else if (args.stopTimer) {
							if (currentPhase === 'SPEECH') effectivePhase = 'SPEECH_DONE';
							else if (currentPhase === 'ANSWER') effectivePhase = 'ANSWER_DONE';
						} else if (mappedArgs.startTimestamp) {
							if (currentPhase === 'SPEECH_DONE') effectivePhase = 'SPEECH';
							else if (currentPhase === 'ANSWER_DONE') effectivePhase = 'ANSWER';
						}
					}

					await tx
						.update(schema.speakersList)
						.set({
							speakingTime: mappedArgs.speakingTime,
							// server-computed remaining time wins when pausing a running timer
							timeLeft: computedTimeLeft ?? mappedArgs.timeLeft,
							// server stamps the authoritative start time so all clients share one anchor
							startTimestamp: args.stopTimer ? null : mappedArgs.startTimestamp ? now : undefined,
							isClosed: mappedArgs.isClosed,
							phase: effectivePhase
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
