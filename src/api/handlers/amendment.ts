import { db, schema } from '$api/db/db';
import { abilityBuilder, enum_, schemaBuilder, pubsub as rumblePubsub } from '$api/rumble';
import { basics } from './basics';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { and, eq, count as drizzleCount } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { assertCommitteeChairOrAdmin } from './resolutionPaper';
import {
	ResolutionSchema,
	OperativeClauseSchema
} from '@deutschemodelunitednations/munify-resolution-editor/schema';

const { arg, ref, pubsub, table } = basics('amendment');
const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });

const amendmentTypeEnum = enum_({ tsName: 'amendmentType' });
const amendmentStatusEnum = enum_({ tsName: 'amendmentStatus' });

abilityBuilder.amendment.allow('read').when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

abilityBuilder.amendment.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

// =============================================================================
// HELPERS
// =============================================================================

async function getPresentDelegationCount(committeeId: string): Promise<number> {
	const result = await db
		.select({ count: drizzleCount() })
		.from(schema.committeeMember)
		.innerJoin(
			schema.representation,
			eq(schema.committeeMember.representationId, schema.representation.id)
		)
		.where(
			and(
				eq(schema.committeeMember.committeeId, committeeId),
				eq(schema.committeeMember.present, true),
				eq(schema.representation.type, 'DELEGATION')
			)
		)
		.then(assertFirstEntryExists);
	return result.count;
}

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
			const idx = amendment.targetOperativeIndex!;
			if (idx < 0 || idx >= resolution.operative.length) {
				throw new GraphQLError('Target operative index out of range');
			}
			if (resolution.operative[idx].id !== amendment.targetClauseId) {
				throw new GraphQLError('Clause ID mismatch at target index');
			}
			resolution.operative.splice(idx, 1);
			break;
		}
		case 'ADD': {
			const parsedClause = OperativeClauseSchema.safeParse(amendment.newContent);
			if (!parsedClause.success) {
				throw new GraphQLError('Invalid newContent for ADD amendment');
			}
			const insertAfter = amendment.targetPosition!;
			resolution.operative.splice(insertAfter + 1, 0, parsedClause.data);
			break;
		}
		case 'ALTER_TEXT': {
			const idx = amendment.targetOperativeIndex!;
			if (idx < 0 || idx >= resolution.operative.length) {
				throw new GraphQLError('Target operative index out of range');
			}
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
			const sourceIdx = amendment.targetOperativeIndex!;
			const destIdx = amendment.targetPosition!;
			if (sourceIdx < 0 || sourceIdx >= resolution.operative.length) {
				throw new GraphQLError('Source operative index out of range');
			}
			if (destIdx < 0 || destIdx > resolution.operative.length) {
				throw new GraphQLError('Destination index out of range');
			}
			const [clause] = resolution.operative.splice(sourceIdx, 1);
			// After removing from source, the target index might shift
			const adjustedDest = destIdx > sourceIdx ? destIdx - 1 : destIdx;
			resolution.operative.splice(adjustedDest, 0, clause);
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

			// Validate clauseId exists if provided
			if (
				args.targetClauseId &&
				args.targetOperativeIndex !== undefined &&
				args.targetOperativeIndex !== null
			) {
				const parsed = ResolutionSchema.safeParse(paper.content);
				if (parsed.success) {
					const clause = parsed.data.operative[args.targetOperativeIndex];
					if (!clause || clause.id !== args.targetClauseId) {
						throw new GraphQLError('Clause ID does not match at the given index');
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
					status: 'PENDING',
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

			pubsub.updated(result.id);
			paperPubsub.updated(args.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read', {
							inject: { where: { id: result.id } }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	submitAmendment: t.drizzleField({
		type: ref,
		args: {
			amendmentId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'PENDING') {
				throw new GraphQLError('Only PENDING amendments can be submitted');
			}

			// Only proposer can submit
			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						committeeMemberId: amendment.proposerCommitteeMemberId
					}
				})
				.then(assertFindFirstExists);

			// Check sponsor threshold
			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: amendment.paperId } })
				.then(assertFindFirstExists);

			// Verify paragraph not passed
			const committee = await db.query.committee
				.findFirst({ where: { id: paper.committeeId } })
				.then(assertFindFirstExists);

			if (
				(amendment.type === 'DELETE' || amendment.type === 'ALTER_TEXT') &&
				committee.currentOperativeIndex !== null &&
				amendment.targetOperativeIndex !== null &&
				amendment.targetOperativeIndex < committee.currentOperativeIndex
			) {
				throw new GraphQLError('Cannot submit amendment for a clause that has already been passed');
			}

			const presentCount = await getPresentDelegationCount(paper.committeeId);
			const threshold = Math.ceil(presentCount * 0.1);

			const sponsorResult = await db
				.select({ count: drizzleCount() })
				.from(schema.amendmentSponsor)
				.where(eq(schema.amendmentSponsor.amendmentId, args.amendmentId))
				.then(assertFirstEntryExists);

			if (sponsorResult.count < threshold) {
				throw new GraphQLError(`Not enough sponsors: ${sponsorResult.count}/${threshold} required`);
			}

			await db
				.update(schema.amendment)
				.set({ status: 'SUBMITTED' })
				.where(eq(schema.amendment.id, args.amendmentId));

			pubsub.updated(args.amendmentId);
			paperPubsub.updated(amendment.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read', {
							inject: { where: { id: args.amendmentId } }
						}).query.single
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
						ctx.abilities.amendment.filter('read', {
							inject: { where: { id: args.amendmentId } }
						}).query.single
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
						ctx.abilities.amendment.filter('read', {
							inject: { where: { id: args.amendmentId } }
						}).query.single
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
						ctx.abilities.amendment.filter('read', {
							inject: { where: { id: args.amendmentId } }
						}).query.single
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
			const user = ctx.mustBeLoggedIn();

			const amendment = await db.query.amendment
				.findFirst({ where: { id: args.amendmentId } })
				.then(assertFindFirstExists);

			if (amendment.status !== 'PENDING' && amendment.status !== 'SUBMITTED') {
				throw new GraphQLError('Only PENDING or SUBMITTED amendments can be withdrawn');
			}

			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: amendment.paperId } })
				.then(assertFindFirstExists);

			// Either proposer or chair can withdraw
			const isProposer = await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					committeeMemberId: amendment.proposerCommitteeMemberId
				}
			});

			if (!isProposer) {
				// Must be chair/admin
				await assertCommitteeChairOrAdmin(ctx, paper.committeeId);
			}

			await db
				.update(schema.amendment)
				.set({ status: 'WITHDRAWN' })
				.where(eq(schema.amendment.id, args.amendmentId));

			pubsub.updated(args.amendmentId);
			paperPubsub.updated(amendment.paperId);

			return db.query.amendment
				.findFirst(
					query(
						ctx.abilities.amendment.filter('read', {
							inject: { where: { id: args.amendmentId } }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
