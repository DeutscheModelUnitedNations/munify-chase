import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isTeamInConference } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { nanoidValidation } from '$lib/helpers/nanoid';

abilityBuilder.request.allow('read').when((ctx) => {
	const userId = ctx.mustBeLoggedIn().sub;
	return {
		where: {
			OR: [{ committee: isTeamInConference(ctx) }, { conferenceUser: { user: { id: userId } } }]
		}
	};
});

// Chairs mark a request as resolved.
abilityBuilder.request.allow('update').when((ctx) => ({
	where: { committee: isTeamInConference(ctx) }
}));

// The submitter may withdraw their own request; chairs may withdraw any
// request in their committee too.
abilityBuilder.request.allow('delete').when((ctx) => {
	const userId = ctx.mustBeLoggedIn().sub;
	return {
		where: {
			OR: [{ committee: isTeamInConference(ctx) }, { conferenceUser: { user: { id: userId } } }]
		}
	};
});

export const RequestRef = object({ table: 'request' });

const pubsub = rumblePubsub({ table: 'request' });
query({ table: 'request' });

schemaBuilder.mutationFields((t) => ({
	createRequest: t.drizzleField({
		type: RequestRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			committeeId: t.arg.id({ required: true }),
			requestTypeId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			const committee = await db.query.committee
				.findFirst({ where: { id: args.committeeId } })
				.then(assertFindFirstExists);

			if (!committee.allowRequests) {
				throw new GraphQLError('Requests are not enabled for this committee.');
			}

			const requestType = await db.query.requestType
				.findFirst({
					where: {
						id: args.requestTypeId,
						conferenceId: committee.conferenceId,
						enabled: true
					}
				})
				.then(assertFindFirstExists);

			const self = await db.query.conferenceUser
				.findFirst({
					where: {
						userEmail: ctx.mustBeLoggedIn().email!,
						conferenceId: committee.conferenceId
					}
				})
				.then(assertFindFirstExists);

			if (requestType.delegatesOnly && self.conferenceUserType !== 'DELEGATE') {
				throw new GraphQLError('This request type is only available to delegates.');
			}

			// Delegates are seated in one specific committee via committeeMemberId -
			// keep them from filing requests into a committee they are not part of.
			// NSAs have no committeeMemberId and may request into any committee of
			// the conference they are currently present in.
			if (self.committeeMemberId) {
				const seat = await db.query.committeeMember
					.findFirst({ where: { id: self.committeeMemberId } })
					.then(assertFindFirstExists);
				if (seat.committeeId !== committee.id) {
					throw new GraphQLError('You are not seated in this committee.');
				}
			}

			// The chairs may already have queued this type for the delegate's seat
			const seats = [
				...(self.committeeMemberId ? [{ committeeMemberId: self.committeeMemberId }] : []),
				...(self.conferenceMemberId ? [{ conferenceMemberId: self.conferenceMemberId }] : [])
			];
			if (seats.length > 0) {
				const queuedByChairs = await db.query.request.findFirst({
					where: {
						committeeId: committee.id,
						requestTypeId: requestType.id,
						status: 'PENDING',
						OR: seats
					}
				});
				if (queuedByChairs) {
					throw new GraphQLError('The chairs already queued this request for you.');
				}
			}

			let result;
			try {
				result = await db
					.insert(schema.request)
					.values({
						id: args.id,
						committeeId: committee.id,
						requestTypeId: requestType.id,
						conferenceUserId: self.id
					})
					.returning()
					.then(assertFirstEntryExists);
			} catch (err) {
				if ((err as { code?: string }).code === '23505') {
					throw new GraphQLError('You already have a pending request of this type.');
				}
				throw err;
			}

			pubsub.created();

			return db.query.request
				.findFirst(
					query(
						ctx.abilities.request.filter('read').merge({ where: { id: result.id } }).query.single
					)
				)
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
			if (!!args.committeeMemberId === !!args.conferenceMemberId) {
				throw new GraphQLError('Set exactly one of committeeMemberId and conferenceMemberId.');
			}

			const committee = await db.query.committee
				.findFirst(
					ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).query
						.single
				)
				.then(assertFindFirstExists);

			const requestType = await db.query.requestType
				.findFirst({
					where: { id: args.requestTypeId, conferenceId: committee.conferenceId, enabled: true }
				})
				.then(assertFindFirstExists);

			if (args.committeeMemberId) {
				await db.query.committeeMember
					.findFirst({ where: { id: args.committeeMemberId, committeeId: committee.id } })
					.then(assertFindFirstExists);
			} else {
				await db.query.conferenceMember
					.findFirst({
						where: { id: args.conferenceMemberId!, conferenceId: committee.conferenceId }
					})
					.then(assertFindFirstExists);
				// Conference members are the NSAs, who never get delegates-only types
				if (requestType.delegatesOnly) {
					throw new GraphQLError('This request type is only available to delegates.');
				}
			}

			// The seat may already be in the queue through a delegate's own request
			const seat = args.committeeMemberId
				? { committeeMemberId: args.committeeMemberId }
				: { conferenceMemberId: args.conferenceMemberId! };
			const duplicate = await db.query.request.findFirst({
				where: {
					committeeId: committee.id,
					requestTypeId: requestType.id,
					status: 'PENDING',
					OR: [seat, { conferenceUser: seat }]
				}
			});
			if (duplicate) {
				throw new GraphQLError('This seat already has a pending request of this type.');
			}

			let result;
			try {
				result = await db
					.insert(schema.request)
					.values({
						id: args.id,
						committeeId: committee.id,
						requestTypeId: requestType.id,
						committeeMemberId: args.committeeMemberId,
						conferenceMemberId: args.conferenceMemberId
					})
					.returning()
					.then(assertFirstEntryExists);
			} catch (err) {
				if ((err as { code?: string }).code === '23505') {
					throw new GraphQLError('This seat already has a pending request of this type.');
				}
				throw err;
			}

			pubsub.created();

			return db.query.request
				.findFirst(
					query(
						ctx.abilities.request.filter('read').merge({ where: { id: result.id } }).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	resolveRequest: t.drizzleField({
		type: RequestRef,
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			const request = await db.query.request
				.findFirst(
					ctx.abilities.request.filter('update').merge({ where: { id: args.id } }).query.single
				)
				.then(assertFindFirstExists);

			if (request.status !== 'PENDING') {
				throw new GraphQLError('Only pending requests can be resolved.');
			}

			const resolvedBy = await db.query.conferenceUser.findFirst({
				where: {
					userEmail: ctx.mustBeLoggedIn().email!,
					conferenceId: (
						await db.query.committee
							.findFirst({ where: { id: request.committeeId } })
							.then(assertFindFirstExists)
					).conferenceId
				}
			});

			await db
				.update(schema.request)
				.set({
					status: 'RESOLVED',
					resolvedByConferenceUserId: resolvedBy?.id ?? null,
					resolvedAt: new Date()
				})
				.where(eq(schema.request.id, args.id));

			pubsub.removed();

			return db.query.request
				.findFirst(
					query(ctx.abilities.request.filter('read').merge({ where: { id: args.id } }).query.single)
				)
				.then(assertFindFirstExists);
		}
	}),

	withdrawRequest: t.drizzleField({
		type: RequestRef,
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			const request = await db.query.request
				.findFirst(
					ctx.abilities.request.filter('delete').merge({ where: { id: args.id } }).query.single
				)
				.then(assertFindFirstExists);

			if (request.status !== 'PENDING') {
				throw new GraphQLError('Only pending requests can be withdrawn.');
			}

			await db
				.update(schema.request)
				.set({ status: 'WITHDRAWN' })
				.where(eq(schema.request.id, args.id));

			pubsub.removed();

			return db.query.request
				.findFirst(
					query(ctx.abilities.request.filter('read').merge({ where: { id: args.id } }).query.single)
				)
				.then(assertFindFirstExists);
		}
	})
}));
