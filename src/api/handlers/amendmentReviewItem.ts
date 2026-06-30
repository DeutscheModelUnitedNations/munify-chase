import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	pubsub as rumblePubsub,
	schemaBuilder
} from '$api/rumble';
import { isParticipantInConference, isTeamInConference } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { eq } from 'drizzle-orm';

abilityBuilder.amendmentReviewItem.allow('read').when((ctx) => {
	return { where: { paper: { committee: isParticipantInConference(ctx) } } };
});

abilityBuilder.amendmentReviewItem.allow('update').when((ctx) => {
	return { where: { paper: { committee: isTeamInConference(ctx) } } };
});

object({ table: 'amendmentReviewItem' });
query({ table: 'amendmentReviewItem' });
const pubsub = rumblePubsub({ table: 'amendmentReviewItem' });
const phaseEnum = enum_({ tsName: 'amendmentReviewPhase' });

schemaBuilder.mutationFields((t) => ({
	updateAmendmentReviewItem: t.field({
		type: 'Boolean',
		args: {
			reviewItemId: t.arg.id({ required: true }),
			phase: t.arg({ type: phaseEnum }),
			verdictObsolete: t.arg.boolean(),
			verdictRewrite: t.arg.string(),
			aiObsolete: t.arg.boolean(),
			aiObsoleteReason: t.arg.string(),
			aiRewriteSuggestion: t.arg.string(),
			aiRewriteReason: t.arg.string()
		},
		resolve: async (_root, args, ctx) => {
			const item = await db.query.amendmentReviewItem
				.findFirst({
					where: { id: args.reviewItemId },
					columns: {
						id: true,
						paperId: true,
						phase: true,
						triggerAmendmentId: true,
						subjectAmendmentId: true
					},
					with: { subjectAmendment: { columns: { newContent: true } } }
				})
				.then(assertFindFirstExists);

			await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: item.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			const update: Partial<typeof schema.amendmentReviewItem.$inferInsert> = {};

			// always writable regardless of phase (null clears the field).
			if (args.aiObsolete !== undefined) update.aiObsolete = args.aiObsolete;
			if (args.aiObsoleteReason !== undefined) update.aiObsoleteReason = args.aiObsoleteReason;
			if (args.aiRewriteSuggestion !== undefined) update.aiRewriteSuggestion = args.aiRewriteSuggestion;
			if (args.aiRewriteReason !== undefined) update.aiRewriteReason = args.aiRewriteReason;

			// Phase transition.
			if (args.phase != null) {
				if (item.phase === 'RESOLVED') {
					throw new GraphQLError('Review item is already resolved');
				}
				if (args.phase === 'REWRITE' && item.phase !== 'OBSOLESCENCE') {
					throw new GraphQLError('Can only advance to REWRITE from OBSOLESCENCE');
				}

				update.phase = args.phase;

				if (args.phase === 'REWRITE') {
					update.verdictObsolete = false;
				} else if (args.phase === 'RESOLVED' && item.phase === 'OBSOLESCENCE') {
					if (args.verdictObsolete == null) {
						throw new GraphQLError('verdictObsolete is required when resolving from OBSOLESCENCE');
					}
					update.verdictObsolete = args.verdictObsolete;
				} else if (args.phase === 'RESOLVED' && item.phase === 'REWRITE') {
					update.verdictRewrite = args.verdictRewrite ?? null;
				}
			}

			await db.transaction(async (tx) => {
				// Withdraw the subject amendment when the chair marks it obsolete.
				if (
					args.phase === 'RESOLVED' &&
					item.phase === 'OBSOLESCENCE' &&
					args.verdictObsolete === true
				) {
					await tx
						.update(schema.amendment)
						.set({ status: 'WITHDRAWN', obsoletedByAmendmentId: item.triggerAmendmentId })
						.where(eq(schema.amendment.id, item.subjectAmendmentId));
				}

				// Apply content rewrite only if the text actually changed.
				if (
					args.phase === 'RESOLVED' &&
					item.phase === 'REWRITE' &&
					args.verdictRewrite != null &&
					args.verdictRewrite !== item.subjectAmendment.newContent
				) {
					await tx
						.update(schema.amendment)
						.set({ newContent: args.verdictRewrite })
						.where(eq(schema.amendment.id, item.subjectAmendmentId));
				}

				await tx
					.update(schema.amendmentReviewItem)
					.set(update)
					.where(eq(schema.amendmentReviewItem.id, item.id));
			});

			pubsub.updated(item.id);
			return true;
		}
	})
}));
