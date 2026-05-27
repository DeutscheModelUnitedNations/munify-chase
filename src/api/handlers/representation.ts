import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '$api/rumble';
import { isAdminInConference, isParticipantInConference } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.representation.allow('read').when((ctx) => {
	return {
		where: isParticipantInConference(ctx)
	};
});

abilityBuilder.representation.allow(['update', 'delete']).when((ctx) => {
	return { where: isAdminInConference(ctx) };
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
			id: t.arg.id(),
			conferenceId: t.arg.id({ required: true }),
			type: t.arg({ type: representationTypeEnum, required: true }),
			name: t.arg.string(),
			alpha2Code: t.arg.string(),
			alpha3Code: t.arg.string(),
			faIcon: t.arg.string()
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			await db.query.conference
				.findFirst(
					ctx.abilities.conference.filter('update').merge({ where: { id: args.conferenceId } })
						.query.single
				)
				.then(assertFindFirstExists);

			const result = await db.transaction(async (tx) => {
				const rep = await tx
					.insert(schema.representation)
					.values({
						id: entityId,
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
					const committees = await tx.query.committee.findMany({
						where: { conferenceId: args.conferenceId }
					});

					if (committees.length > 0) {
						await tx.insert(schema.committeeMember).values(
							committees.map((c) => ({
								committeeId: c.id,
								representationId: rep.id
							}))
						);
					}
				}

				return rep;
			});

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
		resolve: async (_root, args, ctx) => {
			await db.query.representation
				.findFirst(
					ctx.abilities.representation.filter('delete').merge({ where: { id: args.id } }).query
						.single
				)
				.then(assertFindFirstExists);

			await db.transaction(async (tx) => {
				// Delete associated committee members first (FK may not cascade)
				await tx
					.delete(schema.committeeMember)
					.where(eq(schema.committeeMember.representationId, args.id));

				// Delete associated conference members
				await tx
					.delete(schema.conferenceMember)
					.where(eq(schema.conferenceMember.representationId, args.id));

				await tx.delete(schema.representation).where(eq(schema.representation.id, args.id));
			});

			pubsub.removed();

			return true;
		}
	})
}));
