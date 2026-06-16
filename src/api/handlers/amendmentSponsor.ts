import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import { isParticipantInConference, isTeamInConference } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { nanoidValidation } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.amendmentSponsor.allow('read').when((ctx) => {
	return {
		where: {
			amendment: { paper: { committee: isParticipantInConference(ctx) } }
		}
	};
});

abilityBuilder.amendmentSponsor.allow(['delete']).when((ctx) => {
	return {
		where: {
			amendment: { paper: { committee: isTeamInConference(ctx) } }
		}
	};
});

abilityBuilder.amendmentSponsor.allow(['delete']).when((ctx) => {
	const user = ctx.mustBeLoggedIn();
	if (!user.email) return undefined;
	return {
		where: {
			committeeMember: { users: { userEmail: user.email } }
		}
	};
});

const ref = object({ table: 'amendmentSponsor' });
query({ table: 'amendmentSponsor' });
const pubsub = rumblePubsub({ table: 'amendmentSponsor' });

schemaBuilder.mutationFields((t) => ({
	addAmendmentSponsor: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			amendmentId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id()
		},
		resolve: async (query, _root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();
			const amendment = await db.query.amendment
				.findFirst({
					where: ctx.abilities.amendment.filter('read').merge({
						where: { id: args.amendmentId }
					}).query.single.where,
					with: { paper: { with: { committee: true } } }
				})
				.then(assertFindFirstExists);

			const chair = await db.query.committeeMember.findFirst({
				where: { id: amendment.paper.committee.conferenceId, committee: isTeamInConference(ctx) },
				columns: { id: true }
			});

			let createdId: string;

			if (chair?.id) {
				if (!args.committeeMemberId) {
					throw new GraphQLError('Committee member ID required when chair is creating sponsor');
				}
				createdId = await db
					.insert(schema.amendmentSponsor)
					.values({
						id: args.id,
						amendmentId: args.amendmentId,
						committeeMemberId: args.committeeMemberId
					})
					.returning({ id: schema.amendmentSponsor.id })
					.onConflictDoNothing()
					.then(assertFirstEntryExists)
					.then((r) => r.id);
				pubsub.created();
			} else {
				if (!user.email) throw new GraphQLError('User email required');
				const member = await db.query.committeeMember.findFirst({
					where: {
						users: { userEmail: user.email },
						committee: { resolutionPapers: { id: amendment.paperId } }
					},
					columns: { id: true },
					with: { committee: true }
				});
				if (!member) throw new GraphQLError('Not a committee member');
				if (!member.committee.amendmentSponsoringOpen) {
					throw new GraphQLError('Amendment sponsoring is closed');
				}
				createdId = await db
					.insert(schema.amendmentSponsor)
					.values({
						id: args.id,
						amendmentId: args.amendmentId,
						committeeMemberId: member.id
					})
					.returning({ id: schema.amendmentSponsor.id })
					.onConflictDoNothing()
					.then(assertFirstEntryExists)
					.then((r) => r.id);
				pubsub.created();
			}

			return db.query.amendmentSponsor
				.findFirst(
					query(
						ctx.abilities.amendmentSponsor.filter('read').merge({
							where: { id: createdId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	removeAmendmentSponsor: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
		await db
			.delete(schema.amendmentSponsor)
			.where(
				ctx.abilities.amendmentSponsor.filter('delete').merge({ where: { id: args.id } }).sql
					.where
			);
			pubsub.removed();
			return true;
		}
	})
}));
