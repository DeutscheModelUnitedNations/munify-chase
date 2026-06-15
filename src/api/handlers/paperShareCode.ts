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
import { customAlphabet } from 'nanoid';

const SHARE_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I
const shareCodeGenerator = customAlphabet(SHARE_CODE_ALPHABET, 6);

abilityBuilder.paperShareCode.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

// Share codes are readable by anyone who can read the paper.
abilityBuilder.paperShareCode.allow('read').when((ctx) => {
	return { where: { paper: { committee: isParticipantInConference(ctx) } } };
});

abilityBuilder.paperShareCode.allow(['update', 'delete']).when((ctx) => {
	return { where: { paper: { committee: isParticipantInConference(ctx) } } };
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
			id: t.arg.id(),
			paperId: t.arg.id({ required: true }),
			permission: t.arg({ type: permissionEnum, required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId },
					with: { editors: true }
				})
				.then(assertFindFirstExists);

			// Anyone with edit permission on the paper can create a share code.
			const user = ctx.mustBeLoggedIn();
			const isChair = !!(await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					conference: { committees: { id: paper.committeeId } },
					conferenceUserType: { in: ['ADMIN', 'TEAM'] }
				}
			}));
			const isEditor = !!(await db.query.paperEditor.findFirst({
				where: { paperId: args.paperId, conferenceUser: { user: { id: user.sub } } }
			}));
			if (!isChair && !isEditor && !isGlobalAdmin(ctx)) {
				throw new GraphQLError('Only chairs or editors can create share codes');
			}

			const code = await generateUniqueShareCode();

			await db.insert(schema.paperShareCode).values({
				id: entityId,
				paperId: args.paperId,
				code,
				permission: args.permission
			});

			pubsub.created();

			return db.query.paperShareCode
				.findFirst(
					query(
						ctx.abilities.paperShareCode.filter('read').merge({ where: { id: entityId } }).query
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
			const shareCode = await db.query.paperShareCode
				.findFirst({
					where: { code: args.code },
					with: { paper: true }
				})
				.then(assertFindFirstExists);

			const user = ctx.mustBeLoggedIn();
			if (!user.email) throw new GraphQLError('User email required');

			const cu = await db.query.conferenceUser
				.findFirst({
					where: {
						userEmail: user.email,
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
							conferenceUserId: cu.id
						})
						.onConflictDoNothing();
					editorPubsub.created();
				}
				if (cu.committeeMember) {
					await tx
						.insert(schema.paperSponsor)
						.values({
							id: nanoid(),
							paperId: shareCode.paperId,
							committeeMemberId: cu.committeeMember.id
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
