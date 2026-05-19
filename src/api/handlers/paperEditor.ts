import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { and, eq } from 'drizzle-orm';
import { isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';

abilityBuilder.paperEditor.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.paperEditor.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

object({ table: 'paperEditor' });
const pubsub = rumblePubsub({ table: 'paperEditor' });
const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });
query({ table: 'paperEditor' });

schemaBuilder.mutationFields((t) => ({
	removeEditor: t.field({
		type: 'Boolean',
		args: {
			paperId: t.arg.id({ required: true }),
			conferenceUserId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
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

			await db
				.delete(schema.paperEditor)
				.where(
					and(
						eq(schema.paperEditor.paperId, args.paperId),
						eq(schema.paperEditor.conferenceUserId, args.conferenceUserId)
					)
				);

			pubsub.removed();
			paperPubsub.updated(args.paperId);

			return true;
		}
	})
}));
