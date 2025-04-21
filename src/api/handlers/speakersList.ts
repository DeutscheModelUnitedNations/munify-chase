import { db } from '$api/db/db';
import { schemaBuilder } from '$api/rumble';
import { and, eq } from 'drizzle-orm';
import { basics } from './basics';
import { assertFindFirstExists } from '@m1212e/rumble';

const { arg, ref, pubsub, table } = basics('speakersList');
export const SpeakersListRef = ref;

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
				isClosed: t.arg.boolean()
			},
			resolve: async (query, root, args, ctx, info) => {
				await db
					.update(table)
					.set({
						speakingTime: args.speakingTime ?? undefined,
						timeLeft: args.timeLeft ?? undefined,
						startTimestamp: args.startTimestamp ?? undefined,
						isClosed: args.isClosed ?? undefined
					})
					.where(
						and(eq(table.id, args.id), ctx.abilities.speakersList.filter('update').single.where)
					);

				pubsub.updated(args.id);

				return db.query.speakersList
					.findFirst(
						query(
							ctx.abilities.speakersList.filter('read', {
								inject: { where: { id: eq(table.id, args.id) } }
							}).single
						)
					)
					.then(assertFindFirstExists);
			}
		})
	};
});
