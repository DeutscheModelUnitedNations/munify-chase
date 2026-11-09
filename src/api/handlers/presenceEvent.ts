import { db, schema } from '#api/db/db';
import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '#api/rumble';
import {
	isAdminInConference,
	isTeamInConference,
	linkedDelegator,
	SYNCED_CONFERENCE
} from '#api/services/authHelper';
import { resolveNsaTarget } from '#api/services/nsaCards';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { findCommittee } from './helpers/scopedLookups';
import { givenFields, hasFields } from './helpers/givenFields';

// The linked DELEGATOR reads back the presence of its conferences (`docs/plans/delegator-link.md`).
abilityBuilder.presenceEvent.allow('read').when(
	linkedDelegator({
		where: { committee: { conference: SYNCED_CONFERENCE } },
		columns: {
			id: true,
			conferenceUserId: true,
			committeeId: true,
			present: true,
			type: true,
			timestamp: true
		}
	})
);

abilityBuilder.presenceEvent.allow('read').when((ctx) => ({
	where: { committee: isTeamInConference(ctx) }
}));

abilityBuilder.presenceEvent.allow(['update', 'delete']).when((ctx) => ({
	where: { committee: isAdminInConference(ctx) }
}));

const PresenceEventRef = object({ table: 'presenceEvent' });

const pubsub = rumblePubsub({ table: 'presenceEvent' });
query({ table: 'presenceEvent' });

type ResolverContext = (typeof schemaBuilder)['$inferSchemaTypes']['Context'];

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** An event stays in its conference: it may only move to another committee of it. */
async function assertSameConference({ from, to }: { from: string; to: string }) {
	const target = await findCommittee(to);
	const current = await findCommittee(from);
	if (target.conferenceId !== current.conferenceId) {
		throw new GraphQLError('Cannot move an event to a committee in a different conference');
	}
}

interface NsaScanRecord {
	tx: Tx;
	/** The new event's id, when the client made one. */
	id: string | undefined;
	targetId: string;
	committeeId: string;
	triggeredById: string | null;
}

/** The NSA's latest event, when it says they are in a committee. */
async function currentPresence({ tx, targetId }: { tx: Tx; targetId: string }) {
	const latest = await tx.query.presenceEvent.findFirst({
		where: { conferenceUserId: targetId },
		orderBy: { timestamp: 'desc' }
	});
	return { latest, present: latest?.present ? latest : undefined };
}

async function insertScan({
	tx,
	values
}: {
	tx: Tx;
	values: typeof schema.presenceEvent.$inferInsert;
}) {
	const inserted = await tx
		.insert(schema.presenceEvent)
		.values(values)
		.returning({ id: schema.presenceEvent.id })
		.then(assertFirstEntryExists);
	return inserted.id;
}

async function checkIn({ tx, id, targetId, committeeId, triggeredById }: NsaScanRecord) {
	const { present } = await currentPresence({ tx, targetId });
	if (present?.committeeId === committeeId) return present.id;

	const now = new Date();
	if (present) {
		await tx.insert(schema.presenceEvent).values({
			conferenceUserId: targetId,
			committeeId: present.committeeId,
			present: false,
			timestamp: new Date(now.getTime() - 1),
			triggeredByConferenceUserId: triggeredById,
			type: 'AUTO_SWITCH'
		});
	}
	return insertScan({
		tx,
		values: {
			id,
			conferenceUserId: targetId,
			committeeId,
			present: true,
			type: 'NSA_SCAN',
			timestamp: now,
			triggeredByConferenceUserId: triggeredById
		}
	});
}

async function checkOut({ tx, id, targetId, triggeredById }: NsaScanRecord) {
	const { latest, present } = await currentPresence({ tx, targetId });
	if (!latest) throw new GraphQLError('NSA has no recorded check-in to check out from');
	if (!present) return latest.id;
	return insertScan({
		tx,
		values: {
			id,
			conferenceUserId: targetId,
			committeeId: present.committeeId,
			present: false,
			type: 'NSA_SCAN',
			timestamp: new Date(),
			triggeredByConferenceUserId: triggeredById
		}
	});
}

/** The committee, if the caller may run its presence. */
async function updatableCommittee({
	ctx,
	committeeId
}: {
	ctx: ResolverContext;
	committeeId: string;
}) {
	return db.query.committee
		.findFirst(
			(await ctx.abilities.committee.filter('update')).merge({ where: { id: committeeId } }).query
				.single
		)
		.then(assertFindFirstExists);
}

/** Who a chair's scan (or pick by name) is about, and which team member recorded it. */
async function nsaScan({
	ctx,
	committeeId,
	code,
	conferenceUserId
}: {
	ctx: ResolverContext;
	committeeId: string;
	code?: string | null;
	conferenceUserId?: string | number | null;
}) {
	const committee = await updatableCommittee({ ctx, committeeId });
	const target = await resolveNsaTarget({
		conferenceId: committee.conferenceId,
		code,
		conferenceUserId: conferenceUserId ? String(conferenceUserId) : null
	});
	const recorder = await db.query.conferenceUser.findFirst({
		where: { userEmail: ctx.mustBeLoggedIn().email!, conferenceId: committee.conferenceId }
	});
	return { target, triggeredById: recorder?.id ?? null };
}

schemaBuilder.mutationFields((t) => {
	/** What a chair's scan names: the scanned code, or the NSA picked by name. */
	const nsaScanArgs = () => ({
		id: t.arg.id().validate(nanoidValidation),
		committeeId: t.arg.id({ required: true }),
		code: t.arg.string({
			description: 'A scanned nametag or NSA card; verified here again.'
		}),
		conferenceUserId: t.arg.id({
			description: 'The NSA picked by name, when the code does not scan.'
		})
	});

	/** A chair's scan: who it names, then `record` writes the event in one serializable transaction. */
	const nsaScanField = (record: (scan: NsaScanRecord) => Promise<string>) =>
		t.drizzleField({
			type: PresenceEventRef,
			args: nsaScanArgs(),
			resolve: async (query, _root, args, ctx) => {
				const committeeId = String(args.committeeId);
				const { target, triggeredById } = await nsaScan({
					ctx,
					committeeId,
					code: args.code,
					conferenceUserId: args.conferenceUserId
				});
				const eventId = await db.transaction(
					(tx) =>
						record({
							tx,
							id: args.id ?? undefined,
							targetId: target.id,
							committeeId,
							triggeredById
						}),
					{ isolationLevel: 'serializable' }
				);

				pubsub.created();
				pubsub.updated(eventId);

				return db.query.presenceEvent
					.findFirst(
						query(
							(await ctx.abilities.presenceEvent.filter('read')).merge({ where: { id: eventId } })
								.query.single
						)
					)
					.then(assertFindFirstExists);
			}
		});

	return {
		/**
		 * Chair-facing: scan or manual-code → check the NSA into the given committee.
		 * If the NSA is currently checked into a different committee, automatically
		 * inserts a CHECK_OUT for that committee 1ms before the new CHECK_IN so the
		 * timeline stays strictly ordered. Idempotent if already in the same committee.
		 */
		recordNsaCheckIn: nsaScanField(checkIn),

		/**
		 * Chair-facing: scan or manual-code → check the NSA out of whichever committee
		 * they are currently in. Idempotent: if the NSA is already checked out, returns
		 * the latest event without inserting a new one.
		 */
		recordNsaCheckOut: nsaScanField(checkOut),

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
				const committee = await updatableCommittee({ ctx, committeeId: String(args.committeeId) });

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
							(await ctx.abilities.presenceEvent.filter('read')).merge({
								where: { id: inserted.id }
							}).query.single
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
						(await ctx.abilities.presenceEvent.filter('update')).merge({ where: { id: args.id } })
							.query.single
					)
					.then(assertFindFirstExists);

				if (args.committeeId && args.committeeId !== event.committeeId) {
					await assertSameConference({ from: event.committeeId, to: args.committeeId });
				}

				const updateSet = givenFields({
					args,
					keys: ['timestamp', 'present', 'committeeId'],
					clearable: ['note']
				});
				if (hasFields(updateSet)) {
					await db
						.update(schema.presenceEvent)
						.set(updateSet)
						.where(eq(schema.presenceEvent.id, args.id));
				}

				pubsub.updated(args.id);

				return db.query.presenceEvent
					.findFirst(
						q(
							(await ctx.abilities.presenceEvent.filter('read')).merge({ where: { id: args.id } })
								.query.single
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
						(await ctx.abilities.presenceEvent.filter('delete')).merge({ where: { id: args.id } })
							.query.single
					)
					.then(assertFindFirstExists);

				await db.delete(schema.presenceEvent).where(eq(schema.presenceEvent.id, event.id));

				pubsub.removed();
				return event;
			}
		})
	};
});
