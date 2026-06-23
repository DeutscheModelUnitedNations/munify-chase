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
	committeeMemberForPaper,
	isAmendmentProposer
} from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, nanoidValidation } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { and, count, eq } from 'drizzle-orm';
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

// Editing an amendment is allowed for chairs at any time, and for the
// proposer while the amendment is still PENDING (i.e. not yet submitted to
// the chair). Once SUBMITTED or further, only chairs can edit/delete.
abilityBuilder.amendment.allow(['update', 'delete']).when((ctx) => {
	return {
		where: {
			OR: [
				{ paper: { committee: isTeamInConference(ctx) } },
				{ status: 'PENDING' as const, ...isAmendmentProposer(ctx) }
			]
		}
	};
});

const ref = object({ table: 'amendment' });
query({ table: 'amendment' });
const pubsub = rumblePubsub({ table: 'amendment' });
const snapshotPubsub = rumblePubsub({ table: 'paperContentSnapshot' });

const typeEnum = enum_({ tsName: 'amendmentType' });
const statusEnum = enum_({ tsName: 'amendmentStatus' });

function parseFragmentOrThrow(text: string): OperativeClause {
	const result = parseClauseFragment(text);
	if (!result.valid) {
		throw new GraphQLError(`Invalid RES-Markup: ${result.errors.map((e) => e.code).join(', ')}`);
	}
	return result.clause;
}

schemaBuilder.mutationFields((t) => ({
	createAmendment: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			paperId: t.arg.id({ required: true }),
			type: t.arg({ type: typeEnum, required: true }),
			// Chairs must specify the proposer; for committee-member callers this
			// arg is ignored and the caller's own committeeMember is used.
			proposerCommitteeMemberId: t.arg.id(),
			// Only honored on the chair path. Committee members always create
			// amendments in PENDING.
			status: t.arg({ type: statusEnum }),
			targetClauseId: t.arg.string(),
			targetOperativeIndex: t.arg.int(),
			newContent: t.arg.string(),
			targetPosition: t.arg.int()
		},
		resolve: async (query, _root, args, ctx) => {

			const isChair = await db.query.resolutionPaper.findFirst({
				where: {
					id: args.paperId,
					committee: isTeamInConference(ctx)
				}
			});

			let proposerCommitteeMemberId: string;
			let status: typeof schema.amendment.$inferSelect.status;

			if (isChair) {
				if (!args.proposerCommitteeMemberId) {
					throw new GraphQLError('proposerCommitteeMemberId is required when creating as chair');
				}
				proposerCommitteeMemberId = args.proposerCommitteeMemberId;
				status = args.status ?? 'SUBMITTED';
			} else {
				const cu = await db.query.conferenceUser
					.findFirst({
						where: committeeMemberForPaper(ctx, args.paperId, {
							amendmentSubmissionOpen: true
						}),
						with: { committeeMember: true }
					})
					.then(assertFindFirstExists);
				proposerCommitteeMemberId = cu.committeeMember!.id;
				status = 'PENDING';
			}

			await db.transaction(async (tx) => {
				await tx.insert(schema.amendment).values({
					id: args.id,
					paperId: args.paperId,
					proposerCommitteeMemberId,
					type: args.type,
					status,
					targetClauseId: args.targetClauseId ?? null,
					targetOperativeIndex: args.targetOperativeIndex ?? null,
					newContent: args.newContent ?? null,
					targetPosition: args.targetPosition ?? null
				});
				await tx.insert(schema.amendmentSponsor).values({
					id: nanoid(),
					amendmentId: args.id,
					committeeMemberId: proposerCommitteeMemberId
				});
			});

			pubsub.created();

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.id } }).query.single
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
				.findFirst({
					where: { id: args.id },
					with: { paper: { columns: { committeeId: true } } }
				})
				.then(assertFindFirstExists);

			if (amendment.status !== 'PENDING') {
				throw new GraphQLError('Only pending amendments can be submitted');
			}

			const sponsors = await db.query.amendmentSponsor.findMany({
				where: { amendmentId: args.id }
			});

			const committee = await db.query.committee
				.findFirst({ where: { id: amendment.paper.committeeId } })
				.then(assertFindFirstExists);

			const presentCount = await db
				.select({ count: count() })
				.from(schema.committeeMember)
				.innerJoin(
					schema.representation,
					eq(schema.committeeMember.representationId, schema.representation.id)
				)
				.where(
					and(
						eq(schema.committeeMember.committeeId, amendment.paper.committeeId),
						eq(schema.committeeMember.present, true),
						eq(schema.representation.type, 'DELEGATION')
					)
				)
				.then(([r]) => r?.count ?? 0);
			const required = Math.ceil(presentCount * (committee.paperSupportThreshold / 100));

			if (sponsors.length < required) {
				throw new GraphQLError(
					`Amendment needs at least ${required} sponsor(s) to be submitted (has ${sponsors.length})`
				);
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
				.findFirst(
					ctx.abilities.amendment.filter('read').merge({ where: { id: args.id } }).query.single
				)
				.then(assertFindFirstExists);

			// Accepting an amendment modifies the paper, not the amendment as such.
			// Gate accordingly on the caller's ability to update the paper.
			await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: amendment.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			const newStatus = args.consensus ? 'CONSENSUS_ADOPTED' : 'ACCEPTED';

			// Apply the amendment to the paper's Y.Doc first; the yjs layer has
			// its own persistence so it can't share the DB transaction. Doing it
			// before the status flip means the amendment is only marked accepted
			// if the paper change actually landed.
			await applyServerMutation(amendment.paperId, (doc) => {
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

			const content = await readPaperJson(amendment.paperId);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.amendment)
					.set({ status: newStatus })
					.where(eq(schema.amendment.id, args.id));
				await tx.insert(schema.paperContentSnapshot).values({
					paperId: amendment.paperId,
					content,
					trigger: 'AMENDMENT_APPLIED'
				});
			});

			snapshotPubsub.created();
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

	deleteAmendment: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
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
