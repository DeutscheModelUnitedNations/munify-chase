import { db, schema } from '#api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '#api/rumble';
import { isParticipantInConference } from '#api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { paperTeamOrCreator, paperWithAbility } from './helpers/paperAccess';

abilityBuilder.paperEditor.allow('read').when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
		}
	};
});

// the paper's team and creator, and editors themselves
abilityBuilder.paperEditor.allow('delete').when((ctx) => {
	const { user, rules } = paperTeamOrCreator(ctx);
	return { where: { OR: [...rules, { conferenceUser: { user: { id: user.sub } } }] } };
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
			await paperWithAbility({ ctx, paperId: args.paperId, action: 'update' });

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
						(await ctx.abilities.paperEditor.filter('read')).merge({
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
					(await ctx.abilities.paperEditor.filter('delete')).merge({ where: { id: args.id } }).sql
						.where
				);
			pubsub.removed();
			return true;
		}
	})
}));
