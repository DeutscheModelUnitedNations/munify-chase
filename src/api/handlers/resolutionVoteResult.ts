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
import { readPaperJson } from '$api/yjs/server';

abilityBuilder.resolutionVoteResult.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.resolutionVoteResult.allow('read').when((ctx) => {
	return { where: { paper: { committee: isParticipantInConference(ctx) } } };
});

abilityBuilder.resolutionVoteResult.allow(['update', 'delete']).when((ctx) => {
	return { where: { paper: { committee: isTeamInConference(ctx) } } };
});

const ref = object({ table: 'resolutionVoteResult' });
query({ table: 'resolutionVoteResult' });
const pubsub = rumblePubsub({ table: 'resolutionVoteResult' });
const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });

const outcomeEnum = enum_({ tsName: 'resolutionVoteOutcome' });

schemaBuilder.mutationFields((t) => ({
	concludeResolutionVote: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id(),
			paperId: t.arg.id({ required: true }),
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

			const user = ctx.mustBeLoggedIn();
			if (!isGlobalAdmin(ctx)) {
				const paper = await db.query.resolutionPaper
					.findFirst({ where: { id: args.paperId } })
					.then(assertFindFirstExists);
				const chair = await db.query.conferenceUser.findFirst({
					where: {
						user: { id: user.sub },
						conference: { committees: { id: paper.committeeId } },
						conferenceUserType: { in: ['ADMIN', 'TEAM'] }
					}
				});
				if (!chair) throw new GraphQLError('Chair access required');
			}

			const content = await readPaperJson(args.paperId);
			await db.transaction(async (tx) => {
				await tx
					.insert(schema.resolutionVoteResult)
					.values({
						id: entityId,
						paperId: args.paperId,
						outcome: args.outcome,
						votesFor: args.votesFor,
						votesAgainst: args.votesAgainst,
						votesAbstain: args.votesAbstain ?? 0
					})
					.onConflictDoUpdate({
						target: schema.resolutionVoteResult.paperId,
						set: {
							outcome: args.outcome,
							votesFor: args.votesFor,
							votesAgainst: args.votesAgainst,
							votesAbstain: args.votesAbstain ?? 0,
							updatedAt: new Date()
						}
					});
				await tx
					.update(schema.resolutionPaper)
					.set({ status: 'FINAL' })
					.where(
						ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.paperId } })
							.sql.where
					);
				await tx.insert(schema.paperContentSnapshot).values({
					id: nanoid(),
					paperId: args.paperId,
					content,
					trigger: 'VOTE_CONCLUDED'
				});
			});

			pubsub.created();
			paperPubsub.updated(args.paperId);

			return db.query.resolutionVoteResult
				.findFirst(
					query(
						ctx.abilities.resolutionVoteResult.filter('read').merge({
							where: { paperId: args.paperId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
