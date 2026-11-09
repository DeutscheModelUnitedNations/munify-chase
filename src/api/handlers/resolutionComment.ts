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
import { nanoidValidation } from '#lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { paperWithAbility, type ResolverContext } from './helpers/paperAccess';
import { assertMayCommentWith } from './helpers/paperRules';

abilityBuilder.resolutionComment.allow('read').when((ctx) => {
	return {
		where: {
			OR: [
				{
					visibility: 'PUBLIC',
					paper: { committee: isParticipantInConference(ctx) }
				},
				{
					visibility: 'TEAM_ONLY',
					paper: { committee: isTeamInConference(ctx) }
				}
			]
		}
	};
});

abilityBuilder.resolutionComment.allow(['update', 'delete']).when((ctx) => {
	const user = ctx.mustBeLoggedIn();
	return {
		where: {
			OR: [
				{ paper: { committee: isTeamInConference(ctx) } },
				{ author: { user: { id: user.sub } } }
			]
		}
	};
});

const ref = object({ table: 'resolutionComment' });
query({ table: 'resolutionComment' });
const pubsub = rumblePubsub({ table: 'resolutionComment' });

const visibilityEnum = enum_({ tsName: 'commentVisibility' });

/** The comment as the caller may read it, for a resolver to hand back. */
async function readableComment(ctx: ResolverContext, id: string) {
	return (await ctx.abilities.resolutionComment.filter('read')).merge({ where: { id } }).query
		.single;
}

/** Comments take one reply level: a reply to a reply is refused. */
async function assertReplyLevel(parentCommentId: string) {
	const parent = await db.query.resolutionComment
		.findFirst({ where: { id: parentCommentId } })
		.then(assertFindFirstExists);
	if (parent.parentCommentId) {
		throw new GraphQLError('Comments are limited to a single reply level');
	}
}

schemaBuilder.mutationFields((t) => ({
	createResolutionComment: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			paperId: t.arg.id({ required: true }),
			content: t.arg.string({ required: true }),
			clauseId: t.arg.string(),
			parentCommentId: t.arg.id(),
			visibility: t.arg({ type: visibilityEnum })
		},
		resolve: async (query, _root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const paper = await paperWithAbility({ ctx, paperId: args.paperId, action: 'read' });

			const author = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						conference: { committees: { id: paper.committeeId } }
					}
				})
				.then(assertFindFirstExists);

			const visibility = args.visibility ?? 'PUBLIC';
			assertMayCommentWith({ visibility, authorType: author.conferenceUserType });
			if (args.parentCommentId) await assertReplyLevel(args.parentCommentId);

			await db.insert(schema.resolutionComment).values({
				id: args.id,
				paperId: args.paperId,
				clauseId: args.clauseId ?? null,
				authorConferenceUserId: author.id,
				content: args.content,
				visibility,
				parentCommentId: args.parentCommentId ?? null
			});

			pubsub.created();

			return db.query.resolutionComment
				.findFirst(query(await readableComment(ctx, args.id)))
				.then(assertFindFirstExists);
		}
	}),

	updateResolutionComment: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id({ required: true }),
			content: t.arg.string({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			await db
				.update(schema.resolutionComment)
				.set({ content: args.content })
				.where(
					(await ctx.abilities.resolutionComment.filter('update')).merge({ where: { id: args.id } })
						.sql.where
				);
			pubsub.updated(args.id);

			return db.query.resolutionComment
				.findFirst(query(await readableComment(ctx, args.id)))
				.then(assertFindFirstExists);
		}
	}),

	deleteResolutionComment: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			await db
				.delete(schema.resolutionComment)
				.where(
					(await ctx.abilities.resolutionComment.filter('delete')).merge({ where: { id: args.id } })
						.sql.where
				);
			pubsub.removed();
			return true;
		}
	})
}));
