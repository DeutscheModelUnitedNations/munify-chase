import { db, schema } from '#api/db/db';
import { abilityBuilder, object, query, schemaBuilder, pubsub as rumblePubsub } from '#api/rumble';
import { ConferenceMemberRef, ConferenceMemberWhereInput } from './conferenceMember';
import {
	isAdmin,
	isGlobalAdmin,
	isParticipant,
	linkedDelegator,
	SYNCED_CONFERENCE
} from '#api/services/authHelper';
import { assertFindFirstExists, mapNullFieldsToUndefined } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { assertNotManagedByDelegator } from '#api/services/link/managedRows';
import { logoSvgUpdate } from './helpers/conferenceLogo';

// The linked DELEGATOR reads back the presence of its conferences (`docs/plans/delegator-link.md`).
abilityBuilder.conference
	.allow('read')
	.when(
		linkedDelegator({ where: SYNCED_CONFERENCE, columns: { id: true, managedByDelegator: true } })
	);

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
			resolve: async (query, parent, args, ctx) => {
				const touchedRepresentation = new Set<string>();
				return (
					await db.query.conferenceMember.findMany(
						query({
							...(await ctx.abilities.conferenceMember.filter('read')).merge({
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
			location: t.arg.string(),
			startDate: t.arg({ type: 'Date' }),
			endDate: t.arg({ type: 'Date' }),
			hasModeratedCaucus: t.arg.boolean(),
			logoSvg: t.arg.string()
		},
		resolve: async (query, root, args, ctx) => {
			// title, place and dates of a conference from DELEGATOR are changed there
			const row = await db.query.conference.findFirst({
				where: { id: args.id },
				columns: { managedByDelegator: true }
			});
			assertNotManagedByDelegator({
				managed: row?.managedByDelegator,
				touchesDelegatorFields: [args.title, args.location, args.startDate, args.endDate].some(
					(value) => value != null
				)
			});
			const mappedArgs = mapNullFieldsToUndefined(args);

			await db
				.update(schema.conference)
				.set({
					title: mappedArgs.title,
					pressWebsite: mappedArgs.pressWebsite,
					location: mappedArgs.location,
					startDate: mappedArgs.startDate,
					endDate: mappedArgs.endDate,
					hasModeratedCaucus: mappedArgs.hasModeratedCaucus,
					...logoSvgUpdate(args.logoSvg)
				})
				.where(
					(await ctx.abilities.conference.filter('update')).merge({ where: { id: args.id } }).sql
						.where
				);

			pubsub.updated(args.id);

			return db.query.conference
				.findFirst(
					query(
						(await ctx.abilities.conference.filter('read')).merge({
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
					(await ctx.abilities.conference.filter('delete')).merge({ where: { id: args.id } }).sql
						.where
				);

			pubsub.removed();

			return true;
		}
	})
}));
