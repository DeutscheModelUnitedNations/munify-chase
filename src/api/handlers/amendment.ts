import { db, schema } from '$api/db/db';
import { abilityBuilder, enum_, schemaBuilder, pubsub as rumblePubsub } from '$api/rumble';
import { basics } from './basics';
import { isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { and, eq, count as drizzleCount, not, inArray, gt, gte, sql } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { assertCommitteeChairOrAdmin } from './resolutionPaper';
import {
	ResolutionSchema,
	OperativeClauseSchema
} from '@deutschemodelunitednations/munify-resolution-editor/schema';

const { ref, pubsub, table } = basics('amendment');
const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });

const amendmentTypeEnum = enum_({ tsName: 'amendmentType' });
const amendmentStatusEnum = enum_({ tsName: 'amendmentStatus' });

abilityBuilder.amendment.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.amendment.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

// =============================================================================
// HELPERS
// =============================================================================

function validateAmendmentArgs(
	type: string,
	args: {
		targetClauseId?: string | null;
		targetOperativeIndex?: number | null;
		targetPosition?: number | null;
		newContent?: unknown;
	}
) {
	switch (type) {
		case 'DELETE':
			if (args.targetClauseId === undefined || args.targetClauseId === null) {
				throw new GraphQLError('DELETE amendments require targetClauseId');
			}
			if (args.targetOperativeIndex === undefined || args.targetOperativeIndex === null) {
				throw new GraphQLError('DELETE amendments require targetOperativeIndex');
			}
			break;
		case 'ADD':
			if (args.targetPosition === undefined || args.targetPosition === null) {
				throw new GraphQLError('ADD amendments require targetPosition');
			}
			if (!args.newContent) {
				throw new GraphQLError('ADD amendments require newContent');
			}
			break;
		case 'ALTER_TEXT':
			if (args.targetClauseId === undefined || args.targetClauseId === null) {
				throw new GraphQLError('ALTER_TEXT amendments require targetClauseId');
			}
			if (args.targetOperativeIndex === undefined || args.targetOperativeIndex === null) {
				throw new GraphQLError('ALTER_TEXT amendments require targetOperativeIndex');
			}
			if (!args.newContent) {
				throw new GraphQLError('ALTER_TEXT amendments require newContent');
			}
			break;
		case 'ALTER_POSITION':
			if (args.targetOperativeIndex === undefined || args.targetOperativeIndex === null) {
				throw new GraphQLError('ALTER_POSITION amendments require targetOperativeIndex (source)');
			}
			if (args.targetPosition === undefined || args.targetPosition === null) {
				throw new GraphQLError('ALTER_POSITION amendments require targetPosition (destination)');
			}
			break;
	}
}

type Resolution = { committeeName: string; preamble: unknown[]; operative: unknown[] };

/**
 * Find the current index of a clause by its stable ID.
 * Throws if the clause is not found (e.g. already deleted by a prior amendment).
 */
function findClauseIndex(operative: { id: string }[], clauseId: string): number {
	const idx = operative.findIndex((c) => c.id === clauseId);
	if (idx === -1) {
		throw new GraphQLError(
			`Clause "${clauseId}" not found in resolution — it may have been deleted by a prior amendment`
		);
	}
	return idx;
}

/**
 * Auto-adjust targetPosition on remaining PENDING/SUBMITTED ADD/ALTER_POSITION amendments
 * after a structural change (deletion or insertion) shifts operative clause indices.
 */
async function adjustPendingPositions(
	tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
	paperId: string,
	excludeAmendmentId: string,
	direction: 'decrement' | 'increment',
	thresholdIndex: number,
	comparison: 'gt' | 'gte'
) {
	const delta = direction === 'decrement' ? -1 : 1;
	const cmp =
		comparison === 'gt'
			? gt(schema.amendment.targetPosition, thresholdIndex)
			: gte(schema.amendment.targetPosition, thresholdIndex);

	await tx
		.update(schema.amendment)
		.set({ targetPosition: sql`${schema.amendment.targetPosition} + ${delta}` })
		.where(
			and(
				eq(schema.amendment.paperId, paperId),
				inArray(schema.amendment.status, ['PENDING', 'SUBMITTED']),
				inArray(schema.amendment.type, ['ADD', 'ALTER_POSITION']),
				not(eq(schema.amendment.id, excludeAmendmentId)),
				cmp
			)
		);
}

async function applyAmendmentToResolution(
	tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
	amendment: typeof schema.amendment.$inferSelect,
	paper: typeof schema.resolutionPaper.$inferSelect
) {
	const parsed = ResolutionSchema.safeParse(paper.content);
	if (!parsed.success) {
		throw new GraphQLError('Paper content is invalid');
	}
	const resolution = parsed.data;

	// Snapshot before applying
	await tx.insert(schema.paperContentSnapshot).values({
		paperId: paper.id,
		content: paper.content,
		trigger: `AMENDMENT_${amendment.type}`
	});

	switch (amendment.type) {
		case 'DELETE': {
			// Resolve current index from stable clause ID (not stored index)
			const idx = findClauseIndex(resolution.operative, amendment.targetClauseId!);
			resolution.operative.splice(idx, 1);
			// Auto-withdraw other PENDING/SUBMITTED amendments targeting the deleted clause
			await tx
				.update(schema.amendment)
				.set({ status: 'WITHDRAWN' })
				.where(
					and(
						eq(schema.amendment.paperId, paper.id),
						eq(schema.amendment.targetClauseId, amendment.targetClauseId!),
						inArray(schema.amendment.status, ['PENDING', 'SUBMITTED']),
						not(eq(schema.amendment.id, amendment.id))
					)
				);
			// Adjust targetPosition on remaining ADD/ALTER_POSITION amendments
			await adjustPendingPositions(tx, paper.id, amendment.id, 'decrement', idx, 'gt');
			break;
		}
		case 'ADD': {
			const parsedClause = OperativeClauseSchema.safeParse(amendment.newContent);
			if (!parsedClause.success) {
				throw new GraphQLError('Invalid newContent for ADD amendment');
			}
			const insertAfter = amendment.targetPosition!;
			resolution.operative.splice(insertAfter + 1, 0, parsedClause.data);
			// Adjust targetPosition on remaining ADD/ALTER_POSITION amendments
			await adjustPendingPositions(tx, paper.id, amendment.id, 'increment', insertAfter, 'gte');
			break;
		}
		case 'ALTER_TEXT': {
			// Resolve current index from stable clause ID
			const idx = findClauseIndex(resolution.operative, amendment.targetClauseId!);
			const parsedClause = OperativeClauseSchema.safeParse(amendment.newContent);
			if (!parsedClause.success) {
				throw new GraphQLError('Invalid newContent for ALTER_TEXT amendment');
			}
			// Keep original clause ID, replace blocks
			resolution.operative[idx] = {
				...parsedClause.data,
				id: resolution.operative[idx].id
			};
			break;
		}
		case 'ALTER_POSITION': {
			// Resolve current index from stable clause ID
			const sourceIdx = findClauseIndex(resolution.operative, amendment.targetClauseId!);
			const destIdx = amendment.targetPosition!;
			if (destIdx < 0 || destIdx > resolution.operative.length) {
				throw new GraphQLError('Destination index out of range');
			}
			const [clause] = resolution.operative.splice(sourceIdx, 1);
			// After removing from source, the target index might shift
			const adjustedDest = destIdx > sourceIdx ? destIdx - 1 : destIdx;
			resolution.operative.splice(adjustedDest, 0, clause);
			// Adjust other pending amendments' targetPosition for the structural shift
			// First: source removal shifts indices down
			await adjustPendingPositions(tx, paper.id, amendment.id, 'decrement', sourceIdx, 'gt');
			// Then: destination insertion shifts indices up
			await adjustPendingPositions(tx, paper.id, amendment.id, 'increment', adjustedDest, 'gte');
			break;
		}
	}

	await tx
		.update(schema.resolutionPaper)
		.set({ content: resolution })
		.where(eq(schema.resolutionPaper.id, paper.id));
}

// =============================================================================
// MUTATIONS
// =============================================================================

schemaBuilder.mutationFields((t) => ({
	createAmendment: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			type: t.arg({ type: amendmentTypeEnum, required: true }),
			targetClauseId: t.arg.string(),
			targetOperativeIndex: t.arg.int(),
			targetPosition: t.arg.int(),
			newContent: t.arg({ type: 'JSON' })
		},
		resolve: async (query, root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			// Find delegate's committee member
			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId } })
				.then(assertFindFirstExists);

			if (paper.status !== 'AMENDMENT_PHASE') {
				throw new GraphQLError('Paper must be in AMENDMENT_PHASE');
			}

			// Verify this is the active DR
			const committee = await db.query.committee
				.findFirst({ where: { id: paper.committeeId } })
				.then(assertFindFirstExists);

			if (committee.activeDraftResolutionId !== paper.id) {
				throw new GraphQLError('Paper must be the active draft resolution');
			}

			if (!committee.amendmentSubmissionOpen) {
				throw new GraphQLError('Amendment submission is currently closed');
			}

			// Find the delegate's conference user + committee member
			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						conferenceUserType: 'DELEGATE',
						committeeMember: {
							committeeId: paper.committeeId
						}
					}
				})
				.then(assertFindFirstExists);

			if (!conferenceUser.committeeMemberId) {
				throw new GraphQLError('You must be assigned to a committee member');
			}

			// Validate type-specific args
			validateAmendmentArgs(args.type, args);

			// If targetClauseId is provided, resolve and auto-correct the operative index
			if (args.targetClauseId) {
				const parsed = ResolutionSchema.safeParse(paper.content);
				if (parsed.success) {
					const actualIdx = parsed.data.operative.findIndex((c) => c.id === args.targetClauseId);
					if (actualIdx === -1) {
						throw new GraphQLError('Target clause no longer exists in the resolution');
					}
					// Auto-correct stale index from client
					if (args.targetOperativeIndex !== actualIdx) {
						args.targetOperativeIndex = actualIdx;
					}
				}
			}

			// For DELETE and ALTER_TEXT, validate targetOperativeIndex >= currentOperativeIndex
			if (
				(args.type === 'DELETE' || args.type === 'ALTER_TEXT') &&
				committee.currentOperativeIndex !== null &&
				args.targetOperativeIndex !== undefined &&
				args.targetOperativeIndex !== null &&
				args.targetOperativeIndex < committee.currentOperativeIndex
			) {
				throw new GraphQLError('Cannot amend a clause that has already been passed');
			}

			// Validate newContent if provided
			if (args.newContent) {
				const parsedContent = OperativeClauseSchema.safeParse(args.newContent);
				if (!parsedContent.success) {
					throw new GraphQLError('Invalid newContent: ' + parsedContent.error.message);
				}
			}

			// Check for duplicate amendment (same proposer, type, and target clause)
			{
				const duplicateConditions = [
					eq(schema.amendment.paperId, args.paperId),
					eq(schema.amendment.proposerCommitteeMemberId, conferenceUser.committeeMemberId),
					eq(schema.amendment.type, args.type),
					inArray(schema.amendment.status, ['PENDING', 'SUBMITTED'])
				];

				// Use targetClauseId for duplicate detection (stable, not affected by index drift)
				if (args.targetClauseId) {
					duplicateConditions.push(eq(schema.amendment.targetClauseId, args.targetClauseId));
				}

				const [{ count: duplicateCount }] = await db
					.select({ count: drizzleCount() })
					.from(schema.amendment)
					.where(and(...duplicateConditions));

				if (Number(duplicateCount) > 0) {
					throw new GraphQLError(
						'You have already submitted an amendment of this type for this clause'
					);
				}
			}

			// Count existing amendments of same type for this paper to assign sequence number
			const [{ count: sameTypeCount }] = await db
				.select({ count: drizzleCount() })
				.from(schema.amendment)
				.where(
					and(eq(schema.amendment.paperId, args.paperId), eq(schema.amendment.type, args.type))
				);

			const typeSeq = Number(sameTypeCount) + 1;

			const typePrefixMap: Record<string, string> = {
				DELETE: 'DEL',
				ALTER_TEXT: 'ALT',
				ADD: 'ADD',
				ALTER_POSITION: 'POS'
			};
			const typePrefix = typePrefixMap[args.type];

			const documentNumber = `${paper.documentNumber}/${typePrefix}.${typeSeq}`;

			// Create amendment
			const result = await db
				.insert(schema.amendment)
				.values({
					paperId: args.paperId,
					proposerCommitteeMemberId: conferenceUser.committeeMemberId,
					type: args.type,
					status: 'SUBMITTED',
					targetClauseId: args.targetClauseId ?? undefined,
					targetOperativeIndex: args.targetOperativeIndex ?? undefined,
					newContent: args.newContent ?? undefined,
					targetPosition: args.targetPosition ?? undefined,
					documentNumber,
					sequenceNumber: typeSeq
				})
				.returning()
				.then(assertFirstEntryExists);

			// Auto-add proposer as first sponsor
			await db.insert(schema.amendmentSponsor).values({
				amendmentId: result.id,
				committeeMemberId: conferenceUser.committeeMemberId
			});

			pubsub.created();
			paperPubsub.updated(args.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),
	chairCreateAmendment: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			type: t.arg({ type: amendmentTypeEnum, required: true }),
			committeeMemberId: t.arg.id({ required: true }),
			targetClauseId: t.arg.string(),
			targetOperativeIndex: t.arg.int(),
			targetPosition: t.arg.int(),
			newContent: t.arg({ type: 'JSON' })
		},
		resolve: async (query, root, args, ctx, info) => {
			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId } })
				.then(assertFindFirstExists);

			if (paper.status !== 'AMENDMENT_PHASE') {
				throw new GraphQLError('Paper must be in AMENDMENT_PHASE');
			}

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			// Verify this is the active DR
			const committee = await db.query.committee
				.findFirst({ where: { id: paper.committeeId } })
				.then(assertFindFirstExists);

			if (committee.activeDraftResolutionId !== paper.id) {
				throw new GraphQLError('Paper must be the active draft resolution');
			}

			// Validate committeeMemberId belongs to this committee
			await db.query.committeeMember
				.findFirst({
					where: { id: args.committeeMemberId, committeeId: paper.committeeId }
				})
				.then(assertFindFirstExists);

			// Validate type-specific args
			validateAmendmentArgs(args.type, args);

			// If targetClauseId is provided, resolve and auto-correct the operative index
			if (args.targetClauseId) {
				const parsed = ResolutionSchema.safeParse(paper.content);
				if (parsed.success) {
					const actualIdx = parsed.data.operative.findIndex((c) => c.id === args.targetClauseId);
					if (actualIdx === -1) {
						throw new GraphQLError('Target clause no longer exists in the resolution');
					}
					// Auto-correct stale index from client
					if (args.targetOperativeIndex !== actualIdx) {
						args.targetOperativeIndex = actualIdx;
					}
				}
			}

			// Validate newContent if provided
			if (args.newContent) {
				const parsedContent = OperativeClauseSchema.safeParse(args.newContent);
				if (!parsedContent.success) {
					throw new GraphQLError('Invalid newContent: ' + parsedContent.error.message);
				}
			}

			// Check for duplicate amendment (same proposer, type, and target clause)
			{
				const duplicateConditions = [
					eq(schema.amendment.paperId, args.paperId),
					eq(schema.amendment.proposerCommitteeMemberId, args.committeeMemberId),
					eq(schema.amendment.type, args.type),
					inArray(schema.amendment.status, ['PENDING', 'SUBMITTED'])
				];

				// Use targetClauseId for duplicate detection (stable, not affected by index drift)
				if (args.targetClauseId) {
					duplicateConditions.push(eq(schema.amendment.targetClauseId, args.targetClauseId));
				}

				const [{ count: duplicateCount }] = await db
					.select({ count: drizzleCount() })
					.from(schema.amendment)
					.where(and(...duplicateConditions));

				if (Number(duplicateCount) > 0) {
					throw new GraphQLError(
						'You have already submitted an amendment of this type for this clause'
					);
				}
			}

			// Count existing amendments of same type for this paper to assign sequence number
			const [{ count: sameTypeCount }] = await db
				.select({ count: drizzleCount() })
				.from(schema.amendment)
				.where(
					and(eq(schema.amendment.paperId, args.paperId), eq(schema.amendment.type, args.type))
				);

			const typeSeq = Number(sameTypeCount) + 1;

			const typePrefixMap: Record<string, string> = {
				DELETE: 'DEL',
				ALTER_TEXT: 'ALT',
				ADD: 'ADD',
				ALTER_POSITION: 'POS'
			};
			const typePrefix = typePrefixMap[args.type];

			const documentNumber = `${paper.documentNumber}/${typePrefix}.${typeSeq}`;

			// Create amendment
			const result = await db
				.insert(schema.amendment)
				.values({
					paperId: args.paperId,
					proposerCommitteeMemberId: args.committeeMemberId,
					type: args.type,
					status: 'SUBMITTED',
					targetClauseId: args.targetClauseId ?? undefined,
					targetOperativeIndex: args.targetOperativeIndex ?? undefined,
					newContent: args.newContent ?? undefined,
					targetPosition: args.targetPosition ?? undefined,
					documentNumber,
					sequenceNumber: typeSeq
				})
				.returning()
				.then(assertFirstEntryExists);

			// Auto-add proposer as first sponsor
			await db.insert(schema.amendmentSponsor).values({
				amendmentId: result.id,
				committeeMemberId: args.committeeMemberId
			});

			pubsub.created();
			paperPubsub.updated(args.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: result.id } }).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	adoptByConsensus: t.drizzleField({
		type: ref,
		args: {
			amendmentId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'SUBMITTED') {
				throw new GraphQLError('Only SUBMITTED amendments can be adopted by consensus');
			}

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: amendment.paperId } })
				.then(assertFindFirstExists);

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.amendment)
					.set({ status: 'CONSENSUS_ADOPTED' })
					.where(eq(schema.amendment.id, args.amendmentId));

				await applyAmendmentToResolution(tx, amendment, paper);
			});

			pubsub.updated(args.amendmentId);
			paperPubsub.updated(amendment.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.amendmentId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	acceptAmendment: t.drizzleField({
		type: ref,
		args: {
			amendmentId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'SUBMITTED') {
				throw new GraphQLError('Only SUBMITTED amendments can be accepted');
			}

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: amendment.paperId } })
				.then(assertFindFirstExists);

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.amendment)
					.set({ status: 'ACCEPTED' })
					.where(eq(schema.amendment.id, args.amendmentId));

				await applyAmendmentToResolution(tx, amendment, paper);
			});

			pubsub.updated(args.amendmentId);
			paperPubsub.updated(amendment.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.amendmentId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	rejectAmendment: t.drizzleField({
		type: ref,
		args: {
			amendmentId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'SUBMITTED') {
				throw new GraphQLError('Only SUBMITTED amendments can be rejected');
			}

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: amendment.paperId } })
				.then(assertFindFirstExists);

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			await db
				.update(schema.amendment)
				.set({ status: 'REJECTED' })
				.where(eq(schema.amendment.id, args.amendmentId));

			pubsub.updated(args.amendmentId);
			paperPubsub.updated(amendment.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.amendmentId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	withdrawAmendment: t.drizzleField({
		type: ref,
		args: {
			amendmentId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			ctx.mustBeLoggedIn();

			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'SUBMITTED') {
				throw new GraphQLError('Only SUBMITTED amendments can be withdrawn');
			}

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: amendment.paperId } })
				.then(assertFindFirstExists);

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			await db
				.update(schema.amendment)
				.set({ status: 'WITHDRAWN' })
				.where(eq(schema.amendment.id, args.amendmentId));

			pubsub.updated(args.amendmentId);
			paperPubsub.updated(amendment.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.amendmentId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	editAmendment: t.drizzleField({
		type: ref,
		args: {
			amendmentId: t.arg.id({ required: true }),
			targetClauseId: t.arg.string(),
			targetOperativeIndex: t.arg.int(),
			targetPosition: t.arg.int(),
			newContent: t.arg({ type: 'JSON' }),
			proposerCommitteeMemberId: t.arg.id()
		},
		resolve: async (query, root, args, ctx, info) => {
			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'SUBMITTED') {
				throw new GraphQLError('Only SUBMITTED amendments can be edited');
			}

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: amendment.paperId } })
				.then(assertFindFirstExists);

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			// Merge provided args with existing values
			const merged = {
				targetClauseId:
					args.targetClauseId !== undefined ? args.targetClauseId : amendment.targetClauseId,
				targetOperativeIndex:
					args.targetOperativeIndex !== undefined
						? args.targetOperativeIndex
						: amendment.targetOperativeIndex,
				targetPosition:
					args.targetPosition !== undefined ? args.targetPosition : amendment.targetPosition,
				newContent: args.newContent !== undefined ? args.newContent : amendment.newContent
			};

			// Re-validate with merged values
			validateAmendmentArgs(amendment.type, merged);

			// If targetClauseId is provided, resolve and auto-correct the operative index
			if (merged.targetClauseId) {
				const parsed = ResolutionSchema.safeParse(paper.content);
				if (parsed.success) {
					const actualIdx = parsed.data.operative.findIndex((c) => c.id === merged.targetClauseId);
					if (actualIdx === -1) {
						throw new GraphQLError('Target clause no longer exists in the resolution');
					}
					// Auto-correct stale index
					if (merged.targetOperativeIndex !== actualIdx) {
						merged.targetOperativeIndex = actualIdx;
						args.targetOperativeIndex = actualIdx;
					}
				}
			}

			// Validate newContent if provided
			if (args.newContent) {
				const parsedContent = OperativeClauseSchema.safeParse(args.newContent);
				if (!parsedContent.success) {
					throw new GraphQLError('Invalid newContent: ' + parsedContent.error.message);
				}
			}

			// Check if anything actually changed
			const updateFields: Record<string, unknown> = {};
			if (args.targetClauseId !== undefined && args.targetClauseId !== amendment.targetClauseId) {
				updateFields.targetClauseId = args.targetClauseId;
			}
			if (
				args.targetOperativeIndex !== undefined &&
				args.targetOperativeIndex !== amendment.targetOperativeIndex
			) {
				updateFields.targetOperativeIndex = args.targetOperativeIndex;
			}
			if (args.targetPosition !== undefined && args.targetPosition !== amendment.targetPosition) {
				updateFields.targetPosition = args.targetPosition;
			}
			if (args.newContent !== undefined) {
				updateFields.newContent = args.newContent;
			}

			const proposerChanged =
				args.proposerCommitteeMemberId !== undefined &&
				args.proposerCommitteeMemberId !== null &&
				args.proposerCommitteeMemberId !== amendment.proposerCommitteeMemberId;

			if (Object.keys(updateFields).length === 0 && !proposerChanged) {
				// Nothing changed
				return db.query.amendment
					.findFirst(
						query(
							ctx.abilities.amendment.filter('read').merge({ where: { id: args.amendmentId } })
								.query.single
						)
					)
					.then(assertFindFirstExists);
			}

			if (proposerChanged) {
				// Validate new proposer belongs to committee
				await db.query.committeeMember
					.findFirst({
						where: { id: args.proposerCommitteeMemberId!, committeeId: paper.committeeId }
					})
					.then(assertFindFirstExists);

				updateFields.proposerCommitteeMemberId = args.proposerCommitteeMemberId;
			}

			await db.transaction(async (tx) => {
				if (proposerChanged) {
					const oldProposerId = amendment.proposerCommitteeMemberId;
					const newProposerId = args.proposerCommitteeMemberId!;

					// Remove old proposer's sponsor entry
					await tx
						.delete(schema.amendmentSponsor)
						.where(
							and(
								eq(schema.amendmentSponsor.amendmentId, args.amendmentId),
								eq(schema.amendmentSponsor.committeeMemberId, oldProposerId)
							)
						);

					// Add new proposer as sponsor if not already one
					const existingSponsor = await tx.query.amendmentSponsor.findFirst({
						where: {
							amendmentId: args.amendmentId,
							committeeMemberId: newProposerId
						}
					});
					if (!existingSponsor) {
						await tx.insert(schema.amendmentSponsor).values({
							amendmentId: args.amendmentId,
							committeeMemberId: newProposerId
						});
					}
				}

				await tx
					.update(schema.amendment)
					.set(updateFields)
					.where(eq(schema.amendment.id, args.amendmentId));
			});

			pubsub.updated(args.amendmentId);
			paperPubsub.updated(amendment.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read').merge({ where: { id: args.amendmentId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
