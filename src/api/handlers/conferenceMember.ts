import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { basics } from './basics';
import { assertConferenceAdmin } from './conferenceUser';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';

const { ref, pubsub, table } = basics('conferenceMember');

abilityBuilder.conferenceMember.allow('read').when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

abilityBuilder.conferenceMember.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

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

export const ConferenceMemberRef = ref;
