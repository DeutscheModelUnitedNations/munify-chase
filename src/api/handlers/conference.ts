import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	object,
	query,
	schemaBuilder,
	pubsub as rumblePubsub,
	arg as rumbleArg
} from '$api/rumble';
import { isGlobalAdmin } from '$api/services/isAdminEmail';
import { ConferenceMemberRef, ConferenceMemberWhereInput } from './conferenceMember';
import { assertConferenceAdmin } from './conferenceUser';
import { eq } from 'drizzle-orm';
import { assertFindFirstExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

abilityBuilder.conference.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.conference.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

const ref = object({
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
							...ctx.abilities.conferenceMember.filter('read', {
								inject: {
									where: {
										...args.where,
										conferenceId: parent.id
									}
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
const arg = rumbleArg({ table: 'conference' });
query({
	table: 'conference'
});

schemaBuilder.mutationFields((t) => ({
	updateConference: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id({ required: true }),
			title: t.arg.string(),
			pressWebsite: t.arg.string(),
			location: t.arg.string(),
			startDate: t.arg({ type: 'Date' }),
			endDate: t.arg({ type: 'Date' }),
			hasModeratedCaucus: t.arg.boolean(),
			resolutionFeatureEnabled: t.arg.boolean()
		},
		resolve: async (query, root, args, ctx, info) => {
			await assertConferenceAdmin(ctx, args.id);

			await db
				.update(schema.conference)
				.set({
					title: args.title ?? undefined,
					pressWebsite: args.pressWebsite ?? undefined,
					location: args.location === undefined ? undefined : args.location,
					startDate: args.startDate === undefined ? undefined : args.startDate,
					endDate: args.endDate === undefined ? undefined : args.endDate,
					hasModeratedCaucus: args.hasModeratedCaucus ?? undefined,
					resolutionFeatureEnabled: args.resolutionFeatureEnabled ?? undefined
				})
				.where(eq(schema.conference.id, args.id));

			pubsub.updated(args.id);

			return db.query.conference
				.findFirst(
					query(
						ctx.abilities.conference.filter('read', {
							inject: {
								where: { id: args.id }
							}
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));

schemaBuilder.mutationFields((t) => ({
	deleteConference: t.field({
		type: 'Boolean',
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			if (!isGlobalAdmin(ctx)) {
				throw new GraphQLError('Only global admins can delete conferences');
			}

			const conf = await db.query.conference.findFirst({
				where: { id: args.id }
			});

			if (!conf) {
				throw new GraphQLError('Conference not found');
			}

			await db.delete(schema.conference).where(eq(schema.conference.id, args.id));

			return true;
		}
	})
}));

export const ConferenceRef = ref;
