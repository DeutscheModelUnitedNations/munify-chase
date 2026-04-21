import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isGlobalAdmin } from '$api/services/authHelper';
import { assertConferenceAdmin } from './conferenceUser';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';

abilityBuilder.conferenceMember.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.conferenceMember.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

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
			await assertConferenceAdmin(ctx, args.conferenceId);

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
		resolve: async (root, args, ctx, info) => {
			const conferenceMember = await db.query.conferenceMember.findFirst({
				where: { id: args.id }
			});

			if (!conferenceMember) {
				throw new GraphQLError('Conference member not found');
			}

			await assertConferenceAdmin(ctx, conferenceMember.conferenceId);

			await db.delete(schema.conferenceMember).where(eq(schema.conferenceMember.id, args.id));

			pubsub.removed();

			return true;
		}
	})
}));
