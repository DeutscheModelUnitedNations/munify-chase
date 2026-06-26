import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import {
	isParticipantInConference,
	isTeamInConference,
} from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoidValidation } from '$lib/helpers/nanoid';

abilityBuilder.operativeClauseVote.allow('read').when((ctx) => {
	return { where: { paper: { committee: isParticipantInConference(ctx) } } };
});

abilityBuilder.operativeClauseVote.allow(['update', 'delete']).when((ctx) => {
	return { where: { paper: { committee: isTeamInConference(ctx) } } };
});

const ref = object({ table: 'operativeClauseVote' });
query({ table: 'operativeClauseVote' });
const pubsub = rumblePubsub({ table: 'operativeClauseVote' });

schemaBuilder.mutationFields((t) => ({
	linkOperativeClauseVote: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			paperId: t.arg.id({ required: true }),
			clauseId: t.arg.string({ required: true }),
			votingSessionId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId, committee: isTeamInConference(ctx) },
					columns: { id: true }
				})
				.then(assertFindFirstExists);

			await db
				.insert(schema.operativeClauseVote)
				.values({
					id: args.id,
					paperId: args.paperId,
					clauseId: args.clauseId,
					votingSessionId: args.votingSessionId
				})
				.onConflictDoUpdate({
					target: [schema.operativeClauseVote.paperId, schema.operativeClauseVote.clauseId],
					set: { votingSessionId: args.votingSessionId, updatedAt: new Date() }
				});
			pubsub.created();

			return db.query.operativeClauseVote
				.findFirst(
					query(
						ctx.abilities.operativeClauseVote.filter('read').merge({
							where: { paperId: args.paperId, clauseId: args.clauseId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	unlinkOperativeClauseVote: t.field({
		type: 'Boolean',
		args: {
			paperId: t.arg.id({ required: true }),
			clauseId: t.arg.string({ required: true })
		},
		resolve: async (_root, args, ctx) => {
			await db.delete(schema.operativeClauseVote).where(
				ctx.abilities.operativeClauseVote.filter('delete').merge({
					where: { paperId: args.paperId, clauseId: args.clauseId }
				}).sql.where
			);
			pubsub.removed();
			return true;
		}
	})
}));
