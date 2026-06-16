import { db, schema } from '$api/db/db';
import { ConferenceUserRef } from './conferenceUser';
import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '$api/rumble';
import { isAdminInConference, isTeamInConference } from '$api/services/authHelper';
import { attendanceCode as generateAttendanceCode } from '$lib/helpers/attendanceCode';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { nanoidValidation } from '$lib/helpers/nanoid';

abilityBuilder.presenceEvent.allow('read').when((ctx) => ({
	where: { committee: isTeamInConference(ctx) }
}));

abilityBuilder.presenceEvent.allow(['update', 'delete']).when((ctx) => ({
	where: { committee: isAdminInConference(ctx) }
}));

export const PresenceEventRef = object({ table: 'presenceEvent' });

const pubsub = rumblePubsub({ table: 'presenceEvent' });
query({ table: 'presenceEvent' });

/**
 * Resolves the target NSA `conferenceUser` for a scan given a code
 * that may be a conferenceUser.id (30-char nanoid), an attendanceCode (6-char),
 * or a global user.id (OIDC subject). Scoped to the conference owning the target committee.
 */
async function resolveNsaTarget(args: {
	committee: typeof schema.committee.$inferSelect;
	code: string;
}) {
	const code = args.code.trim();
	if (!code) throw new GraphQLError('Missing code');
	const normalizedCode = code.toUpperCase();

	const matches = await db.query.conferenceUser.findMany({
		where: {
			conferenceId: args.committee.conferenceId,
			conferenceUserType: 'NON_STATE_ACTOR',
			OR: [{ id: code }, { attendanceCode: normalizedCode }, { user: { id: code } }]
		}
	});
	if (matches.length === 0) throw new GraphQLError('NSA user not found for this conference');
	if (matches.length > 1) throw new GraphQLError('Ambiguous code: matches multiple NSA users');
	return matches[0];
}

/**
 * Inserts a fresh attendance code for an NSA user, retrying on the rare unique
 * collision (~1 in 2.2B per attempt at 6 chars over a 36-char alphabet).
 */
async function assignAttendanceCode(conferenceUserId: string, conferenceId: string) {
	for (let attempt = 0; attempt < 5; attempt++) {
		const code = generateAttendanceCode();
		const existing = await db.query.conferenceUser.findFirst({
			where: { conferenceId, attendanceCode: code }
		});
		if (existing) continue;
		await db
			.update(schema.conferenceUser)
			.set({ attendanceCode: code })
			.where(eq(schema.conferenceUser.id, conferenceUserId));
		return code;
	}
	throw new GraphQLError('Could not generate a unique attendance code, please retry');
}

schemaBuilder.mutationFields((t) => ({
	/**
	 * Chair-facing: scan or manual-code → check the NSA into the given committee.
	 * If the NSA is currently checked into a different committee, automatically
	 * inserts a CHECK_OUT for that committee 1ms before the new CHECK_IN so the
	 * timeline stays strictly ordered. Idempotent if already in the same committee.
	 */
	recordNsaCheckIn: t.drizzleField({
		type: PresenceEventRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			committeeId: t.arg.id({ required: true }),
			code: t.arg.string({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {

			const committee = await db.query.committee
				.findFirst(
					ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).query
						.single
				)
				.then(assertFindFirstExists);

			const target = await resolveNsaTarget({ committee, code: args.code });

			const triggeredBy = await db.query.conferenceUser.findFirst({
				where: {
					userEmail: ctx.mustBeLoggedIn().email!,
					conferenceId: committee.conferenceId
				}
			});

			const newId = await db.transaction(
				async (tx) => {
					const latest = await tx.query.presenceEvent.findFirst({
						where: { conferenceUserId: target.id },
						orderBy: { timestamp: 'desc' }
					});

					const now = new Date();

					if (latest && latest.present && latest.committeeId === args.committeeId) {
						return latest.id;
					}

					if (latest && latest.present && latest.committeeId !== args.committeeId) {
						await tx.insert(schema.presenceEvent).values({
							conferenceUserId: target.id,
							committeeId: latest.committeeId,
							present: false,
							timestamp: new Date(now.getTime() - 1),
							triggeredByConferenceUserId: triggeredBy?.id ?? null,
							type: 'AUTO_SWITCH'
						});
					}

					const inserted = await tx
						.insert(schema.presenceEvent)
						.values({
							id: args.id,
							conferenceUserId: target.id,
							committeeId: args.committeeId,
							present: true,
							type: 'NSA_SCAN',
							timestamp: now,
							triggeredByConferenceUserId: triggeredBy?.id ?? null
						})
						.returning({ id: schema.presenceEvent.id })
						.then(assertFirstEntryExists);

					return inserted.id;
				},
				{ isolationLevel: 'serializable' }
			);

			pubsub.created();
			pubsub.updated(newId);

			return db.query.presenceEvent
				.findFirst(
					query(
						ctx.abilities.presenceEvent.filter('read').merge({ where: { id: newId } }).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	/**
	 * Chair-facing: scan or manual-code → check the NSA out of whichever committee
	 * they are currently in. Idempotent: if the NSA is already checked out (or has
	 * no events yet), returns the latest event without inserting a new one.
	 */
	recordNsaCheckOut: t.drizzleField({
		type: PresenceEventRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			committeeId: t.arg.id({ required: true }),
			code: t.arg.string({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {

			const committee = await db.query.committee
				.findFirst(
					ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).query
						.single
				)
				.then(assertFindFirstExists);

			const target = await resolveNsaTarget({ committee, code: args.code });

			const triggeredBy = await db.query.conferenceUser.findFirst({
				where: {
					userEmail: ctx.mustBeLoggedIn().email!,
					conferenceId: committee.conferenceId
				}
			});

			const eventId = await db.transaction(
				async (tx) => {
					const latest = await tx.query.presenceEvent.findFirst({
						where: { conferenceUserId: target.id },
						orderBy: { timestamp: 'desc' }
					});

					if (!latest || !latest.present) {
						if (!latest) {
							throw new GraphQLError('NSA has no recorded check-in to check out from');
						}
						return latest.id;
					}

					const inserted = await tx
						.insert(schema.presenceEvent)
						.values({
							id: args.id,
							conferenceUserId: target.id,
							committeeId: latest.committeeId,
							present: false,
							type: 'NSA_SCAN',
							timestamp: new Date(),
							triggeredByConferenceUserId: triggeredBy?.id ?? null
						})
						.returning({ id: schema.presenceEvent.id })
						.then(assertFirstEntryExists);

					return inserted.id;
				},
				{ isolationLevel: 'serializable' }
			);

			pubsub.created();
			pubsub.updated(eventId);

			return db.query.presenceEvent
				.findFirst(
					query(
						ctx.abilities.presenceEvent.filter('read').merge({ where: { id: eventId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	/** Admin-only correction: insert an arbitrary historical event. */
	insertPresenceEvent: t.drizzleField({
		type: PresenceEventRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			conferenceUserId: t.arg.id({ required: true }),
			committeeId: t.arg.id({ required: true }),
			present: t.arg.boolean({ required: true }),
			markerType: t.arg({ type: enum_({ tsName: 'presenceEventMarker' }) }),
			timestamp: t.arg({ type: 'DateTime' }),
			note: t.arg.string()
		},
		resolve: async (query, _root, args, ctx) => {

			const committee = await db.query.committee
				.findFirst(
					ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).query
						.single
				)
				.then(assertFindFirstExists);

			const target = await db.query.conferenceUser
				.findFirst({
					where: {
						id: args.conferenceUserId,
						conferenceId: committee.conferenceId
					}
				})
				.then(assertFindFirstExists);

			const inserted = await db
				.insert(schema.presenceEvent)
				.values({
					id: args.id,
					conferenceUserId: target.id,
					committeeId: committee.id,
					present: args.present,
					type: args.markerType ?? 'MANUAL',
					timestamp: args.timestamp ?? new Date(),
					note: args.note ?? null
				})
				.returning({ id: schema.presenceEvent.id })
				.then(assertFirstEntryExists);

			pubsub.created();
			pubsub.updated(inserted.id);

			return db.query.presenceEvent
				.findFirst(
					query(
						ctx.abilities.presenceEvent.filter('read').merge({ where: { id: inserted.id } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	/** Admin-only correction: edit timestamp / eventType / committee / note of an event. */
	updatePresenceEvent: t.drizzleField({
		type: PresenceEventRef,
		args: {
			id: t.arg.id({ required: true }),
			timestamp: t.arg({ type: 'DateTime' }),
			present: t.arg.boolean(),
			committeeId: t.arg.id(),
			note: t.arg.string()
		},
		resolve: async (q, _root, args, ctx) => {
			const event = await db.query.presenceEvent
				.findFirst(
					ctx.abilities.presenceEvent.filter('update').merge({ where: { id: args.id } }).query
						.single
				)
				.then(assertFindFirstExists);

			if (args.committeeId && args.committeeId !== event.committeeId) {
				const newCommittee = await db.query.committee
					.findFirst({
						where: { id: args.committeeId }
					})
					.then(assertFindFirstExists);

				const currentCommittee = await db.query.committee
					.findFirst({ where: { id: event.committeeId } })
					.then(assertFindFirstExists);

				if (newCommittee.conferenceId !== currentCommittee.conferenceId) {
					throw new GraphQLError('Cannot move an event to a committee in a different conference');
				}
			}

			const updateSet: Record<string, unknown> = {};
			if (args.timestamp !== undefined && args.timestamp !== null)
				updateSet.timestamp = args.timestamp;
			if (args.present !== undefined && args.present !== null) updateSet.present = args.present;
			if (args.committeeId !== undefined && args.committeeId !== null)
				updateSet.committeeId = args.committeeId;
			if (args.note !== undefined) updateSet.note = args.note;

			if (Object.keys(updateSet).length > 0) {
				await db
					.update(schema.presenceEvent)
					.set(updateSet)
					.where(eq(schema.presenceEvent.id, args.id));
			}

			pubsub.updated(args.id);

			return db.query.presenceEvent
				.findFirst(
					q(
						ctx.abilities.presenceEvent.filter('read').merge({ where: { id: args.id } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	/**
	 * Admin-only correction: delete an event. Returns the deleted row so the
	 * rumble client (which auto-selects `{ id }` on every mutation) has a valid
	 * subfield to read.
	 */
	deletePresenceEvent: t.drizzleField({
		type: PresenceEventRef,
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (_query, _root, args, ctx) => {
			const event = await db.query.presenceEvent
				.findFirst(
					ctx.abilities.presenceEvent.filter('delete').merge({ where: { id: args.id } }).query
						.single
				)
				.then(assertFindFirstExists);

			await db.delete(schema.presenceEvent).where(eq(schema.presenceEvent.id, event.id));

			pubsub.removed();
			return event;
		}
	}),

	/**
	 * Admin-only: regenerate the manual fallback code for an NSA user.
	 */
	regenerateNsaAttendanceCode: t.drizzleField({
		type: ConferenceUserRef,
		args: {
			conferenceUserId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			const target = await db.query.conferenceUser
				.findFirst(
					ctx.abilities.conferenceUser
						.filter('update')
						.merge({ where: { id: args.conferenceUserId } }).query.single
				)
				.then(assertFindFirstExists);

			if (target.conferenceUserType !== 'NON_STATE_ACTOR') {
				throw new GraphQLError('Attendance code is only meaningful for NSA users');
			}

			await assignAttendanceCode(target.id, target.conferenceId);

			return db.query.conferenceUser
				.findFirst(
					query(
						ctx.abilities.conferenceUser.filter('read').merge({ where: { id: target.id } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
