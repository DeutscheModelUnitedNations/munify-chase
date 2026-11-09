import { db, schema } from '#api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	pubsub as rumblePubsub,
	schemaBuilder
} from '#api/rumble';
import {
	isParticipantInConference,
	isTeamInConference,
	committeeMemberForPaper,
	isAmendmentProposer
} from '#api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, nanoidValidation } from '#lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { and, count, eq } from 'drizzle-orm';
import { applyServerMutation, readPaperJson } from '#api/yjs/server';
import {
	yDocToJson,
	replaceResolution
} from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import { paperWithAbility, type ResolverContext } from './helpers/paperAccess';
import { acceptedStatus, amendmentTargets, applyAmendment } from './helpers/amendmentRules';
import { requiredSponsors } from './helpers/paperRules';

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
const reviewItemPubsub = rumblePubsub({ table: 'amendmentReviewItem' });

const typeEnum = enum_({ tsName: 'amendmentType' });
const statusEnum = enum_({ tsName: 'amendmentStatus' });

type AmendmentRow = typeof schema.amendment.$inferSelect;

/** The amendment as the caller may read it, for a resolver to hand back. */
async function readableAmendment(ctx: ResolverContext, id: string) {
	return (await ctx.abilities.amendment.filter('read')).merge({ where: { id } }).query.single;
}

/** Sets the status as far as the caller may update the amendment. */
async function setStatus({
	ctx,
	id,
	status
}: {
	ctx: ResolverContext;
	id: string;
	status: AmendmentRow['status'];
}) {
	await db
		.update(schema.amendment)
		.set({ status })
		.where((await ctx.abilities.amendment.filter('update')).merge({ where: { id } }).sql.where);
	pubsub.updated(id);
}

/** The proposer and status of a new amendment: the chair names them, a member is the proposer. */
async function newAmendmentProposal({
	ctx,
	args
}: {
	ctx: ResolverContext;
	args: {
		paperId: string;
		proposerCommitteeMemberId?: string | null;
		status?: AmendmentRow['status'] | null;
	};
}): Promise<{ proposerCommitteeMemberId: string; status: AmendmentRow['status'] }> {
	const isChair = await db.query.resolutionPaper.findFirst({
		where: { id: args.paperId, committee: isTeamInConference(ctx) }
	});
	if (isChair) {
		if (!args.proposerCommitteeMemberId) {
			throw new GraphQLError('proposerCommitteeMemberId is required when creating as chair');
		}
		return {
			proposerCommitteeMemberId: args.proposerCommitteeMemberId,
			status: args.status ?? 'SUBMITTED'
		};
	}
	const cu = await db.query.conferenceUser
		.findFirst({
			where: committeeMemberForPaper(ctx, args.paperId, { amendmentSubmissionOpen: true }),
			with: { committeeMember: true }
		})
		.then(assertFindFirstExists);
	return { proposerCommitteeMemberId: cu.committeeMember!.id, status: 'PENDING' };
}

/** Refuses to submit an amendment without enough sponsors for its committee. */
async function assertEnoughSponsors({ id, committeeId }: { id: string; committeeId: string }) {
	const sponsors = await db.query.amendmentSponsor.findMany({ where: { amendmentId: id } });
	const committee = await db.query.committee
		.findFirst({ where: { id: committeeId } })
		.then(assertFindFirstExists);
	const presentDelegations = await db
		.select({ count: count() })
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
		.then(([r]) => r?.count ?? 0);
	const required = requiredSponsors({
		presentDelegations,
		thresholdPercent: committee.paperSupportThreshold
	});
	if (sponsors.length < required) {
		throw new GraphQLError(
			`Amendment needs at least ${required} sponsor(s) to be submitted (has ${sponsors.length})`
		);
	}
}

/**
 * Applies the amendment to the paper's Y.Doc and answers the replaced clause's old content. The
 * yjs layer has its own persistence, so this cannot share the DB transaction.
 */
async function applyToPaper(amendment: AmendmentRow) {
	let oldContent: string | null = null;
	await applyServerMutation(amendment.paperId, (doc) => {
		const applied = applyAmendment(yDocToJson(doc), amendment);
		oldContent = applied.oldContent;
		if (applied.next) replaceResolution(doc, applied.next);
	});
	return oldContent;
}

/**
 * For ALTER_TEXT: the remaining SUBMITTED ALTER_TEXT amendments on the same clause get
 * OBSOLESCENCE-phase review items, so the chair can assess which are now obsolete or need
 * rewording.
 * TODO: also check amendments targeting later clauses — disabled for now.
 */
async function reviewSiblingsOf(amendment: AmendmentRow) {
	if (amendment.type !== 'ALTER_TEXT' || !amendment.targetClauseId) return;
	const siblings = await db
		.select({ id: schema.amendment.id })
		.from(schema.amendment)
		.where(
			and(
				eq(schema.amendment.paperId, amendment.paperId),
				eq(schema.amendment.status, 'SUBMITTED'),
				eq(schema.amendment.type, 'ALTER_TEXT'),
				eq(schema.amendment.targetClauseId, amendment.targetClauseId)
			)
		);
	if (siblings.length === 0) return;
	await db.insert(schema.amendmentReviewItem).values(
		siblings.map((s) => ({
			id: nanoid(),
			paperId: amendment.paperId,
			triggerAmendmentId: amendment.id,
			subjectAmendmentId: s.id,
			phase: 'OBSOLESCENCE' as const
		}))
	);
	reviewItemPubsub.created();
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
			const { proposerCommitteeMemberId, status } = await newAmendmentProposal({ ctx, args });

			await db.transaction(async (tx) => {
				await tx.insert(schema.amendment).values({
					id: args.id,
					paperId: args.paperId,
					proposerCommitteeMemberId,
					type: args.type,
					status,
					...amendmentTargets(args)
				});
				await tx.insert(schema.amendmentSponsor).values({
					id: nanoid(),
					amendmentId: args.id,
					committeeMemberId: proposerCommitteeMemberId
				});
			});

			pubsub.created();

			return db.query.amendment
				.findFirst(query(await readableAmendment(ctx, args.id)))
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
			await assertEnoughSponsors({ id: args.id, committeeId: amendment.paper.committeeId });

			await setStatus({ ctx, id: args.id, status: 'SUBMITTED' });
			return db.query.amendment
				.findFirst(query(await readableAmendment(ctx, args.id)))
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
				.findFirst(await readableAmendment(ctx, args.id))
				.then(assertFindFirstExists);

			// Accepting an amendment modifies the paper, not the amendment as such.
			// Gate accordingly on the caller's ability to update the paper.
			await paperWithAbility({ ctx, paperId: amendment.paperId, action: 'update' });

			// Before the status flip, so the amendment is only marked accepted if the paper
			// change actually landed.
			const oldContent = await applyToPaper(amendment);
			const content = await readPaperJson(amendment.paperId);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.amendment)
					.set({ status: acceptedStatus(args.consensus), ...(oldContent ? { oldContent } : {}) })
					.where(eq(schema.amendment.id, args.id));
				await tx.insert(schema.paperContentSnapshot).values({
					paperId: amendment.paperId,
					content,
					trigger: 'AMENDMENT_APPLIED'
				});
			});

			await reviewSiblingsOf(amendment);

			snapshotPubsub.created();
			pubsub.updated(args.id);

			return db.query.amendment
				.findFirst(query(await readableAmendment(ctx, args.id)))
				.then(assertFindFirstExists);
		}
	}),

	rejectAmendment: t.drizzleField({
		type: ref,
		args: { id: t.arg.id({ required: true }) },
		resolve: async (query, _root, args, ctx) => {
			await setStatus({ ctx, id: args.id, status: 'REJECTED' });
			return db.query.amendment
				.findFirst(query(await readableAmendment(ctx, args.id)))
				.then(assertFindFirstExists);
		}
	}),

	deleteAmendment: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			const [existing] = await db
				.select({ id: schema.amendment.id, status: schema.amendment.status })
				.from(schema.amendment)
				.where(
					(await ctx.abilities.amendment.filter('delete')).merge({ where: { id: args.id } }).sql
						.where
				);
			if (!existing) throw new GraphQLError('Amendment not found or not authorized');

			if (existing.status === 'PENDING') {
				// Hard delete is safe for drafts — they have never been formally submitted
				// and carry no training-data value yet.
				await db.delete(schema.amendment).where(eq(schema.amendment.id, existing.id));
				pubsub.removed();
			} else {
				// SUBMITTED and beyond: soft-delete to preserve training data and avoid
				// orphaning any in-progress amendmentReviewItem rows.
				await db
					.update(schema.amendment)
					.set({ status: 'WITHDRAWN' })
					.where(eq(schema.amendment.id, existing.id));
				pubsub.updated(existing.id);
			}
			return true;
		}
	})
}));
