import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import { isParticipantInConference, isTeamInConference } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoidValidation } from '$lib/helpers/nanoid';

abilityBuilder.paperEditor.allow('read').when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
		}
	};
});

abilityBuilder.paperEditor.allow('delete').when((ctx) => {
	const user = ctx.mustBeLoggedIn();
	return {
		where: {
			OR: [
				{ paper: { committee: isTeamInConference(ctx) } }, // team members can delete
				{ paper: { creatorCommitteeMember: { users: { user: { id: user.sub } } } } }, // owner of the paper can delete
				{ conferenceUser: { user: { id: user.sub } } } // self delete
			]
		}
	};
});

const ref = object({ table: 'paperEditor' });
query({ table: 'paperEditor' });
const pubsub = rumblePubsub({ table: 'paperEditor' });

schemaBuilder.mutationFields((t) => ({
	addPaperEditor: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			paperId: t.arg.id({ required: true }),
			conferenceUserId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({
						where: { id: args.paperId }
					}).query.single
				)
				.then(assertFindFirstExists);

			await db
				.insert(schema.paperEditor)
				.values({
					id: args.id,
					paperId: args.paperId,
					conferenceUserId: args.conferenceUserId
				})
				.onConflictDoNothing();

			pubsub.created();

			return db.query.paperEditor
				.findFirst(
					query(
						ctx.abilities.paperEditor.filter('read').merge({
							where: { paperId: args.paperId, conferenceUserId: args.conferenceUserId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	removePaperEditor: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			await db
				.delete(schema.paperEditor)
				.where(
					ctx.abilities.paperEditor.filter('delete').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.removed();
			return true;
		}
	})
}));
