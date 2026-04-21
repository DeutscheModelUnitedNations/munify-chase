import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { assertConferenceAdmin, isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';

abilityBuilder.conferenceMember.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.conferenceMember.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

abilityBuilder.conferenceMember.allow(['delete']).when((async (ctx: any) => {
	return { where: { conference: { ...await assertConferenceAdmin(ctx) } } };
}) as any);

const ref = object({ table: 'conferenceMember' });
export const ConferenceMemberRef = ref;

const pubsub = rumblePubsub({ table: 'conferenceMember' });
query({ table: 'conferenceMember' });

schemaBuilder.mutationFields((t) => ({
	createConferenceMember: t.drizzleField({
		type: ref,
		args: {
			conferenceId: t.arg.id({ required: true }),
			representationId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			await db.query.conference
				.findFirst(
					ctx.abilities.conference
						.filter('update')
						.merge({ where: { id: args.conferenceId } }).query.single
				)
				.then(assertFindFirstExists);

			const result = await db
				.insert(schema.conferenceMember)
				.values({
					conferenceId: args.conferenceId,
					representationId: args.representationId
				})
				.returning()
				.then(assertFirstEntryExists);

			pubsub.updated(result.id);

			return db.query.conferenceMember
				.findFirst(
					query(
						ctx.abilities.conferenceMember.filter('read').merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	deleteConferenceMember: t.field({
		type: 'Boolean',
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			await db.delete(schema.conferenceMember).where(
				ctx.abilities.conferenceMember.filter('delete').merge({ where: { id: args.id } }).sql.where
			);

			pubsub.removed();

			return true;
		}
	})
}));
