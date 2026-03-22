import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { and, eq, lt } from 'drizzle-orm';
import { basics } from './basics';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

const { ref, pubsub } = basics('paperClauseLock');

const LOCK_EXPIRY_MS = 60_000; // 60 seconds

abilityBuilder.paperClauseLock.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

schemaBuilder.mutationFields((t) => ({
	acquireClauseLock: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			clauseId: t.arg.string({ required: true })
		},
		resolve: async (query, root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub }
					}
				})
				.then(assertFindFirstExists);

			// Clean expired locks for this paper
			const expiryThreshold = new Date(Date.now() - LOCK_EXPIRY_MS);
			const expiredLocks = await db
				.delete(schema.paperClauseLock)
				.where(
					and(
						eq(schema.paperClauseLock.paperId, args.paperId),
						lt(schema.paperClauseLock.acquiredAt, expiryThreshold)
					)
				)
				.returning();

			for (const expired of expiredLocks) {
				pubsub.removed();
			}

			// Check existing lock for this (paperId, clauseId)
			const existingLock = await db.query.paperClauseLock.findFirst({
				where: {
					paperId: args.paperId,
					clauseId: args.clauseId
				}
			});

			if (existingLock) {
				if (existingLock.conferenceUserId === conferenceUser.id) {
					// Refresh own lock
					await db
						.update(schema.paperClauseLock)
						.set({ acquiredAt: new Date() })
						.where(eq(schema.paperClauseLock.id, existingLock.id));

					pubsub.updated(existingLock.id);

					return db.query.paperClauseLock
						.findFirst(
							query(
								ctx.abilities.paperClauseLock
									.filter('read')
									.merge({ where: { id: existingLock.id } }).query.single
							)
						)
						.then(assertFindFirstExists);
				} else {
					throw new GraphQLError('Clause is locked by another user');
				}
			}

			// Insert new lock — unique constraint handles the race condition
			try {
				const result = await db
					.insert(schema.paperClauseLock)
					.values({
						paperId: args.paperId,
						clauseId: args.clauseId,
						conferenceUserId: conferenceUser.id
					})
					.returning()
					.then(assertFirstEntryExists);

				// Use created() not updated(id) — other clients' findMany subscriptions
				// don't know this ID yet, so updated(id) wouldn't reach them
				pubsub.created();
				return db.query.paperClauseLock
					.findFirst(
						query(
							ctx.abilities.paperClauseLock.filter('read').merge({
								where: { id: result.id }
							}).query.single
						)
					)
					.then(assertFindFirstExists);
			} catch (e: unknown) {
				// Unique constraint violation — another user won the race
				if (
					e instanceof Error &&
					(e.message.includes('unique') ||
						e.message.includes('duplicate') ||
						e.message.includes('UNIQUE'))
				) {
					throw new GraphQLError('Clause is locked by another user');
				}
				throw e;
			}
		}
	}),

	releaseClauseLock: t.field({
		type: 'Boolean',
		args: {
			paperId: t.arg.id({ required: true }),
			clauseId: t.arg.string({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub }
					}
				})
				.then(assertFindFirstExists);

			const deleted = await db
				.delete(schema.paperClauseLock)
				.where(
					and(
						eq(schema.paperClauseLock.paperId, args.paperId),
						eq(schema.paperClauseLock.clauseId, args.clauseId),
						eq(schema.paperClauseLock.conferenceUserId, conferenceUser.id)
					)
				)
				.returning();

			for (const lock of deleted) {
				pubsub.removed();
			}

			return true;
		}
	}),

	releaseAllMyLocks: t.field({
		type: 'Boolean',
		args: {
			paperId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub }
					}
				})
				.then(assertFindFirstExists);

			const deleted = await db
				.delete(schema.paperClauseLock)
				.where(
					and(
						eq(schema.paperClauseLock.paperId, args.paperId),
						eq(schema.paperClauseLock.conferenceUserId, conferenceUser.id)
					)
				)
				.returning();

			for (const lock of deleted) {
				pubsub.removed();
			}

			return true;
		}
	})
}));
