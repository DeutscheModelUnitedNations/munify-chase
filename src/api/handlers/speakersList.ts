import { db, schema } from '$api/db/db';
import { schemaBuilder, pubsub, abilityBuilder } from '$api/rumble';
import { and, eq } from 'drizzle-orm';
import { basics } from './basics';
import { assertFindFirstExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

const { arg, ref, pubsub: speakersListPubSub, table } = basics('speakersList');
export const SpeakersListRef = ref;

abilityBuilder.speakersList.allow(['read', 'update', 'delete']);

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
				isClosed: t.arg.boolean()
			},
			resolve: async (query, root, args, ctx, info) => {
				if (args.startTimestamp && args.stopTimer) {
					throw new GraphQLError('startTimestamp and stopTimer are mutually exclusive');
				}

				await db
					.update(table)
					.set({
						speakingTime: args.speakingTime ?? undefined,
						timeLeft: args.timeLeft ?? undefined,
						startTimestamp: args.stopTimer ? null : (args.startTimestamp ?? undefined),
						isClosed: args.isClosed ?? undefined
					})
					.where(and(eq(table.id, args.id), ctx.abilities.speakersList.filter('update').sql.where));

				speakersListPubSub.updated(args.id);

				return db.query.speakersList
					.findFirst(
						query(
							ctx.abilities.speakersList.filter('read', {
								inject: { where: { id: args.id } }
							}).query.single
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
			resolve: async (query, root, args, ctx, info) => {
				const deleted = await db
					.delete(schema.speakerOnList)
					.where(
						and(
							eq(schema.speakerOnList.speakersListId, args.id),
							ctx.abilities.speakerOnList.filter('delete').sql.where
						)
					)
					.returning();

				if (deleted.length > 0) {
					pubsub({ table: 'speakerOnList' }).removed(deleted.map((d) => d.id));
				}

				speakersListPubSub.updated(args.id);

				return db.query.speakersList
					.findFirst(
						query(
							ctx.abilities.speakersList.filter('read', {
								inject: { where: { id: args.id } }
							}).query.single
						)
					)
					.then(assertFindFirstExists);
			}
		})
	};
});
