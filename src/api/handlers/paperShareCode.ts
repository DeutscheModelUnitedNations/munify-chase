import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '$api/rumble';
import { eq } from 'drizzle-orm';
import { isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import { customAlphabet } from 'nanoid';

abilityBuilder.paperShareCode.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.paperShareCode.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

const ref = object({ table: 'paperShareCode' });

const generateShareCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);
const shareCodePermissionEnum = enum_({ tsName: 'shareCodePermission' });

const ShareCodeRedemptionResult = schemaBuilder
	.objectRef<{ paperId: string; permission: string }>('ShareCodeRedemptionResult')
	.implement({
		fields: (t) => ({
			paperId: t.exposeID('paperId'),
			permission: t.exposeString('permission')
		})
	});

const pubsub = rumblePubsub({ table: 'paperShareCode' });
const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });
query({ table: 'paperShareCode' });

schemaBuilder.mutationFields((t) => ({
	createShareCode: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			permission: t.arg({ type: shareCodePermissionEnum, required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			// Must be paper creator
			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						committeeMemberId: paper.creatorCommitteeMemberId
					}
				})
				.then(assertFindFirstExists);

			const result = await db
				.insert(schema.paperShareCode)
				.values({
					paperId: args.paperId,
					code: generateShareCode(),
					permission: args.permission
				})
				.returning()
				.then(assertFirstEntryExists);

			pubsub.created();
			paperPubsub.updated(args.paperId);

			return db.query.paperShareCode
				.findFirst(
					query(
						ctx.abilities.paperShareCode.filter('read').merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	deleteShareCode: t.field({
		type: 'Boolean',
		args: {
			shareCodeId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			const shareCode = await db.query.paperShareCode
				.findFirst({
					where: { id: args.shareCodeId },
					with: { paper: true }
				})
				.then(assertFindFirstExists);

			// Must be paper creator
			await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						committeeMemberId: shareCode.paper.creatorCommitteeMemberId
					}
				})
				.then(assertFindFirstExists);

			await db.delete(schema.paperShareCode).where(eq(schema.paperShareCode.id, args.shareCodeId));

			pubsub.removed();
			paperPubsub.updated(shareCode.paperId);

			return true;
		}
	}),

	redeemShareCode: t.field({
		type: ShareCodeRedemptionResult,
		args: {
			code: t.arg.string({ required: true })
		},
		resolve: async (root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			const shareCode = await db.query.paperShareCode
				.findFirst({
					where: { code: args.code }
				})
				.then(assertFindFirstExists);

			if (shareCode.permission === 'EDIT') {
				// Find conference user for this user in the paper's conference
				const paper = await db.query.resolutionPaper
					.findFirst({
						where: { id: shareCode.paperId },
						with: { committee: true }
					})
					.then(assertFindFirstExists);

				const conferenceUser = await db.query.conferenceUser
					.findFirst({
						where: {
							user: { id: user.sub },
							conferenceId: paper.committee.conferenceId
						}
					})
					.then(assertFindFirstExists);

				// Add as editor, ignore if already exists
				await db
					.insert(schema.paperEditor)
					.values({
						paperId: shareCode.paperId,
						conferenceUserId: conferenceUser.id
					})
					.onConflictDoNothing();

				paperPubsub.updated(shareCode.paperId);
			}

			return {
				paperId: shareCode.paperId,
				permission: shareCode.permission
			};
		}
	})
}));
