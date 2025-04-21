import { schemaBuilder } from '$api/rumble';
import { GraphQLError } from 'graphql';
import { basics } from './basics';
import { db, schema } from '$api/db/db';
import { and, count, eq, gt, gte, sql } from 'drizzle-orm';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { SpeakersListRef } from './speakersList';

const { arg, ref, pubsub, table } = basics('speakerOnList');

schemaBuilder.mutationFields((t) => {
	return {
		addSpeakerOnList: t.drizzleField({
			type: ref,
			args: {
				committeeMemberId: t.arg.id(),
				conferenceMemberId: t.arg.id(),
				speakersListId: t.arg.id({ required: true }),
				position: t.arg.int()
			},
			resolve: async (query, root, args, ctx, info) => {
				if (args.committeeMemberId && args.conferenceMemberId) {
					throw new GraphQLError('Cannot set both committeeMemberId and conferenceMemberId');
				}

				if (!args.committeeMemberId && !args.conferenceMemberId) {
					throw new GraphQLError('Must set either committeeMemberId or conferenceMemberId');
				}

				const createdId = await db.transaction(async (tx) => {
					let position = args.position;
					if (!position) {
						// in case the caller did not provide a position, just append as last entry
						position = (
							await tx
								.select({ count: count() })
								.from(table)
								.where(eq(table.speakersListId, args.speakersListId))
								.then(assertFirstEntryExists)
						).count; // since the position is 0 based, we can just use the count as new position
					} else {
						// if they did provide a position, we want to shift all the entries up which are
						// equal or higher in position
						await tx
							.update(table)
							.set({
								position: sql`${table.position} + 1`
							})
							.where(
								and(
									eq(table.speakersListId, args.speakersListId),
									gte(table.position, position),
									ctx.abilities.speakerOnList.filter('update').single.where
								)
							);
					}

					// we do query this for checking the required permissions
					const speakersList = await tx.query.speakersList
						.findFirst({
							where: and(
								eq(table.id, args.speakersListId),
								ctx.abilities.speakersList.filter('update').single.where
							)
						})
						.then(assertFindFirstExists);

					const created = await tx
						.insert(table)
						.values({
							committeeMemberId: args.committeeMemberId,
							conferenceMemberId: args.conferenceMemberId,
							speakersListId: speakersList.id,
							position
						})
						.returning({ id: table.id })
						.then(assertFirstEntryExists);

					pubsub.created();

					return created.id;
				});

				return db.query.speakerOnList
					.findFirst(
						query(
							ctx.abilities.speakerOnList.filter('read', {
								inject: { where: { id: eq(table.id, createdId) } }
							}).single
						)
					)
					.then(assertFindFirstExists);
			}
		}),
		removeSpeakerOnList: t.drizzleField({
			type: SpeakersListRef,
			args: {
				speakerOnListId: t.arg.id({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				const removed = await db.transaction(async (tx) => {
					const deleted = await tx
						.delete(table)
						.where(
							and(
								eq(table.id, args.speakerOnListId),
								ctx.abilities.speakerOnList.filter('delete').single.where
							)
						)
						.returning()
						.then(assertFirstEntryExists);

					await tx
						.update(table)
						.set({
							position: sql`${table.position} - 1`
						})
						.where(
							and(
								eq(table.speakersListId, deleted.speakersListId),
								gt(table.position, deleted.position),
								ctx.abilities.speakerOnList.filter('update').single.where
							)
						);

					pubsub.removed();

					return deleted;
				});

				return db.query.speakersList
					.findFirst(
						query(
							ctx.abilities.speakersList.filter('read', {
								inject: { where: { id: eq(schema.speakersList.id, removed.speakersListId) } }
							}).single
						)
					)
					.then(assertFindFirstExists);
			}
		})
	};
});
