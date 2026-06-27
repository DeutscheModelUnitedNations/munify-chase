import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import { isParticipantInConference, isTeamInConference } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { eq } from 'drizzle-orm';

abilityBuilder.amendmentReviewItem.allow('read').when((ctx) => {
	return { where: { paper: { committee: isParticipantInConference(ctx) } } };
});

abilityBuilder.amendmentReviewItem.allow('update').when((ctx) => {
	return { where: { paper: { committee: isTeamInConference(ctx) } } };
});

// amendmentRevision is a read-only audit log — chairs and participants can read,
// nobody mutates it directly (written via resolveRewrite).
abilityBuilder.amendmentRevision.allow('read').when((ctx) => {
	return { where: { amendment: { paper: { committee: isParticipantInConference(ctx) } } } };
});

object({ table: 'amendmentReviewItem' });
query({ table: 'amendmentReviewItem' });
object({ table: 'amendmentRevision' });
query({ table: 'amendmentRevision' });
const pubsub = rumblePubsub({ table: 'amendmentReviewItem' });

schemaBuilder.mutationFields((t) => ({
	// Called when the chair decides whether a surviving amendment is obsolete.
	// If obsolete: withdraws it and records the causal link for training data.
	// If not obsolete: advances the item to REWRITE phase.
	resolveObsolescence: t.field({
		type: 'Boolean',
		args: {
			reviewItemId: t.arg.id({ required: true }),
			obsolete: t.arg.boolean({ required: true })
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
					}
				})
				.then(assertFindFirstExists);

			await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: item.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			if (item.phase !== 'OBSOLESCENCE') {
				throw new GraphQLError('Review item is not in OBSOLESCENCE phase');
			}

			if (args.obsolete) {
				await db.transaction(async (tx) => {
					await tx
						.update(schema.amendment)
						.set({ status: 'WITHDRAWN', obsoletedByAmendmentId: item.triggerAmendmentId })
						.where(eq(schema.amendment.id, item.subjectAmendmentId));
					await tx
						.update(schema.amendmentReviewItem)
						.set({ resolved: true })
						.where(eq(schema.amendmentReviewItem.id, item.id));
				});
			} else {
				// Not obsolete — advance to rewrite phase so the chair can adjust wording.
				await db
					.update(schema.amendmentReviewItem)
					.set({ phase: 'REWRITE' })
					.where(eq(schema.amendmentReviewItem.id, item.id));
			}

			pubsub.updated(item.id);
			return true;
		}
	}),

	// Called when the chair rewrites a surviving amendment's content.
	// Writes an amendmentRevision row if the content changed (training data for Task 3).
	resolveRewrite: t.field({
		type: 'Boolean',
		args: {
			reviewItemId: t.arg.id({ required: true }),
			newContent: t.arg.string({ required: true }),
			aiSuggestionApplied: t.arg.boolean()
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

			if (item.phase !== 'REWRITE') {
				throw new GraphQLError('Review item is not in REWRITE phase');
			}

			const previousContent = item.subjectAmendment.newContent;
			const applied = args.aiSuggestionApplied ?? false;

			await db.transaction(async (tx) => {
				if (previousContent !== args.newContent) {
					await tx.insert(schema.amendmentRevision).values({
						id: nanoid(),
						amendmentId: item.subjectAmendmentId,
						previousContent: previousContent ?? '',
						newContent: args.newContent,
						causedByAmendmentId: item.triggerAmendmentId,
						reviewItemId: item.id,
						aiSuggestionApplied: applied
					});
					await tx
						.update(schema.amendment)
						.set({ newContent: args.newContent })
						.where(eq(schema.amendment.id, item.subjectAmendmentId));
				}
				await tx
					.update(schema.amendmentReviewItem)
					.set({ resolved: true, aiSuggestionApplied: applied })
					.where(eq(schema.amendmentReviewItem.id, item.id));
			});

			pubsub.updated(item.id);
			return true;
		}
	}),

	// Marks a review item resolved without making any change — "leave as-is".
	skipReviewItem: t.field({
		type: 'Boolean',
		args: { reviewItemId: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			const item = await db.query.amendmentReviewItem
				.findFirst({
					where: { id: args.reviewItemId },
					columns: { id: true, paperId: true }
				})
				.then(assertFindFirstExists);

			await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: item.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			await db
				.update(schema.amendmentReviewItem)
				.set({ resolved: true })
				.where(eq(schema.amendmentReviewItem.id, item.id));

			pubsub.updated(item.id);
			return true;
		}
	}),

	// Writes AI output back to the review item after the in-browser model runs.
	// Idempotent — safe to call again if the model re-runs.
	updateReviewItemAiOutput: t.field({
		type: 'Boolean',
		args: {
			reviewItemId: t.arg.id({ required: true }),
			aiObsolete: t.arg.boolean(),
			aiObsoleteReason: t.arg.string(),
			aiRewriteSuggestion: t.arg.string()
		},
		resolve: async (_root, args, ctx) => {
			const item = await db.query.amendmentReviewItem
				.findFirst({
					where: { id: args.reviewItemId },
					columns: { id: true, paperId: true }
				})
				.then(assertFindFirstExists);

			await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: item.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			await db
				.update(schema.amendmentReviewItem)
				.set({
					aiObsolete: args.aiObsolete ?? undefined,
					aiObsoleteReason: args.aiObsoleteReason ?? undefined,
					aiRewriteSuggestion: args.aiRewriteSuggestion ?? undefined
				})
				.where(eq(schema.amendmentReviewItem.id, item.id));

			pubsub.updated(item.id);
			return true;
		}
	})
}));
