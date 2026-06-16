import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	pubsub as rumblePubsub,
	schemaBuilder
} from '$api/rumble';
import { isTeamInConference } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, nanoidValidation } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { customAlphabet } from 'nanoid';

const SHARE_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const shareCodeGenerator = customAlphabet(SHARE_CODE_ALPHABET, 6);

abilityBuilder.paperShareCode.allow('read').when((ctx) => {
	const user = ctx.mustBeLoggedIn();
	return {
		where: {
			OR: [
				{ paper: { committee: isTeamInConference(ctx) } },
				{ paper: { creatorCommitteeMember: { users: { user: { id: user.sub } } } } },
				{ paper: { editors: { conferenceUser: { user: { id: user.sub } } } } }
			]
		}
	};
});

abilityBuilder.paperShareCode.allow('delete').when((ctx) => {
	return { where: { paper: { committee: isTeamInConference(ctx) } } };
});

const ref = object({ table: 'paperShareCode' });
query({ table: 'paperShareCode' });
const pubsub = rumblePubsub({ table: 'paperShareCode' });
const editorPubsub = rumblePubsub({ table: 'paperEditor' });
const sponsorPubsub = rumblePubsub({ table: 'paperSponsor' });

const permissionEnum = enum_({ tsName: 'shareCodePermission' });

async function generateUniqueShareCode(): Promise<string> {
	for (let i = 0; i < 8; i++) {
		const code = shareCodeGenerator();
		const existing = await db.query.paperShareCode.findFirst({ where: { code } });
		if (!existing) return code;
	}
	throw new GraphQLError('Could not generate a unique share code');
}

schemaBuilder.mutationFields((t) => ({
	createPaperShareCode: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			paperId: t.arg.id({ required: true }),
			permission: t.arg({ type: permissionEnum, required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			await db.query.resolutionPaper.findFirst(
				ctx.abilities.resolutionPaper.filter('update').merge({
					where: { id: args.paperId }
				}).query.single
			);

			const code = await generateUniqueShareCode();

			await db.insert(schema.paperShareCode).values({
				id: args.id,
				paperId: args.paperId,
				code,
				permission: args.permission
			});

			pubsub.created();

			return db.query.paperShareCode
				.findFirst(
					query(
						ctx.abilities.paperShareCode.filter('read').merge({ where: { id: args.id } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	deletePaperShareCode: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			await db
				.delete(schema.paperShareCode)
				.where(
					ctx.abilities.paperShareCode.filter('delete').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.removed();
			return true;
		}
	}),

	redeemPaperShareCode: t.drizzleField({
		type: ref,
		args: { code: t.arg.string({ required: true }) },
		resolve: async (query, _root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();
			const shareCode = await db.query.paperShareCode
				.findFirst({
					where: { code: args.code },
					with: { paper: true }
				})
				.then(assertFindFirstExists);

			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						conference: { committees: { id: shareCode.paper.committeeId } }
					},
					with: { committeeMember: true }
				})
				.then(assertFindFirstExists);

			await db.transaction(async (tx) => {
				if (shareCode.permission === 'EDIT') {
					await tx
						.insert(schema.paperEditor)
						.values({
							id: nanoid(),
							paperId: shareCode.paperId,
							conferenceUserId: conferenceUser.id
						})
						.onConflictDoNothing();
					editorPubsub.created();
				}
				if (conferenceUser.committeeMember) {
					await tx
						.insert(schema.paperSponsor)
						.values({
							id: nanoid(),
							paperId: shareCode.paperId,
							committeeMemberId: conferenceUser.committeeMember.id
						})
						.onConflictDoNothing();
					sponsorPubsub.created();
				}
			});

			return db.query.paperShareCode
				.findFirst(
					query(
						ctx.abilities.paperShareCode.filter('read').merge({ where: { id: shareCode.id } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
