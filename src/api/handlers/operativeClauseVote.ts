import { db, schema } from '$api/db/db';
import { abilityBuilder, enum_, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isGlobalAdmin } from '$api/services/authHelper';
import { assertCommitteeChairOrAdmin } from './resolutionPaper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { eq, and } from 'drizzle-orm';

abilityBuilder.operativeClauseVote.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.operativeClauseVote.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

const ref = object({ table: 'operativeClauseVote' });
const pubsub = rumblePubsub({ table: 'operativeClauseVote' });
const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });
query({ table: 'operativeClauseVote' });

schemaBuilder.mutationFields((t) => ({
	recordClauseVote: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			clauseId: t.arg.string({ required: true }),
			outcome: t.arg({ type: enum_({ tsName: 'voteOutcome' }), required: true }),
			votesFor: t.arg.int({ required: true }),
			votesAgainst: t.arg.int({ required: true }),
			votesAbstain: t.arg.int()
		},
		resolve: async (query, root, args, ctx, info) => {
			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId } })
				.then(assertFindFirstExists);

			if (paper.status !== 'VOTING_PHASE') {
				throw new GraphQLError('Paper must be in VOTING_PHASE to record clause votes');
			}

			if (args.outcome === 'SENT_BACK') {
				throw new GraphQLError('Clause votes can only be ADOPTED or REJECTED');
			}

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			await db
				.insert(schema.operativeClauseVote)
				.values({
					paperId: args.paperId,
					clauseId: args.clauseId,
					outcome: args.outcome,
					votesFor: args.votesFor,
					votesAgainst: args.votesAgainst,
					votesAbstain: args.votesAbstain ?? 0
				})
				.onConflictDoUpdate({
					target: [schema.operativeClauseVote.paperId, schema.operativeClauseVote.clauseId],
					set: {
						outcome: args.outcome,
						votesFor: args.votesFor,
						votesAgainst: args.votesAgainst,
						votesAbstain: args.votesAbstain ?? 0
					}
				});

			pubsub.created();
			paperPubsub.updated(args.paperId);

			return db.query.operativeClauseVote
				.findFirst(
					query({
						where: {
							paperId: args.paperId,
							clauseId: args.clauseId
						}
					})
				)
				.then(assertFindFirstExists);
		}
	}),

	deleteClauseVote: t.field({
		type: 'Boolean',
		args: {
			paperId: t.arg.id({ required: true }),
			clauseId: t.arg.string({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId } })
				.then(assertFindFirstExists);

			if (paper.status !== 'VOTING_PHASE') {
				throw new GraphQLError('Paper must be in VOTING_PHASE to delete clause votes');
			}

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			await db
				.delete(schema.operativeClauseVote)
				.where(
					and(
						eq(schema.operativeClauseVote.paperId, args.paperId),
						eq(schema.operativeClauseVote.clauseId, args.clauseId)
					)
				);

			pubsub.created();
			paperPubsub.updated(args.paperId);

			return true;
		}
	})
}));
