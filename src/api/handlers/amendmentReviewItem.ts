import { db, schema } from '#api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	pubsub as rumblePubsub,
	schemaBuilder
} from '#api/rumble';
import { isParticipantInConference, isTeamInConference } from '#api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { paperWithAbility } from './helpers/paperAccess';
import { reviewItemChanges } from './helpers/amendmentReviewRules';

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

			await paperWithAbility({ ctx, paperId: item.paperId, action: 'update' });

			const { update, withdrawSubject, rewriteTo } = reviewItemChanges({
				item: { phase: item.phase, subjectNewContent: item.subjectAmendment.newContent },
				args
			});

			await db.transaction(async (tx) => {
				// Withdraw the subject amendment when the chair marks it obsolete.
				if (withdrawSubject) {
					await tx
						.update(schema.amendment)
						.set({ status: 'WITHDRAWN', obsoletedByAmendmentId: item.triggerAmendmentId })
						.where(eq(schema.amendment.id, item.subjectAmendmentId));
				}

				// Apply content rewrite only if the text actually changed.
				if (rewriteTo != null) {
					await tx
						.update(schema.amendment)
						.set({ newContent: rewriteTo })
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
