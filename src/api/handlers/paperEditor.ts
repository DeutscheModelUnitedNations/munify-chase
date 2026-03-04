import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { and, eq } from 'drizzle-orm';
import { basics } from './basics';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { assertFindFirstExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

const { arg, ref, pubsub, table } = basics('paperEditor');

abilityBuilder.paperEditor.allow(['read', 'update']).when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

abilityBuilder.paperEditor.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

schemaBuilder.mutationFields((t) => ({
	removeEditor: t.field({
		type: 'Boolean',
		args: {
			paperId: t.arg.id({ required: true }),
			conferenceUserId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			// Must be paper creator
			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						committeeMemberId: paper.creatorCommitteeMemberId
					}
				})
				.then(assertFindFirstExists);

			const editor = await db.query.paperEditor
				.findFirst({
					where: {
						paperId: args.paperId,
						conferenceUserId: args.conferenceUserId
					}
				})
				.then(assertFindFirstExists);

			await db
				.delete(schema.paperEditor)
				.where(
					and(
						eq(schema.paperEditor.paperId, args.paperId),
						eq(schema.paperEditor.conferenceUserId, args.conferenceUserId)
					)
				);

			pubsub.removed(editor.id);

			return true;
		}
	})
}));
