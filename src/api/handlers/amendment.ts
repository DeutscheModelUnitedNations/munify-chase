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
import { applyServerMutation, readPaperJson } from '$api/yjs/server';
import {
	yDocToJson,
	replaceResolution
} from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import { parseClauseFragment } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
import type {
	OperativeClause,
	Resolution
} from '@deutschemodelunitednations/munify-resolution-editor/schema';

abilityBuilder.amendment.allow('read').when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
		}
	};
});

abilityBuilder.amendment.allow(['update', 'delete']).when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
		}
	};
});

const ref = object({ table: 'amendment' });
query({ table: 'amendment' });
const pubsub = rumblePubsub({ table: 'amendment' });
const snapshotPubsub = rumblePubsub({ table: 'paperContentSnapshot' });

const typeEnum = enum_({ tsName: 'amendmentType' });
const statusEnum = enum_({ tsName: 'amendmentStatus' });

async function ensureChairOfPaper(
	ctx: {
		mustBeLoggedIn: () => { sub: string; email?: string | null };
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

function parseFragmentOrThrow(text: string): OperativeClause {
	const result = parseClauseFragment(text);
	if (!result.valid) {
		throw new GraphQLError(`Invalid RES-Markup: ${result.errors.map((e) => e.code).join(', ')}`);
	}
	return result.clause;
}

/**
 * Apply an accepted amendment to the paper's Y.Doc. Server-authoritative.
 */
async function applyAmendment(
	paperId: string,
	amendment: typeof schema.amendment.$inferSelect
): Promise<void> {
	await applyServerMutation(paperId, (doc) => {
		const current = yDocToJson(doc);
		const next: Resolution = JSON.parse(JSON.stringify(current));

		switch (amendment.type) {
			case 'DELETE': {
				if (!amendment.targetClauseId) return;
				next.operative = next.operative.filter((c) => c.id !== amendment.targetClauseId);
				break;
			}
			case 'ADD': {
				if (!amendment.newContent) return;
				const clause = parseFragmentOrThrow(amendment.newContent);
				const pos = Math.max(
					0,
					Math.min(amendment.targetPosition ?? next.operative.length, next.operative.length)
				);
				next.operative.splice(pos, 0, clause);
				break;
			}
			case 'ALTER_TEXT': {
				if (!amendment.targetClauseId || !amendment.newContent) return;
				const fresh = parseFragmentOrThrow(amendment.newContent);
				const idx = next.operative.findIndex((c) => c.id === amendment.targetClauseId);
				if (idx < 0) return;
				// Preserve clause id to keep cursors stable; replace blocks.
				next.operative[idx] = { ...fresh, id: amendment.targetClauseId };
				break;
			}
			case 'ALTER_POSITION': {
				if (!amendment.targetClauseId || amendment.targetPosition == null) return;
				const idx = next.operative.findIndex((c) => c.id === amendment.targetClauseId);
				if (idx < 0) return;
				const [clause] = next.operative.splice(idx, 1);
				const target = Math.max(0, Math.min(amendment.targetPosition, next.operative.length));
				next.operative.splice(target, 0, clause);
				break;
			}
		}

		replaceResolution(doc, next);
	});

	// Snapshot the result.
	const content = await readPaperJson(paperId);
	await db.insert(schema.paperContentSnapshot).values({
		id: nanoid(),
		paperId,
		content,
		trigger: 'AMENDMENT_APPLIED'
	});
	snapshotPubsub.created();
}

schemaBuilder.mutationFields((t) => ({
	createAmendment: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id(),
			paperId: t.arg.id({ required: true }),
			type: t.arg({ type: typeEnum, required: true }),
			targetClauseId: t.arg.string(),
			targetOperativeIndex: t.arg.int(),
			newContent: t.arg.string(),
			targetPosition: t.arg.int()
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			const user = ctx.mustBeLoggedIn();
			if (!user.email) throw new GraphQLError('User email required');

			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId },
					with: { committee: true }
				})
				.then(assertFindFirstExists);

			if (!paper.committee.amendmentSubmissionOpen) {
				throw new GraphQLError('Amendment submission is closed');
			}

			const cu = await db.query.conferenceUser
				.findFirst({
					where: {
						userEmail: user.email,
						committeeMember: { committeeId: paper.committeeId }
					},
					with: { committeeMember: true }
				})
				.then(assertFindFirstExists);
			if (!cu.committeeMember) throw new GraphQLError('Not a committee member');

			await db.transaction(async (tx) => {
				await tx.insert(schema.amendment).values({
					id: entityId,
					paperId: args.paperId,
					proposerCommitteeMemberId: cu.committeeMember!.id,
					type: args.type,
					status: 'PENDING',
					targetClauseId: args.targetClauseId ?? null,
					targetOperativeIndex: args.targetOperativeIndex ?? null,
					newContent: args.newContent ?? null,
					targetPosition: args.targetPosition ?? null
				});
				await tx.insert(schema.amendmentSponsor).values({
					id: nanoid(),
					amendmentId: entityId,
					committeeMemberId: cu.committeeMember!.id
				});
			});

			pubsub.created();

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: entityId } }).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	chairCreateAmendment: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id(),
			paperId: t.arg.id({ required: true }),
			proposerCommitteeMemberId: t.arg.id({ required: true }),
			type: t.arg({ type: typeEnum, required: true }),
			status: t.arg({ type: statusEnum }),
			targetClauseId: t.arg.string(),
			targetOperativeIndex: t.arg.int(),
			newContent: t.arg.string(),
			targetPosition: t.arg.int()
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			await ensureChairOfPaper(ctx, args.paperId);

			await db.transaction(async (tx) => {
				await tx.insert(schema.amendment).values({
					id: entityId,
					paperId: args.paperId,
					proposerCommitteeMemberId: args.proposerCommitteeMemberId,
					type: args.type,
					status: args.status ?? 'SUBMITTED',
					targetClauseId: args.targetClauseId ?? null,
					targetOperativeIndex: args.targetOperativeIndex ?? null,
					newContent: args.newContent ?? null,
					targetPosition: args.targetPosition ?? null
				});
				await tx.insert(schema.amendmentSponsor).values({
					id: nanoid(),
					amendmentId: entityId,
					committeeMemberId: args.proposerCommitteeMemberId
				});
			});

			pubsub.created();

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: entityId } }).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	submitAmendment: t.drizzleField({
		type: ref,
		args: { id: t.arg.id({ required: true }) },
		resolve: async (query, _root, args, ctx) => {
			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.id } })
				.then(assertFindFirstExists);
			if (amendment.status !== 'PENDING') {
				throw new GraphQLError('Only pending amendments can be submitted');
			}
			await db
				.update(schema.amendment)
				.set({ status: 'SUBMITTED' })
				.where(
					ctx.abilities.amendment.filter('update').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.updated(args.id);
			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.id } }).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	acceptAmendment: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id({ required: true }),
			consensus: t.arg.boolean()
		},
		resolve: async (query, _root, args, ctx) => {
			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.id } })
				.then(assertFindFirstExists);
			await ensureChairOfPaper(ctx, amendment.paperId);

			const newStatus = args.consensus ? 'CONSENSUS_ADOPTED' : 'ACCEPTED';

			await db.transaction(async (tx) => {
				await tx
					.update(schema.amendment)
					.set({ status: newStatus })
					.where(
						ctx.abilities.amendment.filter('update').merge({ where: { id: args.id } }).sql.where
					);
			});

			await applyAmendment(amendment.paperId, { ...amendment, status: newStatus });

			pubsub.updated(args.id);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.id } }).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	rejectAmendment: t.drizzleField({
		type: ref,
		args: { id: t.arg.id({ required: true }) },
		resolve: async (query, _root, args, ctx) => {
			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.id } })
				.then(assertFindFirstExists);
			await ensureChairOfPaper(ctx, amendment.paperId);
			await db
				.update(schema.amendment)
				.set({ status: 'REJECTED' })
				.where(
					ctx.abilities.amendment.filter('update').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.updated(args.id);
			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.id } }).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	withdrawAmendment: t.drizzleField({
		type: ref,
		args: { id: t.arg.id({ required: true }) },
		resolve: async (query, _root, args, ctx) => {
			const amendment = await db.query.amendment
				.findFirst({
					where: { id: args.id },
					with: { proposer: { with: { users: true } } }
				})
				.then(assertFindFirstExists);
			const user = ctx.mustBeLoggedIn();
			const isProposer = amendment.proposer.users.some((u) => u.userEmail === user.email);
			if (!isProposer && !isGlobalAdmin(ctx)) {
				const paper = await db.query.resolutionPaper
					.findFirst({ where: { id: amendment.paperId } })
					.then(assertFindFirstExists);
				const chair = await db.query.conferenceUser.findFirst({
					where: {
						user: { id: user.sub },
						conference: { committees: { id: paper.committeeId } },
						conferenceUserType: { in: ['ADMIN', 'TEAM'] }
					}
				});
				if (!chair) throw new GraphQLError('Only the proposer or a chair can withdraw');
			}
			if (amendment.status !== 'PENDING' && amendment.status !== 'SUBMITTED') {
				throw new GraphQLError('Cannot withdraw after a chair decision');
			}
			await db
				.update(schema.amendment)
				.set({ status: 'WITHDRAWN' })
				.where(
					ctx.abilities.amendment.filter('update').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.updated(args.id);
			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.id } }).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	deleteAmendment: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.id } })
				.then(assertFindFirstExists);
			await ensureChairOfPaper(ctx, amendment.paperId);
			await db
				.delete(schema.amendment)
				.where(
					ctx.abilities.amendment.filter('delete').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.removed();
			return true;
		}
	})
}));
