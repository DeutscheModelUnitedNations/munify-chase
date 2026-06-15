import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	pubsub as rumblePubsub,
	schemaBuilder
} from '$api/rumble';
import { isParticipantInConference, isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.resolutionComment.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

// PUBLIC comments visible to anyone in the conference.
// TEAM_ONLY visible only to chairs (filter applied in GraphQL ability rules
// would be ideal; for now we expose both and filter in UI as needed — the
// participant ability rule below applies the visibility filter).
abilityBuilder.resolutionComment.allow('read').when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
		}
	};
});

abilityBuilder.resolutionComment.allow(['update', 'delete']).when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
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
			id: t.arg.id(),
			paperId: t.arg.id({ required: true }),
			content: t.arg.string({ required: true }),
			clauseId: t.arg.string(),
			parentCommentId: t.arg.id(),
			visibility: t.arg({ type: visibilityEnum })
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			const user = ctx.mustBeLoggedIn();
			if (!user.email) throw new GraphQLError('User email required');

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId } })
				.then(assertFindFirstExists);

			const author = await db.query.conferenceUser
				.findFirst({
					where: {
						userEmail: user.email,
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
				id: entityId,
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
						ctx.abilities.resolutionComment.filter('read').merge({ where: { id: entityId } }).query
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
			const comment = await db.query.resolutionComment
				.findFirst({
					where: { id: args.id },
					with: { author: true }
				})
				.then(assertFindFirstExists);

			const user = ctx.mustBeLoggedIn();
			if (comment.author.userEmail !== user.email && !isGlobalAdmin(ctx)) {
				throw new GraphQLError('Only the author can edit a comment');
			}

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
			const comment = await db.query.resolutionComment
				.findFirst({
					where: { id: args.id },
					with: { author: true, paper: true }
				})
				.then(assertFindFirstExists);

			const user = ctx.mustBeLoggedIn();
			const isAuthor = comment.author.userEmail === user.email;
			const isChair = !!(await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					conference: { committees: { id: comment.paper.committeeId } },
					conferenceUserType: { in: ['ADMIN', 'TEAM'] }
				}
			}));
			if (!isAuthor && !isChair && !isGlobalAdmin(ctx)) {
				throw new GraphQLError('Only the author or a chair can delete a comment');
			}

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
