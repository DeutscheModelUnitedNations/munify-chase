import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '#api/rumble';
import { GraphQLError } from 'graphql';
import { db, schema } from '#api/db/db';
import { eq } from 'drizzle-orm';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { SpeakersListRef } from './speakersList';
import { isTeamInConference, isParticipantInConference } from '#api/services/authHelper';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { SERIALIZABLE, type HandlerContext, type Transaction } from './helpers/scopedLookups';
import {
	assertMayQueueThemselves,
	assertOneSpeakerSeat,
	clampPosition,
	moveShift,
	seatEntryFilter,
	selfAddSeat,
	selfServiceCommittee
} from './helpers/speakerQueueRules';
import {
	deleteSpeakerAndCloseGap,
	findListWithCommittee,
	findOwnEntry,
	insertSpeaker,
	makeRoomAt,
	nextPosition,
	shiftEntries
} from './helpers/speakerQueue';

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

const pubsub = rumblePubsub({ table: 'speakerOnList' });
query({ table: 'speakerOnList' });

/** The filter reading an entry back through the caller's read ability. */
async function readableSpeaker(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.speakerOnList.filter('read')).merge({ where: { id } }).query.single;
}

/** The filter reading a list back through the caller's read ability. */
async function readableList(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.speakersList.filter('read')).merge({ where: { id } }).query.single;
}

/** The caller's conference user with their seat, in the conference a list belongs to. */
async function findSelfAddingUser(tx: Transaction, email: string, speakersListId: string) {
	return tx.query.conferenceUser
		.findFirst({
			where: {
				userEmail: email,
				conference: { committees: { agendaItems: { speakersList: { id: speakersListId } } } }
			},
			with: { committeeMember: { with: { committee: true } }, conferenceMember: true }
		})
		.then(assertFindFirstExists);
}

function requireEmail(ctx: HandlerContext) {
	const user = ctx.mustBeLoggedIn();
	if (!user.email) throw new GraphQLError('User email is required');
	return user.email;
}

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
						(await ctx.abilities.speakerOnList.filter('update')).merge({ where: { id: args.id } })
							.sql.where
					)
					.returning()
					.then(assertFirstEntryExists);

				pubsub.updated(args.id);

				return db.query.speakerOnList
					.findFirst(query(await readableSpeaker(ctx, updated.id)))
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
				assertOneSpeakerSeat(args);

				const createdId = await db.transaction(async (tx) => {
					const speakersList = await tx.query.speakersList
						.findFirst(
							(await ctx.abilities.speakersList.filter('update')).merge({
								where: { id: args.speakersListId }
							}).query.single
						)
						.then(assertFindFirstExists);

					// without a position the entry is appended, otherwise the entries from there on
					// move one back
					const position = args.position
						? args.position
						: await nextPosition(tx, args.speakersListId);
					if (args.position) {
						await makeRoomAt({ tx, speakersListId: args.speakersListId, position });
					}

					return insertSpeaker(tx, {
						id: args.id,
						committeeMemberId: args.committeeMemberId,
						conferenceMemberId: args.conferenceMemberId,
						speakersListId: speakersList.id,
						position
					});
				}, SERIALIZABLE);

				pubsub.created();

				return db.query.speakerOnList
					.findFirst(query(await readableSpeaker(ctx, createdId)))
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
					async (tx) =>
						deleteSpeakerAndCloseGap(
							tx,
							(await ctx.abilities.speakerOnList.filter('delete')).merge({
								where: { id: args.speakerOnListId }
							}).sql.where
						),
					SERIALIZABLE
				);
				pubsub.removed();

				return db.query.speakersList
					.findFirst(query(await readableList(ctx, removed.speakersListId)))
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
				const email = requireEmail(ctx);

				const createdId = await db.transaction(async (tx) => {
					const conferenceUser = await findSelfAddingUser(tx, email, args.speakersListId);
					assertMayQueueThemselves(conferenceUser);

					const committee = selfServiceCommittee({
						speakersList: await findListWithCommittee(tx, args.speakersListId),
						action: 'add'
					});
					const seat = selfAddSeat({ conferenceUser, committeeId: committee.id });

					const existing = await tx.query.speakerOnList.findFirst({
						where: seatEntryFilter({ speakersListId: args.speakersListId, seat })
					});
					if (existing) throw new GraphQLError('Already on speakers list');

					return insertSpeaker(tx, {
						id: args.id,
						...seat,
						speakersListId: args.speakersListId,
						position: await nextPosition(tx, args.speakersListId)
					});
				}, SERIALIZABLE);

				pubsub.created();

				return db.query.speakerOnList
					.findFirst(query(await readableSpeaker(ctx, createdId)))
					.then(assertFindFirstExists);
			}
		}),
		selfRemoveFromSpeakersList: t.drizzleField({
			type: SpeakersListRef,
			args: {
				speakersListId: t.arg.id({ required: true })
			},
			resolve: async (query, root, args, ctx) => {
				const email = requireEmail(ctx);

				const removed = await db.transaction(async (tx) => {
					// The list first, so the conferenceUser lookup is scoped to the right conference
					// (fixes multi-conference users).
					const committee = selfServiceCommittee({
						speakersList: await findListWithCommittee(tx, args.speakersListId),
						action: 'remove'
					});

					const conferenceUser = await tx.query.conferenceUser.findFirst({
						where: { userEmail: email, conferenceId: committee.conferenceId }
					});
					if (!conferenceUser) throw new GraphQLError('Conference user not found');

					const entry = await findOwnEntry({
						tx,
						speakersListId: args.speakersListId,
						conferenceUser
					});
					if (!entry) throw new GraphQLError('You are not on this speakers list');

					return deleteSpeakerAndCloseGap(tx, eq(schema.speakerOnList.id, entry.id));
				}, SERIALIZABLE);

				pubsub.removed();

				return db.query.speakersList
					.findFirst(query(await readableList(ctx, removed.speakersListId)))
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

				const updatedEntityIds = await db.transaction(async (tx) => {
					const moving = await tx.query.speakerOnList
						.findFirst(
							(await ctx.abilities.speakerOnList.filter('update')).merge({
								where: { id: args.id }
							}).query.single
						)
						.then(assertFindFirstExists);
					return moveSpeaker({ tx, moving, target: args.position });
				}, SERIALIZABLE);
				pubsub.updated(updatedEntityIds);

				return db.query.speakerOnList
					.findFirst(query(await readableSpeaker(ctx, args.id)))
					.then(assertFindFirstExists);
			}
		})
	};
});

/** Moves an entry to a position, shifting the ones in between. Returns every moved entry's id. */
async function moveSpeaker({
	tx,
	moving,
	target
}: {
	tx: Transaction;
	moving: { id: string; position: number; speakersListId: string };
	target: number;
}) {
	// Clamp the target to the occupied range so moving a speaker beyond the last position never
	// creates sparse gaps in the list.
	const last = await tx.query.speakerOnList.findFirst({
		where: { speakersListId: moving.speakersListId },
		orderBy: (t, { desc }) => desc(t.position),
		columns: { position: true }
	});
	const to = clampPosition({ target, max: last?.position ?? moving.position });
	const shift = moveShift({ from: moving.position, to });
	// Already there: nothing moves, but pubsub still gets a valid id list
	if (!shift) return [moving.id];

	await tx
		.update(schema.speakerOnList)
		.set({ position: -1 })
		.where(eq(schema.speakerOnList.id, moving.id));

	const between = await tx.query.speakerOnList.findMany({
		where: { speakersListId: moving.speakersListId, position: shift.range },
		orderBy: { position: shift.order }
	});
	const shifted = await shiftEntries({ tx, entries: between, step: shift.step });

	await tx
		.update(schema.speakerOnList)
		.set({ position: to })
		.where(eq(schema.speakerOnList.id, moving.id));

	return [moving.id, ...shifted];
}
