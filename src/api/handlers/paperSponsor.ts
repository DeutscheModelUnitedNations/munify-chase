import { db, schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder, pubsub as rumblePubsub } from '$api/rumble';
import { and, eq } from 'drizzle-orm';
import { basics } from './basics';
import { isGlobalAdmin } from '$api/services/isAdminEmail';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { assertCommitteeChairOrAdmin } from './resolutionPaper';

const { ref, pubsub, table } = basics('paperSponsor');
const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });

abilityBuilder.paperSponsor.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.paperSponsor.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

schemaBuilder.mutationFields((t) => ({
	addSponsor: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId } })
				.then(assertFindFirstExists);

			// Try chair/admin path first (bypasses all gates)
			let isChair = false;
			try {
				await assertCommitteeChairOrAdmin(ctx, paper.committeeId);
				isChair = true;
			} catch {
				// not a chair/admin, will check delegate path below
			}

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
		resolve: async (root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			const sponsor = await db.query.paperSponsor
				.findFirst({
					where: {
						paperId: args.paperId,
						committeeMemberId: args.committeeMemberId
					}
				})
				.then(assertFindFirstExists);

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId } })
				.then(assertFindFirstExists);

			// Try chair/admin path first (bypasses all gates)
			let isChair = false;
			try {
				await assertCommitteeChairOrAdmin(ctx, paper.committeeId);
				isChair = true;
			} catch {
				// not a chair/admin, will check delegate path below
			}

			if (!isChair) {
				if (paper.status === 'DRAFT_RESOLUTION' || paper.status === 'AMENDMENT_PHASE') {
					const committee = await db.query.committee
						.findFirst({ where: { id: paper.committeeId } })
						.then(assertFindFirstExists);

					if (!committee.supportReEvaluationOpen) {
						throw new GraphQLError('Support re-evaluation is not currently open');
					}
				}

				// Must be self (removing own sponsorship) or paper creator
				const conferenceUser = await db.query.conferenceUser.findFirst({
					where: {
						user: { id: user.sub }
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
