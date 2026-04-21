import { db, schema } from '$api/db/db';
import { abilityBuilder, enum_, schemaBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { eq } from 'drizzle-orm';
import { isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';

// ──────────────────────────────────────────────────
// Access control
// ──────────────────────────────────────────────────

// Global admin → can see ALL comments (including TEAM_ONLY)
abilityBuilder.resolutionComment.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

// Conference ADMIN/TEAM → can see ALL comments (including TEAM_ONLY)
abilityBuilder.resolutionComment.allow('read').when(((ctx: any) => {
	const user = ctx.mustBeLoggedIn();
	if (!user.sub) return;
	return db.query.conferenceUser
		.findFirst({
			where: {
				user: { id: user.sub },
				conferenceUserType: { in: ['ADMIN', 'TEAM'] }
			}
		})
		.then((cu: any) => (cu ? 'allow' : undefined));
}) as any);

// Regular logged-in users → only see PUBLIC comments
abilityBuilder.resolutionComment.allow('read').when((ctx) => {
	ctx.mustBeLoggedIn();
	return { where: { visibility: 'PUBLIC' } };
});

const ref = object({ table: 'resolutionComment' });

const commentVisibilityEnum = enum_({ tsName: 'commentVisibility' });

// Helper: check if user is TEAM/ADMIN for the conference owning a given paper
async function isChairOrAdmin(
	ctx: {
		hasRole: (role: string) => boolean;
		mustBeLoggedIn: () => { sub?: string; email?: string | null };
	},
	committeeId: string
): Promise<boolean> {
	if (isGlobalAdmin(ctx)) return true;

	const user = ctx.mustBeLoggedIn();
	const cuRecord = await db.query.conferenceUser.findFirst({
		where: {
			conference: {
				committees: { id: committeeId }
			},
			user: { id: user.sub },
			conferenceUserType: { in: ['ADMIN', 'TEAM'] }
		}
	});

	return !!cuRecord;
}

const pubsub = rumblePubsub({ table: 'resolutionComment' });
const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });
query({ table: 'resolutionComment' });

// ──────────────────────────────────────────────────
// Mutations
// ──────────────────────────────────────────────────

schemaBuilder.mutationFields((t) => ({
	createComment: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			content: t.arg.string({ required: true }),
			clauseId: t.arg.string(),
			visibility: t.arg({ type: commentVisibilityEnum }),
			parentCommentId: t.arg.id()
		},
		resolve: async (query, root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			// Resolve conference user
			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: { user: { id: user.sub } }
				})
				.then(assertFindFirstExists);

			// Fetch paper and validate status
			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			const allowedStatuses = ['SUBMITTED', 'DRAFT_RESOLUTION', 'AMENDMENT_PHASE', 'FINAL'];
			if (!allowedStatuses.includes(paper.status)) {
				throw new GraphQLError(
					'Comments are only allowed on submitted papers and draft resolutions'
				);
			}

			// Visibility check: only chairs/admins can post TEAM_ONLY
			const visibility = args.visibility ?? 'PUBLIC';
			if (visibility === 'TEAM_ONLY') {
				const isChair = await isChairOrAdmin(ctx, paper.committeeId);
				if (!isChair) {
					throw new GraphQLError('Only chairs and team members can post team-only comments');
				}
			}

			// Validate parentCommentId if provided
			if (args.parentCommentId) {
				const parent = await db.query.resolutionComment
					.findFirst({
						where: { id: args.parentCommentId }
					})
					.then(assertFindFirstExists);

				if (parent.paperId !== args.paperId) {
					throw new GraphQLError('Parent comment must belong to the same paper');
				}

				// Only 1 level of threading: parent must be top-level
				if (parent.parentCommentId) {
					throw new GraphQLError('Replies can only be one level deep');
				}

				// If clauseId is set, parent must target the same clause
				if (args.clauseId && parent.clauseId && parent.clauseId !== args.clauseId) {
					throw new GraphQLError('Reply must target the same clause as the parent comment');
				}
			}

			const result = await db
				.insert(schema.resolutionComment)
				.values({
					paperId: args.paperId,
					clauseId: args.clauseId ?? null,
					authorConferenceUserId: conferenceUser.id,
					content: args.content,
					visibility,
					parentCommentId: args.parentCommentId ?? null
				})
				.returning()
				.then(assertFirstEntryExists);

			pubsub.created();
			paperPubsub.updated(args.paperId);

			return db.query.resolutionComment
				.findFirst(
					query(
						ctx.abilities.resolutionComment.filter('read').merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	updateComment: t.drizzleField({
		type: ref,
		args: {
			commentId: t.arg.id({ required: true }),
			content: t.arg.string({ required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			const comment = await db.query.resolutionComment
				.findFirst({
					where: { id: args.commentId }
				})
				.then(assertFindFirstExists);

			// Must be the author
			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: { user: { id: user.sub } }
				})
				.then(assertFindFirstExists);

			if (comment.authorConferenceUserId !== conferenceUser.id) {
				throw new GraphQLError('Only the author can edit a comment');
			}

			await db
				.update(schema.resolutionComment)
				.set({ content: args.content })
				.where(eq(schema.resolutionComment.id, args.commentId));

			pubsub.updated(args.commentId);
			paperPubsub.updated(comment.paperId);

			return db.query.resolutionComment
				.findFirst(
					query(
						ctx.abilities.resolutionComment.filter('read').merge({
							where: { id: args.commentId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	deleteComment: t.field({
		type: 'Boolean',
		args: {
			commentId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const comment = await db.query.resolutionComment
				.findFirst({
					where: { id: args.commentId }
				})
				.then(assertFindFirstExists);

			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: { user: { id: user.sub } }
				})
				.then(assertFindFirstExists);

			// Author can delete own, or chairs/admins can delete any
			const isAuthor = comment.authorConferenceUserId === conferenceUser.id;
			if (!isAuthor) {
				const paper = await db.query.resolutionPaper
					.findFirst({ where: { id: comment.paperId } })
					.then(assertFindFirstExists);

				const isChair = await isChairOrAdmin(ctx, paper.committeeId);
				if (!isChair) {
					throw new GraphQLError('Only the author or chairs can delete comments');
				}
			}

			// Cascade deletes replies via DB constraint
			await db
				.delete(schema.resolutionComment)
				.where(eq(schema.resolutionComment.id, args.commentId));

			pubsub.removed();
			paperPubsub.updated(comment.paperId);

			return true;
		}
	})
}));
