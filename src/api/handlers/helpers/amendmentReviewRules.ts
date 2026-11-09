import { GraphQLError } from 'graphql';
import type { schema } from '#api/db/db';

type ReviewItemUpdate = Partial<typeof schema.amendmentReviewItem.$inferInsert>;
type Phase = typeof schema.amendmentReviewItem.$inferSelect.phase;

export interface ReviewItemArgs {
	phase?: Phase | null;
	verdictObsolete?: boolean | null;
	verdictRewrite?: string | null;
	aiObsolete?: boolean | null;
	aiObsoleteReason?: string | null;
	aiRewriteSuggestion?: string | null;
	aiRewriteReason?: string | null;
}

/** The AI's assessment, writable in any phase (null clears a field, left out keeps it). */
function aiFields(args: ReviewItemArgs): ReviewItemUpdate {
	const update: ReviewItemUpdate = {};
	if (args.aiObsolete !== undefined) update.aiObsolete = args.aiObsolete;
	if (args.aiObsoleteReason !== undefined) update.aiObsoleteReason = args.aiObsoleteReason;
	if (args.aiRewriteSuggestion !== undefined) update.aiRewriteSuggestion = args.aiRewriteSuggestion;
	if (args.aiRewriteReason !== undefined) update.aiRewriteReason = args.aiRewriteReason;
	return update;
}

/** The phase transition the arguments ask for, with the verdict it records. */
function phaseFields({ from, args }: { from: Phase; args: ReviewItemArgs }): ReviewItemUpdate {
	const phase = args.phase;
	if (phase == null) return {};
	if (from === 'RESOLVED') throw new GraphQLError('Review item is already resolved');
	if (phase === 'REWRITE') {
		if (from !== 'OBSOLESCENCE') {
			throw new GraphQLError('Can only advance to REWRITE from OBSOLESCENCE');
		}
		return { phase, verdictObsolete: false };
	}
	if (phase !== 'RESOLVED') return { phase };
	if (from === 'OBSOLESCENCE') {
		if (args.verdictObsolete == null) {
			throw new GraphQLError('verdictObsolete is required when resolving from OBSOLESCENCE');
		}
		return { phase, verdictObsolete: args.verdictObsolete };
	}
	return { phase, verdictRewrite: args.verdictRewrite ?? null };
}

/**
 * What an update of a review item writes: the item's fields, whether the subject amendment is
 * withdrawn as obsolete, and the rewritten text it gets (null when the text stays).
 */
export function reviewItemChanges({
	item,
	args
}: {
	item: { phase: Phase; subjectNewContent: string | null };
	args: ReviewItemArgs;
}) {
	const resolving = args.phase === 'RESOLVED';
	const rewrite = args.verdictRewrite;
	const rewrites =
		resolving && item.phase === 'REWRITE' && rewrite != null && rewrite !== item.subjectNewContent;
	return {
		update: { ...aiFields(args), ...phaseFields({ from: item.phase, args }) },
		withdrawSubject: resolving && item.phase === 'OBSOLESCENCE' && args.verdictObsolete === true,
		rewriteTo: rewrites ? rewrite : null
	};
}
