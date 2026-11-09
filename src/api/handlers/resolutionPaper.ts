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
	isPaperAuthor,
	sessionUserId,
	linkedDelegator,
	SYNCED_CONFERENCE
} from '#api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { nanoid, nanoidValidation } from '#lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { readPaperJson } from '#api/yjs/server';
import { detachFromDelegator } from '#api/services/link/detach';
import { and, count, eq, inArray } from 'drizzle-orm';
import type { Resolution } from '@deutschemodelunitednations/munify-resolution-editor/schema';
import * as Y from 'yjs';
import { jsonToYDoc } from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import { assertChairsPaper, chairsPaper, type ResolverContext } from './helpers/paperAccess';
import {
	assertSubmittable,
	draftResolutionNumber,
	needsChairCheck,
	paperMetaUpdate
} from './helpers/paperRules';

function createInitialYjsState(): Buffer {
	const doc = new Y.Doc();
	jsonToYDoc(doc, { preamble: [], operative: [], committeeName: '' });
	return Buffer.from(Y.encodeStateAsUpdate(doc));
}

// The linked DELEGATOR takes the adopted resolutions of its conferences back
// (`docs/plans/delegator-link.md`).
abilityBuilder.resolutionPaper.allow('read').when(
	linkedDelegator({
		where: { status: 'FINAL' as const, committee: { conference: SYNCED_CONFERENCE } },
		columns: {
			id: true,
			committeeId: true,
			agendaItemId: true,
			status: true,
			title: true,
			documentNumber: true,
			voteVotingSessionId: true
		}
	})
);

abilityBuilder.resolutionPaper.allow('read').when((ctx) => {
	return { where: { committee: isTeamInConference(ctx) } };
});

abilityBuilder.resolutionPaper.allow('read').when((ctx) => {
	return { where: { ...isPaperAuthor(ctx) } };
});

abilityBuilder.resolutionPaper.allow('read').when((ctx) => {
	const userId = sessionUserId(ctx);
	if (!userId) return undefined;
	return {
		where: {
			sponsors: { committeeMember: { users: { user: { id: userId } } } }
		}
	};
});

abilityBuilder.resolutionPaper.allow('read').when((ctx) => {
	return {
		where: {
			OR: [
				{ status: 'SUBMITTED' as const, committee: isParticipantInConference(ctx) },
				{ status: 'DRAFT_RESOLUTION' as const, committee: isParticipantInConference(ctx) },
				{ status: 'AMENDMENT_PHASE' as const, committee: isParticipantInConference(ctx) },
				{ status: 'VOTING_PHASE' as const, committee: isParticipantInConference(ctx) },
				{ status: 'FINAL' as const, committee: isParticipantInConference(ctx) }
			]
		}
	};
});

abilityBuilder.resolutionPaper.allow('delete').when((ctx) => {
	return {
		where: {
			committee: isTeamInConference(ctx)
		}
	};
});

abilityBuilder.resolutionPaper.allow('update').when((ctx) => {
	return {
		where: {
			OR: [
				{ committee: isTeamInConference(ctx) },
				{ status: 'WORKING_PAPER' as const, ...isPaperAuthor(ctx) }
			]
		}
	};
});

const ref = object({ table: 'resolutionPaper' });

const statusEnum = enum_({ tsName: 'paperStatus' });

const pubsub = rumblePubsub({ table: 'resolutionPaper' });
const snapshotPubsub = rumblePubsub({ table: 'paperContentSnapshot' });

query({ table: 'resolutionPaper' });

type PaperStatus = typeof schema.resolutionPaper.$inferSelect.status;

/** The paper as the caller may read it, for a resolver to hand back. */
async function readablePaper(ctx: ResolverContext, id: string) {
	return (await ctx.abilities.resolutionPaper.filter('read')).merge({ where: { id } }).query.single;
}

/** The caller's ability to update the paper, as a filter. */
async function paperUpdateFilter(ctx: ResolverContext, id: string) {
	return (await ctx.abilities.resolutionPaper.filter('update')).merge({ where: { id } });
}

type PaperUpdateFilter = Awaited<ReturnType<typeof paperUpdateFilter>>;

interface PaperCreator {
	creatorCommitteeMemberId: string;
	status: PaperStatus;
	editorConferenceUserIds: string[];
}

/** A chair creates a paper for the committee member they name, submitted unless they say else. */
async function chairCreator(args: {
	committeeId: string;
	creatorCommitteeMemberId?: string | null;
	status?: PaperStatus | null;
}): Promise<PaperCreator> {
	if (!args.creatorCommitteeMemberId) {
		throw new GraphQLError('creatorCommitteeMemberId is required when creating as chair');
	}
	const creator = await db.query.committeeMember
		.findFirst({
			where: { id: args.creatorCommitteeMemberId, committeeId: args.committeeId },
			with: { users: true }
		})
		.then(assertFindFirstExists);
	return {
		creatorCommitteeMemberId: creator.id,
		status: args.status ?? 'SUBMITTED',
		editorConferenceUserIds: creator.users.map((u) => u.id)
	};
}

/** A committee member creates a working paper of their own. */
async function memberCreator({
	ctx,
	committeeId
}: {
	ctx: ResolverContext;
	committeeId: string;
}): Promise<PaperCreator> {
	const user = ctx.mustBeLoggedIn();
	if (!user.email) throw new GraphQLError('User email is required');

	const conferenceUser = await db.query.conferenceUser
		.findFirst({
			where: { userEmail: user.email, committeeMember: { committeeId } },
			with: { committeeMember: true }
		})
		.then(assertFindFirstExists);

	if (!conferenceUser.committeeMember) {
		throw new GraphQLError('You are not assigned as a committee member');
	}
	return {
		creatorCommitteeMemberId: conferenceUser.committeeMember.id,
		status: 'WORKING_PAPER',
		editorConferenceUserIds: [conferenceUser.id]
	};
}

/** Only the paper's creator or a chair may submit it. */
async function assertMaySubmit({ ctx, paperId }: { ctx: ResolverContext; paperId: string }) {
	if (await chairsPaper({ ctx, paperId })) return;
	const submitter = ctx.mustBeLoggedIn();
	const isCreator = !!(await db.query.resolutionPaper.findFirst({
		where: { id: paperId, creatorCommitteeMember: { users: { user: { id: submitter.sub } } } },
		columns: { id: true }
	}));
	if (!isCreator) {
		throw new GraphQLError('Only the paper creator or a chair may submit this paper');
	}
}

/**
 * Submits a working paper, with a snapshot of its text, once it has a sponsor and content. A
 * paper at a later stage just goes back to SUBMITTED (chairs only, which the ability enforces).
 */
async function submitPaper({
	ctx,
	paperId,
	updateFilter
}: {
	ctx: ResolverContext;
	paperId: string;
	updateFilter: PaperUpdateFilter;
}) {
	const paper = await db.query.resolutionPaper
		.findFirst(updateFilter.query.single)
		.then(assertFindFirstExists);

	if (paper.status !== 'WORKING_PAPER') {
		await db
			.update(schema.resolutionPaper)
			.set({ status: 'SUBMITTED' })
			.where(updateFilter.sql.where);
		return;
	}

	await assertMaySubmit({ ctx, paperId });

	const sponsors = await db.query.paperSponsor.findMany({ where: { paperId } });
	if (sponsors.length === 0) {
		throw new GraphQLError('Paper needs at least one sponsor to submit');
	}

	const content = await readPaperJson(paperId);
	assertSubmittable(JSON.parse(content) as Resolution);

	await db.transaction(async (tx) => {
		await tx.insert(schema.paperContentSnapshot).values({
			id: nanoid(),
			paperId,
			content,
			trigger: 'SUBMITTED'
		});
		await tx
			.update(schema.resolutionPaper)
			.set({ status: 'SUBMITTED' })
			.where(updateFilter.sql.where);
	});
}

/** The document number a paper gets as a draft resolution. */
async function nextDraftNumber(paper: { committeeId: string; agendaItemId: string }) {
	const committee = await db.query.committee
		.findFirst({ where: { id: paper.committeeId } })
		.then(assertFindFirstExists);
	const agendaItems = await db.query.agendaItem.findMany({
		where: { committeeId: paper.committeeId }
	});
	const existing = await db
		.select({ n: count() })
		.from(schema.resolutionPaper)
		.where(
			and(
				eq(schema.resolutionPaper.agendaItemId, paper.agendaItemId),
				inArray(schema.resolutionPaper.status, [
					'DRAFT_RESOLUTION',
					'AMENDMENT_PHASE',
					'VOTING_PHASE',
					'FINAL'
				])
			)
		)
		.then(assertFirstEntryExists);
	return draftResolutionNumber({
		committeeAbbreviation: committee.abbreviation,
		agendaItemIds: agendaItems.map((ai) => ai.id),
		agendaItemId: paper.agendaItemId,
		existingDrafts: existing.n
	});
}

/** Promotes a paper to draft resolution, numbering it unless it has a number already. */
async function promoteToDraft(updateFilter: PaperUpdateFilter) {
	const paper = await db.query.resolutionPaper
		.findFirst(updateFilter.query.single)
		.then(assertFindFirstExists);
	const documentNumber = paper.documentNumber ? undefined : await nextDraftNumber(paper);
	await db
		.update(schema.resolutionPaper)
		.set({ status: 'DRAFT_RESOLUTION', ...(documentNumber ? { documentNumber } : {}) })
		.where(updateFilter.sql.where);
}

/** Sets any later status; adopting with confetti marks the committee's adoption date. */
async function setChairStatus({
	paperId,
	status,
	deployConfetti,
	updateFilter
}: {
	paperId: string;
	status: PaperStatus;
	deployConfetti: boolean | null | undefined;
	updateFilter: PaperUpdateFilter;
}) {
	await db.update(schema.resolutionPaper).set({ status }).where(updateFilter.sql.where);
	if (status !== 'FINAL' || !deployConfetti) return;
	const paper = await db.query.resolutionPaper
		.findFirst({ where: { id: paperId }, columns: { committeeId: true } })
		.then(assertFindFirstExists);
	await db
		.update(schema.committee)
		.set({ lastResolutionAdoptionDate: new Date() })
		.where(eq(schema.committee.id, paper.committeeId));
}

function assertChair(isChair: boolean, message: string) {
	if (!isChair) throw new GraphQLError(message);
}

/** The status change an update asks for, each with its own flow. */
async function changeStatus({
	ctx,
	args,
	isChair,
	updateFilter
}: {
	ctx: ResolverContext;
	args: { id: string; status?: PaperStatus | null; deployConfetti?: boolean | null };
	isChair: boolean;
	updateFilter: PaperUpdateFilter;
}) {
	const { status } = args;
	if (status == null) return;
	if (status === 'SUBMITTED') {
		await submitPaper({ ctx, paperId: args.id, updateFilter });
	} else if (status === 'DRAFT_RESOLUTION') {
		assertChair(isChair, 'Only chairs may promote a paper to draft resolution');
		await promoteToDraft(updateFilter);
	} else {
		assertChair(isChair, 'Only chairs may change the paper status');
		await setChairStatus({
			paperId: args.id,
			status,
			deployConfetti: args.deployConfetti,
			updateFilter
		});
	}
}

/**
 * Adopts the paper by the vote: FINAL, with a snapshot of the adopted text, and the committee's
 * adoption date. Only chairs may conclude a vote.
 */
async function concludeVote({
	ctx,
	paperId,
	votingSessionId
}: {
	ctx: ResolverContext;
	paperId: string;
	votingSessionId: string;
}) {
	await assertChairsPaper({ ctx, paperId });

	const content = await readPaperJson(paperId);
	const paperForCommittee = await db.query.resolutionPaper
		.findFirst({ where: { id: paperId }, columns: { committeeId: true } })
		.then(assertFindFirstExists);
	await db.transaction(async (tx) => {
		await tx
			.update(schema.resolutionPaper)
			.set({ status: 'FINAL', voteVotingSessionId: votingSessionId })
			.where((await paperUpdateFilter(ctx, paperId)).sql.where);
		await tx.insert(schema.paperContentSnapshot).values({
			id: nanoid(),
			paperId,
			content,
			trigger: 'VOTE_CONCLUDED'
		});
		await tx
			.update(schema.committee)
			.set({ lastResolutionAdoptionDate: new Date() })
			.where(eq(schema.committee.id, paperForCommittee.committeeId));
	});
}

schemaBuilder.mutationFields((t) => ({
	createResolutionPaper: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			committeeId: t.arg.id({ required: true }),
			agendaItemId: t.arg.id({ required: true }),
			// Chairs must specify the creator; for committee-member callers this
			// arg is ignored and the caller's own committeeMember is used.
			creatorCommitteeMemberId: t.arg.id(),
			// Only honored on the chair path. Committee members always create
			// papers in WORKING_PAPER.
			status: t.arg({ type: statusEnum }),
			title: t.arg.string()
		},
		resolve: async (query, _root, args, ctx) => {
			const chair = !!(await db.query.committee.findFirst({
				where: { id: args.committeeId, ...isTeamInConference(ctx) }
			}));
			const { creatorCommitteeMemberId, status, editorConferenceUserIds } = chair
				? await chairCreator(args)
				: await memberCreator({ ctx, committeeId: args.committeeId });

			await db.transaction(async (tx) => {
				await tx.insert(schema.resolutionPaper).values({
					id: args.id,
					committeeId: args.committeeId,
					agendaItemId: args.agendaItemId,
					creatorCommitteeMemberId,
					status,
					title: args.title ?? null
				});
				await tx.insert(schema.paperSponsor).values({
					paperId: args.id,
					committeeMemberId: creatorCommitteeMemberId
				});
				for (const cuId of editorConferenceUserIds) {
					await tx.insert(schema.paperEditor).values({
						paperId: args.id,
						conferenceUserId: cuId
					});
				}
				// Pre-initialize the Y.Doc with empty preamble/operative arrays so
				// delegates can immediately add clauses without the store's operativeArr()
				// returning null for a fresh document.
				await tx.insert(schema.paperYjsDoc).values({
					paperId: args.id,
					state: createInitialYjsState()
				});
			});

			pubsub.created();

			return db.query.resolutionPaper
				.findFirst(query(await readablePaper(ctx, args.id)))
				.then(assertFindFirstExists);
		}
	}),
	updateResolutionPaper: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id({ required: true }),
			title: t.arg.string(),
			status: t.arg({ type: statusEnum }),
			documentNumber: t.arg.string(),
			deployConfetti: t.arg.boolean()
		},
		resolve: async (query, _root, args, ctx) => {
			const updateFilter = await paperUpdateFilter(ctx, args.id);

			const isChair = needsChairCheck(args) && (await chairsPaper({ ctx, paperId: args.id }));
			if (args.documentNumber != null) {
				assertChair(isChair, 'Only chairs may set the document number');
			}

			// Persist plain metadata first, so it is set before any submission flow
			const metaUpdate = paperMetaUpdate(args);
			if (metaUpdate) {
				await db.update(schema.resolutionPaper).set(metaUpdate).where(updateFilter.sql.where);
			}
			// any change here makes a draft taken over from DELEGATOR CHASE's own
			const mayUpdate = await db.query.resolutionPaper.findFirst({
				...updateFilter.query.single,
				columns: { id: true }
			});
			if (mayUpdate) await detachFromDelegator(args.id);

			await changeStatus({ ctx, args, isChair, updateFilter });

			pubsub.updated(args.id);

			return db.query.resolutionPaper
				.findFirst(query(await readablePaper(ctx, args.id)))
				.then(assertFindFirstExists);
		}
	}),

	deleteResolutionPaper: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			await db
				.delete(schema.resolutionPaper)
				.where(
					(await ctx.abilities.resolutionPaper.filter('delete')).merge({ where: { id: args.id } })
						.sql.where
				);
			pubsub.removed();
			// the paper's snapshots went with it
			snapshotPubsub.removed();
			return true;
		}
	}),

	concludeResolutionPaperVote: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			votingSessionId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			await concludeVote({ ctx, ...args });

			pubsub.updated(args.paperId);
			snapshotPubsub.created();

			return db.query.resolutionPaper
				.findFirst(query(await readablePaper(ctx, args.paperId)))
				.then(assertFindFirstExists);
		}
	})
}));
