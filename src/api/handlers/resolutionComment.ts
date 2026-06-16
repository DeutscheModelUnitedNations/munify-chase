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
import { nanoidValidation } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

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

			const paper = await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('read').merge({ where: { id: args.paperId } }).query
						.single
				)
				.then(assertFindFirstExists);

			const author = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						conference: { committees: { id: paper.committeeId } }
					}
				})
				.then(assertFindFirstExists);

			const visibility = args.visibility ?? 'PUBLIC';
			if (visibility === 'TEAM_ONLY') {
				if (author.conferenceUserType !== 'ADMIN' && author.conferenceUserType !== 'TEAM') {
					throw new GraphQLError('Only chairs can create team-only comments');
				}
			}

			if (args.parentCommentId) {
				const parent = await db.query.resolutionComment
					.findFirst({ where: { id: args.parentCommentId } })
					.then(assertFindFirstExists);
				if (parent.parentCommentId) {
					throw new GraphQLError('Comments are limited to a single reply level');
				}
			}

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
				.findFirst(
					query(
						ctx.abilities.resolutionComment.filter('read').merge({ where: { id: args.id } }).query
							.single
					)
				)
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
					ctx.abilities.resolutionComment.filter('update').merge({ where: { id: args.id } }).sql
						.where
				);
			pubsub.updated(args.id);

			return db.query.resolutionComment
				.findFirst(
					query(
						ctx.abilities.resolutionComment.filter('read').merge({ where: { id: args.id } }).query
							.single
					)
				)
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
					ctx.abilities.resolutionComment.filter('delete').merge({ where: { id: args.id } }).sql
						.where
				);
			pubsub.removed();
			return true;
		}
	})
}));
