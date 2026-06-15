import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import { isParticipantInConference, isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.amendmentSponsor.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.amendmentSponsor.allow('read').when((ctx) => {
	return {
		where: {
			amendment: { paper: { committee: isParticipantInConference(ctx) } }
		}
	};
});

abilityBuilder.amendmentSponsor.allow(['update', 'delete']).when((ctx) => {
	return {
		where: {
			amendment: { paper: { committee: isParticipantInConference(ctx) } }
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
			id: t.arg.id(),
			amendmentId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id()
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			const amendment = await db.query.amendment
				.findFirst({
					where: { id: args.amendmentId },
					with: { paper: { with: { committee: true } } }
				})
				.then(assertFindFirstExists);

			const user = ctx.mustBeLoggedIn();
			const isChair = !!(await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					conference: { committees: { id: amendment.paper.committeeId } },
					conferenceUserType: { in: ['ADMIN', 'TEAM'] }
				}
			}));

			let committeeMemberId = args.committeeMemberId;
			if (!committeeMemberId) {
				if (!user.email) throw new GraphQLError('User email required');
				const cu = await db.query.conferenceUser
					.findFirst({
						where: {
							userEmail: user.email,
							committeeMember: { committeeId: amendment.paper.committeeId }
						},
						with: { committeeMember: true }
					})
					.then(assertFindFirstExists);
				if (!cu.committeeMember) throw new GraphQLError('Not a committee member');
				committeeMemberId = cu.committeeMember.id;
			}

			if (!isChair && !amendment.paper.committee.amendmentSponsoringOpen) {
				throw new GraphQLError('Amendment sponsoring is closed');
			}

			await db
				.insert(schema.amendmentSponsor)
				.values({ id: entityId, amendmentId: args.amendmentId, committeeMemberId })
				.onConflictDoNothing();
			pubsub.created();

			return db.query.amendmentSponsor
				.findFirst(
					query(
						ctx.abilities.amendmentSponsor.filter('read').merge({
							where: { amendmentId: args.amendmentId, committeeMemberId }
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
			const sponsor = await db.query.amendmentSponsor
				.findFirst({
					where: { id: args.id },
					with: {
						amendment: { with: { paper: true, proposer: true } },
						committeeMember: { with: { users: true } }
					}
				})
				.then(assertFindFirstExists);

			if (sponsor.committeeMemberId === sponsor.amendment.proposerCommitteeMemberId) {
				throw new GraphQLError('Cannot remove the proposer as sponsor');
			}

			const user = ctx.mustBeLoggedIn();
			const isSelf = sponsor.committeeMember.users.some((u) => u.userEmail === user.email);
			const isChair = !!(await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					conference: { committees: { id: sponsor.amendment.paper.committeeId } },
					conferenceUserType: { in: ['ADMIN', 'TEAM'] }
				}
			}));
			if (!isSelf && !isChair && !isGlobalAdmin(ctx)) {
				throw new GraphQLError('Only the sponsor or a chair can remove a sponsor');
			}

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
