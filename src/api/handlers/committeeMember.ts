import { db } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { and, inArray } from 'drizzle-orm';
import { basics } from './basics';
import { isDMUNEmail } from '$api/services/isDMUNEmail';

const { arg, ref, pubsub, table } = basics('committeeMember');

abilityBuilder.committeeMember.allow(['read', 'update']).when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isDMUNEmail(user.email)) {
		return 'allow';
	}
});

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
							ctx.abilities.committeeMember.filter('update').sql.where
						)
					);

				pubsub.updated(args.ids);

				return db.query.committeeMember.findMany(
					query(
						ctx.abilities.committeeMember.filter('read', {
							inject: {
								where: {
									id: {
										in: args.ids
									}
								}
							}
						}).query.single
					)
				);
			}
		})
	};
});
