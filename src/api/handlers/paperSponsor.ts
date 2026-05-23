import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { and, eq } from 'drizzle-orm';
import { isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

abilityBuilder.paperSponsor.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.paperSponsor.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

const ref = object({ table: 'paperSponsor' });
const pubsub = rumblePubsub({ table: 'paperSponsor' });
const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });
query({ table: 'paperSponsor' });

schemaBuilder.mutationFields((t) => ({
	addSponsor: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId } })
				.then(assertFindFirstExists);

			const isChair = !!(await db.query.resolutionPaper.findFirst(
				ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.paperId } }).query
					.single
			));

			if (!isChair) {
				// Must be a DELEGATE
				await db.query.conferenceUser
					.findFirst({
						where: {
							user: { id: user.sub },
							conferenceUserType: 'DELEGATE'
						}
					})
					.then(assertFindFirstExists);

				if (paper.status === 'FINAL') {
					throw new GraphQLError('Cannot sponsor a finalized paper');
				}

				if (paper.status === 'DRAFT_RESOLUTION' || paper.status === 'AMENDMENT_PHASE') {
					const committee = await db.query.committee
						.findFirst({ where: { id: paper.committeeId } })
						.then(assertFindFirstExists);

					if (!committee.supportReEvaluationOpen) {
						throw new GraphQLError('Support re-evaluation is not currently open');
					}
				}
			}

			const result = await db
				.insert(schema.paperSponsor)
				.values({
					paperId: args.paperId,
					committeeMemberId: args.committeeMemberId
				})
				.returning()
				.then(assertFirstEntryExists);

			pubsub.created();
			paperPubsub.updated(args.paperId);

			return db.query.paperSponsor
				.findFirst(
					query(
						ctx.abilities.paperSponsor.filter('read').merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	removeSponsor: t.field({
		type: 'Boolean',
		args: {
			paperId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			await db.query.paperSponsor
				.findFirst({
					where: {
						paperId: args.paperId,
						committeeMemberId: args.committeeMemberId
					}
				})
				.then(assertFindFirstExists);

			const isChair = !!(await db.query.resolutionPaper.findFirst(
				ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.paperId } }).query
					.single
			));

			if (!isChair) {
				const paper = await db.query.resolutionPaper
					.findFirst({ where: { id: args.paperId } })
					.then(assertFindFirstExists);

				if (paper.status === 'DRAFT_RESOLUTION' || paper.status === 'AMENDMENT_PHASE') {
					const committee = await db.query.committee
						.findFirst({ where: { id: paper.committeeId } })
						.then(assertFindFirstExists);

					if (!committee.supportReEvaluationOpen) {
						throw new GraphQLError('Support re-evaluation is not currently open');
					}
				}

				// Must be self (removing own sponsorship) or paper creator.
				// Scope to the paper's conference so multi-conference users get the right record.
				const conferenceUser = await db.query.conferenceUser.findFirst({
					where: {
						user: { id: user.sub },
						conference: { committees: { id: paper.committeeId } }
					}
				});

				const isSelf = conferenceUser?.committeeMemberId === args.committeeMemberId;

				if (!isSelf) {
					const isCreator = conferenceUser?.committeeMemberId === paper.creatorCommitteeMemberId;
					if (!isCreator) {
						throw new GraphQLError(
							'Only the sponsor themselves or the paper creator can remove a sponsor'
						);
					}
				}
			}

			await db
				.delete(schema.paperSponsor)
				.where(
					and(
						eq(schema.paperSponsor.paperId, args.paperId),
						eq(schema.paperSponsor.committeeMemberId, args.committeeMemberId)
					)
				);

			pubsub.removed();
			paperPubsub.updated(args.paperId);

			return true;
		}
	})
}));
