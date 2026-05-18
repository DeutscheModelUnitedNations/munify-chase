import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import { isAdmin, isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { nanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import type { Context } from '$api/context';

abilityBuilder.displayToken.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.displayToken.allow('read').when((ctx) => {
	return { where: { conference: isAdmin(ctx) } };
});

const ref = object({ table: 'displayToken' });
const pubsub = rumblePubsub({ table: 'displayToken' });
query({ table: 'displayToken' });

/**
 * A display token is a long-lived bearer credential for the public,
 * read-only committee display of a single conference. Only conference
 * admins (or global admins) may mint or revoke them.
 */
async function assertConferenceAdmin(ctx: Context, conferenceId: string) {
	const user = ctx.mustBeLoggedIn();
	if (isGlobalAdmin(ctx)) return user;

	await db.query.conferenceUser
		.findFirst({
			where: {
				conferenceId,
				user: { id: user.sub },
				conferenceUserType: 'ADMIN'
			}
		})
		.then(assertFindFirstExists);

	return user;
}

schemaBuilder.mutationFields((t) => ({
	createDisplayToken: t.drizzleField({
		type: ref,
		args: {
			conferenceId: t.arg.id({ required: true }),
			label: t.arg.string(),
			showStateOfDebate: t.arg.boolean()
		},
		resolve: async (query, root, args, ctx) => {
			const user = await assertConferenceAdmin(ctx, args.conferenceId);

			const result = await db
				.insert(schema.displayToken)
				.values({
					conferenceId: args.conferenceId,
					code: nanoid(),
					label: args.label ?? '',
					showStateOfDebate: args.showStateOfDebate ?? false,
					createdById: user.sub
				})
				.returning()
				.then(assertFirstEntryExists);

			pubsub.created();

			return db.query.displayToken
				.findFirst(
					query(
						ctx.abilities.displayToken.filter('read').merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	revokeDisplayToken: t.field({
		type: 'Boolean',
		args: {
			displayTokenId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const token = await db.query.displayToken
				.findFirst({ where: { id: args.displayTokenId } })
				.then(assertFindFirstExists);

			await assertConferenceAdmin(ctx, token.conferenceId);

			if (token.revokedAt) {
				throw new GraphQLError('Display token already revoked');
			}

			await db
				.update(schema.displayToken)
				.set({ revokedAt: new Date() })
				.where(eq(schema.displayToken.id, args.displayTokenId));

			pubsub.updated(args.displayTokenId);

			return true;
		}
	}),

	deleteDisplayToken: t.field({
		type: 'Boolean',
		args: {
			displayTokenId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const token = await db.query.displayToken
				.findFirst({ where: { id: args.displayTokenId } })
				.then(assertFindFirstExists);

			await assertConferenceAdmin(ctx, token.conferenceId);

			await db.delete(schema.displayToken).where(eq(schema.displayToken.id, args.displayTokenId));

			pubsub.removed();

			return true;
		}
	})
}));
