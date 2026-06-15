import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	pubsub as rumblePubsub,
	schemaBuilder
} from '$api/rumble';
import {
	isParticipantInConference,
	isTeamInConference,
	isGlobalAdmin
} from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.operativeClauseVote.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.operativeClauseVote.allow('read').when((ctx) => {
	return { where: { paper: { committee: isParticipantInConference(ctx) } } };
});

abilityBuilder.operativeClauseVote.allow(['update', 'delete']).when((ctx) => {
	return { where: { paper: { committee: isTeamInConference(ctx) } } };
});

const ref = object({ table: 'operativeClauseVote' });
query({ table: 'operativeClauseVote' });
const pubsub = rumblePubsub({ table: 'operativeClauseVote' });

const outcomeEnum = enum_({ tsName: 'resolutionVoteOutcome' });

async function ensureChairOfPaper(
	ctx: {
		mustBeLoggedIn: () => { sub: string };
		hasRole: (r: string) => boolean;
	},
	paperId: string
) {
	if (isGlobalAdmin(ctx)) return;
	const user = ctx.mustBeLoggedIn();
	const paper = await db.query.resolutionPaper
		.findFirst({ where: { id: paperId } })
		.then(assertFindFirstExists);
	const cu = await db.query.conferenceUser.findFirst({
		where: {
			user: { id: user.sub },
			conference: { committees: { id: paper.committeeId } },
			conferenceUserType: { in: ['ADMIN', 'TEAM'] }
		}
	});
	if (!cu) throw new GraphQLError('Chair access required');
}

schemaBuilder.mutationFields((t) => ({
	recordOperativeClauseVote: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id(),
			paperId: t.arg.id({ required: true }),
			clauseId: t.arg.string({ required: true }),
			outcome: t.arg({ type: outcomeEnum, required: true }),
			votesFor: t.arg.int({ required: true }),
			votesAgainst: t.arg.int({ required: true }),
			votesAbstain: t.arg.int()
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			await ensureChairOfPaper(ctx, args.paperId);

			await db
				.insert(schema.operativeClauseVote)
				.values({
					id: entityId,
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
						votesAbstain: args.votesAbstain ?? 0,
						updatedAt: new Date()
					}
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

	clearOperativeClauseVote: t.field({
		type: 'Boolean',
		args: {
			paperId: t.arg.id({ required: true }),
			clauseId: t.arg.string({ required: true })
		},
		resolve: async (_root, args, ctx) => {
			await ensureChairOfPaper(ctx, args.paperId);
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
