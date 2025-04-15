import { db, schema } from '$api/db/db';
import { schemaBuilder } from '$api/rumble';
import { and, eq } from 'drizzle-orm';
import { basics } from './basics';
import { assertFindFirstExists } from '@m1212e/rumble';

const { arg, ref, pubsub } = basics('committeeMember');

schemaBuilder.mutationFields((t) => {
	return {
		setPresenceForCommitteeMember: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true }),
				present: t.arg.boolean({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				await db
					.update(schema.committeeMember)
					.set({
						present: args.present
					})
					.where(
						and(
							eq(schema.committeeMember.id, args.id),
							ctx.abilities.committeeMember.filter('update').single.where
						)
					);

				pubsub.updated(args.id);

				return db.query.committeeMember
					.findFirst(
						query(
							ctx.abilities.committeeMember.filter('read', {
								inject: { where: { id: eq(schema.committeeMember.id, args.id) } }
							}).single
						)
					)
					.then(assertFindFirstExists);
			}
		})
	};
});
