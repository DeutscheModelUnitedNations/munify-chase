import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query,
	whereArg
} from '$api/rumble';
import { isAdminInConference, isParticipantInConference } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.conferenceMember.allow('read').when((ctx) => {
	return {
		where: isParticipantInConference(ctx)
	};
});

abilityBuilder.conferenceMember.allow('delete').when((ctx) => {
	return { where: isAdminInConference(ctx) };
});

export const ConferenceMemberRef = object({ table: 'conferenceMember' });
export const ConferenceMemberWhereInput = whereArg({ table: 'conferenceMember' });

const pubsub = rumblePubsub({ table: 'conferenceMember' });
query({ table: 'conferenceMember' });

schemaBuilder.mutationFields((t) => ({
	createConferenceMember: t.drizzleField({
		type: ConferenceMemberRef,
		args: {
			id: t.arg.id(),
			conferenceId: t.arg.id({ required: true }),
			representationId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx) => {
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

			const result = await db
				.insert(schema.conferenceMember)
				.values({
					id: entityId,
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
			await db
				.delete(schema.conferenceMember)
				.where(
					ctx.abilities.conferenceMember.filter('delete').merge({ where: { id: args.id } }).sql
						.where
				);

			pubsub.removed();

			return true;
		}
	})
}));
