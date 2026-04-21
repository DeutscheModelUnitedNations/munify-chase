import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, schemaBuilder, pubsub as rumblePubsub } from '$api/rumble';
import { ConferenceMemberRef, ConferenceMemberWhereInput } from './conferenceMember';
import { isAdmin, isGlobalAdmin, isParticipant } from '$api/services/authHelper';
import { eq } from 'drizzle-orm';
import { assertFindFirstExists, mapNullFieldsToUndefined } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

abilityBuilder.conference.allow('read').when((ctx) => {
	return { where: isParticipant(ctx) };
});

abilityBuilder.conference.allow('update').when((ctx) => {
	return { where: isAdmin(ctx) };
});

abilityBuilder.conference.allow('delete').when((ctx) => {
	if (!isGlobalAdmin(ctx)) {
		throw new GraphQLError('Only global admins can delete conferences');
	}
	return 'allow';
});

export const ConferenceRef = object({
	table: 'conference',
	adjust: (t) => ({
		uniqueConferenceMembers: t.drizzleField({
			type: [ConferenceMemberRef],
			description:
				'Returns a conference member for each existent representation. Useful to display a non duplicated list of non state actors.',
			args: {
				where: t.arg({ type: ConferenceMemberWhereInput })
			},
			resolve: async (query, parent, args, ctx, _info) => {
				const touchedRepresentation = new Set<string>();
				return (
					await db.query.conferenceMember.findMany(
						query({
							...ctx.abilities.conferenceMember.filter('read').merge({
								where: {
									...args.where,
									conferenceId: parent.id
								}
							}).query.many,
							with: {
								representation: true
							}
						})
					)
				).filter((member) => {
					if (touchedRepresentation.has(member.representation!.id!)) {
						return false;
					}
					touchedRepresentation.add(member.representation!.id!);
					return true;
				});
			}
		})
	})
});

const pubsub = rumblePubsub({ table: 'conference' });
query({
	table: 'conference'
});

schemaBuilder.mutationFields((t) => ({
	updateConference: t.drizzleField({
		type: ConferenceRef,
		args: {
			id: t.arg.id({ required: true }),
			title: t.arg.string(),
			pressWebsite: t.arg.string(),
			hasModeratedCaucus: t.arg.boolean(),
			resolutionFeatureEnabled: t.arg.boolean()
		},
		resolve: async (query, root, args, ctx, info) => {
			const mappedArgs = mapNullFieldsToUndefined(args);
			await db
				.update(schema.conference)
				.set({
					title: mappedArgs.title,
					pressWebsite: mappedArgs.pressWebsite,
					hasModeratedCaucus: mappedArgs.hasModeratedCaucus,
					resolutionFeatureEnabled: mappedArgs.resolutionFeatureEnabled
				})
				.where(
					ctx.abilities.conference.filter('update').merge({ where: { id: args.id } }).sql.where
				);

			pubsub.updated(args.id);

			return db.query.conference
				.findFirst(
					query(
						ctx.abilities.conference.filter('read').merge({
							where: { id: args.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),
	deleteConference: t.field({
		type: 'Boolean',
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			await db
				.delete(schema.conference)
				.where(
					ctx.abilities.conference.filter('delete').merge({ where: { id: args.id } }).sql.where
				);

			return true;
		}
	})
}));
