import { db, schema } from '$api/db/db';
import { abilityBuilder, enum_, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isGlobalAdmin } from '$api/services/authHelper';
import { assertConferenceAdmin } from './conferenceUser';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';

abilityBuilder.representation.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.representation.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

const ref = object({ table: 'representation' });

const representationTypeEnum = enum_({
	tsName: 'representationType'
});

const pubsub = rumblePubsub({ table: 'representation' });
query({ table: 'representation' });

schemaBuilder.mutationFields((t) => ({
	createRepresentation: t.drizzleField({
		type: ref,
		args: {
			conferenceId: t.arg.id({ required: true }),
			type: t.arg({ type: representationTypeEnum, required: true }),
			name: t.arg.string(),
			alpha2Code: t.arg.string(),
			alpha3Code: t.arg.string(),
			faIcon: t.arg.string()
		},
		resolve: async (query, root, args, ctx, info) => {
			await assertConferenceAdmin(ctx, args.conferenceId);

			const result = await db
				.insert(schema.representation)
				.values({
					conferenceId: args.conferenceId,
					type: args.type,
					name: args.name ?? undefined,
					alpha2Code: args.alpha2Code ?? undefined,
					alpha3Code: args.alpha3Code ?? undefined,
					faIcon: args.faIcon ?? undefined
				})
				.returning()
				.then(assertFirstEntryExists);

			// For DELEGATION type, auto-create committee members for all committees
			if (args.type === 'DELEGATION') {
				const committees = await db.query.committee.findMany({
					where: { conferenceId: args.conferenceId }
				});

				if (committees.length > 0) {
					await db.insert(schema.committeeMember).values(
						committees.map((c) => ({
							committeeId: c.id,
							representationId: result.id
						}))
					);
				}
			}

			pubsub.updated(result.id);

			return db.query.representation
				.findFirst(
					query(
						ctx.abilities.representation.filter('read').merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	deleteRepresentation: t.field({
		type: 'Boolean',
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx, info) => {
			const representation = await db.query.representation.findFirst({
				where: { id: args.id }
			});

			if (!representation) {
				throw new GraphQLError('Representation not found');
			}

			await assertConferenceAdmin(ctx, representation.conferenceId);

			// Delete associated committee members first (FK may not cascade)
			await db
				.delete(schema.committeeMember)
				.where(eq(schema.committeeMember.representationId, args.id));

			// Delete associated conference members
			await db
				.delete(schema.conferenceMember)
				.where(eq(schema.conferenceMember.representationId, args.id));

			await db.delete(schema.representation).where(eq(schema.representation.id, args.id));

			pubsub.removed();

			return true;
		}
	})
}));
