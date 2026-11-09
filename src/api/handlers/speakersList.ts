import { db, schema } from '#api/db/db';
import {
	schemaBuilder,
	pubsub as rumblePubsub,
	abilityBuilder,
	object,
	query,
	enum_
} from '#api/rumble';
import { eq } from 'drizzle-orm';
import { assertFindFirstExists, mapNullFieldsToUndefined } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { isTeamInConference, isParticipantInConference } from '#api/services/authHelper';
import type { HandlerContext, Transaction } from './helpers/scopedLookups';
import {
	derivePhase,
	remainingSeconds,
	timerStart,
	type SpeakersListPhase
} from './helpers/speakersListTimer';

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

async function readableList(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.speakersList.filter('read')).merge({ where: { id } }).query.single;
}

async function findUpdatableList({
	tx,
	ctx,
	id
}: {
	tx: Transaction;
	ctx: HandlerContext;
	id: string;
}) {
	return tx.query.speakersList
		.findFirst({
			...(await ctx.abilities.speakersList.filter('update')).merge({ where: { id } }).query.single,
			with: { speakers: { orderBy: { position: 'asc' }, limit: 1 } }
		})
		.then(assertFindFirstExists);
}

/**
 * Pausing a running timer: records the period the first speaker spoke, and computes the time left
 * from the server clock instead of trusting the client, so every client converges on one value.
 */
async function stopRunningTimer({
	tx,
	ctx,
	id,
	now
}: {
	tx: Transaction;
	ctx: HandlerContext;
	id: string;
	now: Date;
}) {
	const speakersList = await findUpdatableList({ tx, ctx, id });
	const currentPhase: SpeakersListPhase | undefined = speakersList.phase ?? undefined;
	if (!speakersList.startTimestamp) return { currentPhase, computedTimeLeft: undefined };

	const [speaker] = speakersList.speakers;
	await tx.insert(schema.spokenTimePeriod).values({
		endTimestamp: now,
		startTimestamp: speakersList.startTimestamp,
		speakersListId: speakersList.id,
		committeeMemberId: speaker.committeeMemberId,
		conferenceMemberId: speaker.conferenceMemberId,
		queuedAt: speaker.createdAt,
		phase: currentPhase ?? 'SPEECH'
	});
	return {
		currentPhase,
		computedTimeLeft: remainingSeconds({
			timeLeft: speakersList.timeLeft,
			startedAt: speakersList.startTimestamp,
			now
		})
	};
}

/** The current phase, when starting the timer needs it to derive the next one. */
async function phaseToResume({
	tx,
	ctx,
	args
}: {
	tx: Transaction;
	ctx: HandlerContext;
	args: { id: string; phase?: SpeakersListPhase; startTimestamp?: Date };
}) {
	if (args.phase !== undefined || !args.startTimestamp) return undefined;
	const record = await tx.query.speakersList
		.findFirst(
			(await ctx.abilities.speakersList.filter('update')).merge({ where: { id: args.id } }).query
				.single
		)
		.then(assertFindFirstExists);
	return record.phase ?? undefined;
}

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
				const mappedArgs = mapNullFieldsToUndefined(args);
				const stopTimer = !!args.stopTimer;
				const starting = !!mappedArgs.startTimestamp;

				await db.transaction(async (tx) => {
					const { currentPhase, computedTimeLeft } = stopTimer
						? await stopRunningTimer({ tx, ctx, id: args.id, now })
						: { currentPhase: await phaseToResume({ tx, ctx, args: mappedArgs }) };

					await tx
						.update(schema.speakersList)
						.set({
							speakingTime: mappedArgs.speakingTime,
							// server-computed remaining time wins when pausing a running timer
							timeLeft: computedTimeLeft ?? mappedArgs.timeLeft,
							// server stamps the authoritative start time so all clients share one anchor
							startTimestamp: timerStart({ stopTimer, starting, now }),
							isClosed: mappedArgs.isClosed,
							phase: derivePhase({
								explicit: mappedArgs.phase,
								current: currentPhase,
								stopTimer,
								timeLeftGiven: mappedArgs.timeLeft !== undefined,
								starting
							})
						})
						.where(
							(await ctx.abilities.speakersList.filter('update')).merge({ where: { id: args.id } })
								.sql.where
						);
				});

				pubsub.updated(args.id);

				return db.query.speakersList
					.findFirst(query(await readableList(ctx, args.id)))
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
						(await ctx.abilities.speakersList.filter('delete')).merge({ where: { id: args.id } })
							.query.single
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
					.findFirst(query(await readableList(ctx, args.id)))
					.then(assertFindFirstExists);
			}
		})
	};
});
