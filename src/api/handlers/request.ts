import { db, schema } from '#api/db/db';
import type { Context } from '#api/context';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '#api/rumble';
import { isTeamInConference } from '#api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { nanoidValidation } from '#lib/helpers/nanoid';
import {
	findCommittee,
	findOwnConferenceUser,
	findUpdatableCommittee,
	type HandlerContext
} from './helpers/scopedLookups';
import {
	assertPending,
	assertRequestTypeFor,
	isUniqueViolation,
	manualRequestSeat,
	requestSeats
} from './helpers/requestRules';

/** The team of the committee, and whoever filed the request. */
function teamOrSubmitter(ctx: Context) {
	const userId = ctx.mustBeLoggedIn().sub;
	return {
		where: {
			OR: [{ committee: isTeamInConference(ctx) }, { conferenceUser: { user: { id: userId } } }]
		}
	};
}

abilityBuilder.request.allow('read').when(teamOrSubmitter);

// Chairs mark a request as resolved.
abilityBuilder.request.allow('update').when((ctx) => ({
	where: { committee: isTeamInConference(ctx) }
}));

// The submitter may withdraw their own request; chairs may withdraw any
// request in their committee too.
abilityBuilder.request.allow('delete').when(teamOrSubmitter);

const RequestRef = object({ table: 'request' });

const pubsub = rumblePubsub({ table: 'request' });
query({ table: 'request' });

async function readableRequest(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.request.filter('read')).merge({ where: { id } }).query.single;
}

/** A request type of the conference that is switched on. */
function findEnabledRequestType({
	requestTypeId,
	conferenceId
}: {
	requestTypeId: string;
	conferenceId: string;
}) {
	return db.query.requestType
		.findFirst({ where: { id: requestTypeId, conferenceId, enabled: true } })
		.then(assertFindFirstExists);
}

/** A pending request of this type for any of the seats, in the committee. */
function findPendingFor({
	committeeId,
	requestTypeId,
	seats
}: {
	committeeId: string;
	requestTypeId: string;
	seats: object[];
}) {
	return db.query.request.findFirst({
		where: { committeeId, requestTypeId, status: 'PENDING', OR: seats }
	});
}

/**
 * Delegates are seated in one specific committee via committeeMemberId - keep them from filing
 * requests into a committee they are not part of. NSAs have no committeeMemberId and may request
 * into any committee of the conference they are currently present in.
 */
async function assertSeatedIn({
	committeeMemberId,
	committeeId
}: {
	committeeMemberId: string | null;
	committeeId: string;
}) {
	if (!committeeMemberId) return;
	const seat = await db.query.committeeMember
		.findFirst({ where: { id: committeeMemberId } })
		.then(assertFindFirstExists);
	if (seat.committeeId !== committeeId) {
		throw new GraphQLError('You are not seated in this committee.');
	}
}

/** Files a request, answering `duplicateMessage` when the seat already has one pending. */
async function insertRequest({
	values,
	duplicateMessage
}: {
	values: typeof schema.request.$inferInsert;
	duplicateMessage: string;
}) {
	try {
		const result = await db
			.insert(schema.request)
			.values(values)
			.returning()
			.then(assertFirstEntryExists);
		pubsub.created();
		return result.id;
	} catch (err) {
		if (isUniqueViolation(err)) throw new GraphQLError(duplicateMessage);
		throw err;
	}
}

/** Checks the seat a chair queues for belongs to the committee or its conference. */
async function assertManualSeat({
	seat,
	committee,
	delegatesOnly
}: {
	seat: { committeeMemberId: string } | { conferenceMemberId: string };
	committee: { id: string; conferenceId: string };
	delegatesOnly: boolean;
}) {
	if ('committeeMemberId' in seat) {
		await db.query.committeeMember
			.findFirst({ where: { id: seat.committeeMemberId, committeeId: committee.id } })
			.then(assertFindFirstExists);
		return;
	}
	await db.query.conferenceMember
		.findFirst({ where: { id: seat.conferenceMemberId, conferenceId: committee.conferenceId } })
		.then(assertFindFirstExists);
	// Conference members are the NSAs, who never get delegates-only types
	assertRequestTypeFor({ requestType: { delegatesOnly }, conferenceUserType: 'NON_STATE_ACTOR' });
}

/** A pending request the caller may resolve (`update`) or withdraw (`delete`). */
async function findPendingRequest({
	ctx,
	id,
	action,
	message
}: {
	ctx: HandlerContext;
	id: string;
	action: 'update' | 'delete';
	message: string;
}) {
	const request = await db.query.request
		.findFirst((await ctx.abilities.request.filter(action)).merge({ where: { id } }).query.single)
		.then(assertFindFirstExists);
	assertPending({ request, message });
	return request;
}

/** Closes a request and reads it back. */
async function closeRequest({
	ctx,
	id,
	set
}: {
	ctx: HandlerContext;
	id: string;
	set: Partial<typeof schema.request.$inferInsert>;
}) {
	await db.update(schema.request).set(set).where(eq(schema.request.id, id));
	pubsub.removed();
	return readableRequest(ctx, id);
}

schemaBuilder.mutationFields((t) => ({
	createRequest: t.drizzleField({
		type: RequestRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			committeeId: t.arg.id({ required: true }),
			requestTypeId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			const committee = await findCommittee(args.committeeId);
			if (!committee.allowRequests) {
				throw new GraphQLError('Requests are not enabled for this committee.');
			}

			const requestType = await findEnabledRequestType({
				requestTypeId: args.requestTypeId,
				conferenceId: committee.conferenceId
			});
			const self = await findOwnConferenceUser(ctx, committee.conferenceId).then(
				assertFindFirstExists
			);
			assertRequestTypeFor({ requestType, conferenceUserType: self.conferenceUserType });
			await assertSeatedIn({
				committeeMemberId: self.committeeMemberId,
				committeeId: committee.id
			});

			// The chairs may already have queued this type for the delegate's seat
			const seats = requestSeats(self);
			const queuedByChairs =
				seats.length > 0 &&
				(await findPendingFor({ committeeId: committee.id, requestTypeId: requestType.id, seats }));
			if (queuedByChairs) {
				throw new GraphQLError('The chairs already queued this request for you.');
			}

			const id = await insertRequest({
				values: {
					id: args.id,
					committeeId: committee.id,
					requestTypeId: requestType.id,
					conferenceUserId: self.id
				},
				duplicateMessage: 'You already have a pending request of this type.'
			});

			return db.query.request
				.findFirst(query(await readableRequest(ctx, id)))
				.then(assertFindFirstExists);
		}
	}),

	// Chairs queue a request on behalf of a seat, e.g. a raised placard or a
	// delegation without an account. Mirrors addSpeakerOnList's seat arguments.
	createManualRequest: t.drizzleField({
		type: RequestRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			committeeId: t.arg.id({ required: true }),
			requestTypeId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id(),
			conferenceMemberId: t.arg.id()
		},
		resolve: async (query, _root, args, ctx) => {
			const seat = manualRequestSeat(args);
			const committee = await findUpdatableCommittee(ctx, args.committeeId);
			const requestType = await findEnabledRequestType({
				requestTypeId: args.requestTypeId,
				conferenceId: committee.conferenceId
			});
			await assertManualSeat({ seat, committee, delegatesOnly: requestType.delegatesOnly });

			// The seat may already be in the queue through a delegate's own request
			const duplicate = await findPendingFor({
				committeeId: committee.id,
				requestTypeId: requestType.id,
				seats: [seat, { conferenceUser: seat }]
			});
			const duplicateMessage = 'This seat already has a pending request of this type.';
			if (duplicate) throw new GraphQLError(duplicateMessage);

			const id = await insertRequest({
				values: {
					id: args.id,
					committeeId: committee.id,
					requestTypeId: requestType.id,
					committeeMemberId: args.committeeMemberId,
					conferenceMemberId: args.conferenceMemberId
				},
				duplicateMessage
			});

			return db.query.request
				.findFirst(query(await readableRequest(ctx, id)))
				.then(assertFindFirstExists);
		}
	}),

	resolveRequest: t.drizzleField({
		type: RequestRef,
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			const request = await findPendingRequest({
				ctx,
				id: args.id,
				action: 'update',
				message: 'Only pending requests can be resolved.'
			});
			const committee = await findCommittee(request.committeeId);
			const resolvedBy = await findOwnConferenceUser(ctx, committee.conferenceId);

			const filter = await closeRequest({
				ctx,
				id: args.id,
				set: {
					status: 'RESOLVED',
					resolvedByConferenceUserId: resolvedBy?.id ?? null,
					resolvedAt: new Date()
				}
			});
			return db.query.request.findFirst(query(filter)).then(assertFindFirstExists);
		}
	}),

	withdrawRequest: t.drizzleField({
		type: RequestRef,
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			await findPendingRequest({
				ctx,
				id: args.id,
				action: 'delete',
				message: 'Only pending requests can be withdrawn.'
			});

			const filter = await closeRequest({ ctx, id: args.id, set: { status: 'WITHDRAWN' } });
			return db.query.request.findFirst(query(filter)).then(assertFindFirstExists);
		}
	})
}));
