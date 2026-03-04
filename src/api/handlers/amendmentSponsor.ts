import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, pubsub as rumblePubsub } from '$api/rumble';
import { basics } from './basics';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { and, eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { assertCommitteeChairOrAdmin } from './resolutionPaper';

const { arg, ref, pubsub, table } = basics('amendmentSponsor');
const amendmentPubsub = rumblePubsub({ table: 'amendment' });

abilityBuilder.amendmentSponsor.allow('read').when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

abilityBuilder.amendmentSponsor.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

schemaBuilder.mutationFields((t) => ({
	addAmendmentSponsor: t.drizzleField({
		type: ref,
		args: {
			amendmentId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'PENDING') {
				throw new GraphQLError('Can only add sponsors to PENDING amendments');
			}

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: amendment.paperId } })
				.then(assertFindFirstExists);

			// Either the delegate adding themselves, or chair adding anyone
			const isOwnMembership = await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					committeeMemberId: args.committeeMemberId
				}
			});

			if (!isOwnMembership) {
				// Must be chair/admin
				await assertCommitteeChairOrAdmin(ctx, paper.committeeId);
			}

			// Check not already sponsor
			const existing = await db.query.amendmentSponsor.findFirst({
				where: {
					amendmentId: args.amendmentId,
					committeeMemberId: args.committeeMemberId
				}
			});

			if (existing) {
				throw new GraphQLError('Already a sponsor of this amendment');
			}

			const result = await db
				.insert(schema.amendmentSponsor)
				.values({
					amendmentId: args.amendmentId,
					committeeMemberId: args.committeeMemberId
				})
				.returning()
				.then(assertFirstEntryExists);

			pubsub.updated(result.id);
			amendmentPubsub.updated(args.amendmentId);

			return db.query.amendmentSponsor
				.findFirst(
					query(
						ctx.abilities.amendmentSponsor.filter('read', {
							inject: { where: { id: result.id } }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	removeAmendmentSponsor: t.field({
		type: 'Boolean',
		args: {
			amendmentId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'PENDING') {
				throw new GraphQLError('Can only remove sponsors from PENDING amendments');
			}

			// Cannot remove the proposer
			if (args.committeeMemberId === amendment.proposerCommitteeMemberId) {
				throw new GraphQLError('Cannot remove the proposer from sponsors');
			}

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: amendment.paperId } })
				.then(assertFindFirstExists);

			// Either removing own sponsorship, or chair removing anyone
			const isOwnMembership = await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					committeeMemberId: args.committeeMemberId
				}
			});

			if (!isOwnMembership) {
				// Must be chair/admin
				await assertCommitteeChairOrAdmin(ctx, paper.committeeId);
			}

			const existing = await db.query.amendmentSponsor.findFirst({
				where: {
					amendmentId: args.amendmentId,
					committeeMemberId: args.committeeMemberId
				}
			});

			if (!existing) {
				throw new GraphQLError('Not a sponsor of this amendment');
			}

			await db
				.delete(schema.amendmentSponsor)
				.where(
					and(
						eq(schema.amendmentSponsor.amendmentId, args.amendmentId),
						eq(schema.amendmentSponsor.committeeMemberId, args.committeeMemberId)
					)
				);

			pubsub.updated(existing.id);
			amendmentPubsub.updated(args.amendmentId);

			return true;
		}
	})
}));
