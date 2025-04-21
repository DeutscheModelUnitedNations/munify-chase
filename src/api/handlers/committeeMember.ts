import { db } from '$api/db/db';
import { schemaBuilder } from '$api/rumble';
import { and, inArray } from 'drizzle-orm';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('committeeMember');

schemaBuilder.mutationFields((t) => {
	return {
		setPresenceForCommitteeMembers: t.drizzleField({
			type: [ref],
			args: {
				ids: t.arg.idList({ required: true }),
				present: t.arg.boolean({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				await db
					.update(table)
					.set({
						present: args.present
					})
					.where(
						and(
							inArray(table.id, args.ids),
							ctx.abilities.committeeMember.filter('update').single.where
						)
					);

				pubsub.updated(args.ids);

				return db.query.committeeMember.findMany(
					query(
						ctx.abilities.committeeMember.filter('read', {
							inject: { where: { id: inArray(table.id, args.ids) } }
						}).single
					)
				);
			}
		})
	};
});
