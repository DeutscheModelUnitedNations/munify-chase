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

			// Rumble's auto-generated `requests` LIST field only re-subscribes on
			// "created"/"removed" pubsub actions (see makePubSubInstance /
			// registerOnInstance in @m1212e/rumble) - "updated" only wakes up a
			// subscriber on the singular `request(id)` field. A resolved request
			// leaves every chair's PENDING list, so it has to fire "removed" (like
			// withdrawRequest below) for that list to live-update; `updated(id)`
			// here would silently leave chairs' lists stale until a manual refresh.
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
