import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { and, eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';

abilityBuilder.amendmentSponsor.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.amendmentSponsor.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

const ref = object({ table: 'amendmentSponsor' });
const pubsub = rumblePubsub({ table: 'amendmentSponsor' });
const amendmentPubsub = rumblePubsub({ table: 'amendment' });
query({ table: 'amendmentSponsor' });

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

			if (amendment.status !== 'SUBMITTED') {
				throw new GraphQLError('Can only add sponsors to SUBMITTED amendments');
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
				await db.query.resolutionPaper
					.findFirst(
						ctx.abilities.resolutionPaper
							.filter('update')
							.merge({ where: { id: amendment.paperId } }).query.single
					)
					.then(assertFindFirstExists);
			} else {
				// Delegate adding themselves — check if sponsoring is open
				const committee = await db.query.committee
					.findFirst({ where: { id: paper.committeeId } })
					.then(assertFindFirstExists);

				if (!committee.amendmentSponsoringOpen) {
					throw new GraphQLError('Amendment sponsoring is currently closed');
				}
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

			pubsub.created();
			amendmentPubsub.updated(args.amendmentId);

			return db.query.amendmentSponsor
				.findFirst(
					query(
						ctx.abilities.amendmentSponsor.filter('read').merge({ where: { id: result.id } }).query
							.single
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
			ctx.mustBeLoggedIn();

			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'SUBMITTED') {
				throw new GraphQLError('Can only remove sponsors from SUBMITTED amendments');
			}

			// Cannot remove the proposer
			if (args.committeeMemberId === amendment.proposerCommitteeMemberId) {
				throw new GraphQLError('Cannot remove the proposer from sponsors');
			}

			// Only chair/admin can remove sponsors — verified via ability filter
			await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: amendment.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

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

			pubsub.removed();
			amendmentPubsub.updated(args.amendmentId);

			return true;
		}
	})
}));
