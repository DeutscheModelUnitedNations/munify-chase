import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '$api/rumble';
import { and, eq, isNull, count as drizzleCount, inArray } from 'drizzle-orm';
import { isChairInConference, isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import {
	ResolutionSchema,
	createEmptyResolution,
	toRoman
} from '@deutschemodelunitednations/munify-resolution-editor/schema';
import {
	replaceResolution,
	yDocToJson
} from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import { applyServerMutation, readPaperJson } from '$api/yjs/server';

abilityBuilder.resolutionPaper.allow(['read', 'update']).when((ctx) => {
	if (isGlobalAdmin(ctx)) {
		return { where: { deletedAt: { isNull: true } } };
	}
});

abilityBuilder.resolutionPaper.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return { where: { deletedAt: { isNull: true } } };
});

abilityBuilder.resolutionPaper.allow(['update']).when((ctx) => {
	return {
		where: {
			deletedAt: { isNull: true },
			committee: {
				...isChairInConference(ctx)
			}
		}
	};
});

const ref = object({ table: 'resolutionPaper' });

const pubsub = rumblePubsub({ table: 'resolutionPaper' });
const committeePubsub = rumblePubsub({ table: 'committee' });
const voteResultPubsub = rumblePubsub({ table: 'resolutionVoteResult' });
const clauseVotePubsub = rumblePubsub({ table: 'operativeClauseVote' });
query({ table: 'resolutionPaper' });

schemaBuilder.mutationFields((t) => ({
	createResolutionPaper: t.drizzleField({
		type: ref,
		args: {
			committeeId: t.arg.id({ required: true }),
			agendaItemId: t.arg.id({ required: true }),
			title: t.arg.string()
		},
		resolve: async (query, root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			// Must be a DELEGATE with a committeeMember in this committee
			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						conferenceUserType: 'DELEGATE',
						committeeMember: {
							committeeId: args.committeeId
						}
					}
				})
				.then(assertFindFirstExists);

			if (!conferenceUser.committeeMemberId) {
				throw new GraphQLError('You must be assigned to a committee member');
			}

			// Get committee name for the empty resolution
			const committee = await db.query.committee
				.findFirst({
					where: { id: args.committeeId }
				})
				.then(assertFindFirstExists);

			const result = await db
				.insert(schema.resolutionPaper)
				.values({
					committeeId: args.committeeId,
					agendaItemId: args.agendaItemId,
					creatorCommitteeMemberId: conferenceUser.committeeMemberId,
					title: args.title ?? undefined,
					content: createEmptyResolution(committee.name)
				})
				.returning()
				.then(assertFirstEntryExists);

			// Auto-add creator as sponsor
			await db.insert(schema.paperSponsor).values({
				paperId: result.id,
				committeeMemberId: conferenceUser.committeeMemberId
			});

			// Auto-add creator as editor
			await db.insert(schema.paperEditor).values({
				paperId: result.id,
				conferenceUserId: conferenceUser.id
			});

			pubsub.created();

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	chairCreateResolutionPaper: t.drizzleField({
		type: ref,
		args: {
			committeeId: t.arg.id({ required: true }),
			agendaItemId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id({ required: true }),
			title: t.arg.string()
		},
		resolve: async (query, root, args, ctx) => {
			// Validate committeeMemberId belongs to this committee
			await db.query.committeeMember
				.findFirst({
					where: { id: args.committeeMemberId, committeeId: args.committeeId }
				})
				.then(assertFindFirstExists);

			// Fetch committee and verify chair/admin access in one query
			const committee = await db.query.committee
				.findFirst(
					ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).query
						.single
				)
				.then(assertFindFirstExists);

			const content = createEmptyResolution(committee.name);

			const result = await db.transaction(async (tx) => {
				const paper = await tx
					.insert(schema.resolutionPaper)
					.values({
						committeeId: args.committeeId,
						agendaItemId: args.agendaItemId,
						creatorCommitteeMemberId: args.committeeMemberId,
						title: args.title ?? undefined,
						content,
						status: 'SUBMITTED'
					})
					.returning()
					.then(assertFirstEntryExists);

				// Auto-add creator as sponsor
				await tx.insert(schema.paperSponsor).values({
					paperId: paper.id,
					committeeMemberId: args.committeeMemberId
				});

				// Auto-add creator as editor (find their conferenceUser)
				const conferenceUser = await tx.query.conferenceUser.findFirst({
					where: { committeeMemberId: args.committeeMemberId }
				});

				if (conferenceUser) {
					await tx.insert(schema.paperEditor).values({
						paperId: paper.id,
						conferenceUserId: conferenceUser.id
					});
				}

				// Create content snapshot for submission
				await tx.insert(schema.paperContentSnapshot).values({
					paperId: paper.id,
					content,
					trigger: 'SUBMITTED'
				});

				return paper;
			});

			pubsub.created();

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	updatePaperTitle: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			title: t.arg.string({ required: true })
		},
		resolve: async (query, root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			if (paper.status !== 'WORKING_PAPER') {
				throw new GraphQLError('Title can only be changed for working papers');
			}

			// Must be creator or editor
			const isEditor = await db.query.paperEditor.findFirst({
				where: {
					paperId: args.paperId,
					conferenceUser: { user: { id: user.sub } }
				}
			});

			if (!isEditor && !ctx.hasRole('admin')) {
				throw new GraphQLError('You do not have permission to edit this paper');
			}

			await db
				.update(schema.resolutionPaper)
				.set({ title: args.title })
				.where(eq(schema.resolutionPaper.id, args.paperId));

			pubsub.updated(args.paperId);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({
							where: { id: args.paperId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	submitPaper: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			if (paper.status !== 'WORKING_PAPER') {
				throw new GraphQLError('Only working papers can be submitted');
			}

			// Only creator can submit
			await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						committeeMemberId: paper.creatorCommitteeMemberId
					}
				})
				.then(assertFindFirstExists);

			// Materialise the latest Y.Doc state so the snapshot is current.
			const freshContent = await readPaperJson(args.paperId);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.resolutionPaper)
					.set({ status: 'SUBMITTED' })
					.where(eq(schema.resolutionPaper.id, args.paperId));

				await tx.insert(schema.paperContentSnapshot).values({
					paperId: args.paperId,
					content: freshContent ?? paper.content,
					trigger: 'SUBMITTED'
				});
			});

			pubsub.updated(args.paperId);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({
							where: { id: args.paperId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	promoteToDraftResolution: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx) => {
			const paper = await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			if (paper.status !== 'SUBMITTED') {
				throw new GraphQLError('Only submitted papers can be promoted to draft resolutions');
			}

			const committee = await db.query.committee
				.findFirst({
					where: { id: paper.committeeId }
				})
				.then(assertFindFirstExists);

			// Get agenda item position for numbering
			const agendaItems = await db.query.agendaItem.findMany({
				where: { committeeId: paper.committeeId }
			});
			const agendaItemIndex = agendaItems.findIndex((ai) => ai.id === paper.agendaItemId);
			const agendaPosition = agendaItemIndex >= 0 ? agendaItemIndex + 1 : 1;

			// Count existing DRs for this agenda item for sequence number
			const existingDRsForItem = await db
				.select({ count: drizzleCount() })
				.from(schema.resolutionPaper)
				.where(
					and(
						eq(schema.resolutionPaper.agendaItemId, paper.agendaItemId),
						eq(schema.resolutionPaper.status, 'DRAFT_RESOLUTION'),
						isNull(schema.resolutionPaper.deletedAt)
					)
				)
				.then(assertFirstEntryExists);

			const sequenceNumber = existingDRsForItem.count + 1;
			const documentNumber = `${committee.abbreviation}/${toRoman(agendaPosition)}/DR.${sequenceNumber}`;

			const freshContent = await readPaperJson(args.paperId);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.resolutionPaper)
					.set({
						status: 'DRAFT_RESOLUTION',
						documentNumber,
						sequenceNumber
					})
					.where(eq(schema.resolutionPaper.id, args.paperId));

				await tx.insert(schema.paperContentSnapshot).values({
					paperId: args.paperId,
					content: freshContent ?? paper.content,
					trigger: 'DRAFT_RESOLUTION'
				});
			});

			pubsub.updated(args.paperId);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({
							where: { id: args.paperId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	startVotingPhase: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true })
		},
		resolve: async (query, root, args, ctx) => {
			const paper = await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			if (paper.status !== 'AMENDMENT_PHASE') {
				throw new GraphQLError('Paper must be in AMENDMENT_PHASE to start voting');
			}

			const freshContent = await readPaperJson(args.paperId);
			const contentForSnapshot = freshContent ?? paper.content;

			await db.transaction(async (tx) => {
				await tx
					.update(schema.resolutionPaper)
					.set({ status: 'VOTING_PHASE' })
					.where(eq(schema.resolutionPaper.id, args.paperId));

				await tx.insert(schema.paperContentSnapshot).values({
					paperId: args.paperId,
					content: contentForSnapshot,
					trigger: 'VOTING_PHASE'
				});

				const firstClauseId = freshContent?.operative[0]?.id ?? null;
				await tx
					.update(schema.committee)
					.set({ currentOperativeIndex: 0, currentOperativeClauseId: firstClauseId })
					.where(eq(schema.committee.id, paper.committeeId));
			});

			pubsub.updated(args.paperId);
			committeePubsub.updated(paper.committeeId);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({
							where: { id: args.paperId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	recordVoteResult: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			outcome: t.arg({ type: enum_({ tsName: 'voteOutcome' }), required: true }),
			votesFor: t.arg.int({ required: true }),
			votesAgainst: t.arg.int({ required: true }),
			votesAbstain: t.arg.int()
		},
		resolve: async (query, root, args, ctx) => {
			const paper = await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			if (paper.status !== 'VOTING_PHASE' && paper.status !== 'AMENDMENT_PHASE') {
				throw new GraphQLError('Paper must be in VOTING_PHASE to record final vote');
			}

			// Look up rejected clauses up-front, but defer the Y.Doc trim until
			// after the SQL tx commits — otherwise a tx failure would leave the
			// live doc (and mirrored JSON) with clauses already removed while
			// the paper status stays in VOTING_PHASE/AMENDMENT_PHASE.
			let rejectedIds: Set<string> = new Set();
			if (args.outcome === 'ADOPTED') {
				const rejectedVotes = await db.query.operativeClauseVote.findMany({
					where: { paperId: args.paperId, outcome: 'REJECTED' }
				});
				rejectedIds = new Set(rejectedVotes.map((v) => v.clauseId));
			}

			await db.transaction(async (tx) => {
				await tx.insert(schema.resolutionVoteResult).values({
					paperId: args.paperId,
					outcome: args.outcome,
					votesFor: args.votesFor,
					votesAgainst: args.votesAgainst,
					votesAbstain: args.votesAbstain ?? 0
				});

				const updateSet: { status: 'FINAL'; documentNumber?: string } = {
					status: 'FINAL'
				};

				if (args.outcome === 'ADOPTED' && paper.documentNumber) {
					updateSet.documentNumber = paper.documentNumber.replace('/DR.', '/RES.');
				}

				await tx
					.update(schema.resolutionPaper)
					.set(updateSet)
					.where(eq(schema.resolutionPaper.id, args.paperId));
			});

			// Tx committed — now trim the Y.Doc so connected peers see the
			// final adopted content.
			if (args.outcome === 'ADOPTED' && rejectedIds.size > 0) {
				await applyServerMutation(args.paperId, (doc) => {
					const fresh = yDocToJson(doc);
					fresh.operative = fresh.operative.filter((c) => !rejectedIds.has(c.id));
					replaceResolution(doc, fresh);
				});
			}

			// Always clear activeDraftResolutionId and currentOperativeIndex
			const updateSet: Record<string, unknown> = {
				activeDraftResolutionId: null,
				currentOperativeIndex: null,
				currentOperativeClauseId: null
			};

			if (args.outcome === 'ADOPTED') {
				updateSet.lastResolutionAdoptionDate = new Date();
			}

			await db
				.update(schema.committee)
				.set(updateSet)
				.where(eq(schema.committee.id, paper.committeeId));

			committeePubsub.updated(paper.committeeId);
			pubsub.updated(args.paperId);
			voteResultPubsub.created();

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({
							where: { id: args.paperId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	softDeletePaper: t.field({
		type: 'Boolean',
		args: {
			paperId: t.arg.id({ required: true })
		},
		resolve: async (root, args, ctx) => {
			const user = ctx.mustBeLoggedIn();

			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			if (paper.status !== 'WORKING_PAPER') {
				throw new GraphQLError('Only working papers can be deleted');
			}

			// Only creator can delete
			await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						committeeMemberId: paper.creatorCommitteeMemberId
					}
				})
				.then(assertFindFirstExists);

			await db
				.update(schema.resolutionPaper)
				.set({ deletedAt: new Date() })
				.where(eq(schema.resolutionPaper.id, args.paperId));

			pubsub.updated(args.paperId);

			return true;
		}
	}),

	revertPaperStatus: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			restoreSnapshot: t.arg.boolean()
		},
		resolve: async (query, root, args, ctx) => {
			const paper = await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			const statusOrder = [
				'WORKING_PAPER',
				'SUBMITTED',
				'DRAFT_RESOLUTION',
				'AMENDMENT_PHASE',
				'VOTING_PHASE',
				'FINAL'
			] as const;
			const currentIndex = statusOrder.indexOf(paper.status as (typeof statusOrder)[number]);
			if (currentIndex <= 0) {
				throw new GraphQLError('Paper is already at initial status and cannot be reverted');
			}
			const targetStatus = statusOrder[currentIndex - 1];

			// Snapshot restoration (AMENDMENT_PHASE → DRAFT_RESOLUTION) is
			// deferred until after the revert tx commits — otherwise a tx
			// failure leaves clients on restored content while the paper is
			// still in AMENDMENT_PHASE with adopted amendments still applied.
			let restoredContent:
				| import('@deutschemodelunitednations/munify-resolution-editor/schema').Resolution
				| null = null;
			if (paper.status === 'AMENDMENT_PHASE' && args.restoreSnapshot) {
				const snapshot = await db.query.paperContentSnapshot.findFirst({
					where: { paperId: args.paperId, trigger: 'AMENDMENT_PHASE' },
					orderBy: { createdAt: 'desc' }
				});
				const snapshotContent = snapshot?.content
					? ResolutionSchema.safeParse(snapshot.content)
					: undefined;
				if (snapshotContent?.success) {
					restoredContent = snapshotContent.data;
				}
			}

			const currentContent = await readPaperJson(args.paperId);
			// What the doc will look like *after* this revert — restored from
			// snapshot if applicable, otherwise unchanged.
			const freshContent = restoredContent ?? currentContent;

			await db.transaction(async (tx) => {
				// Status-specific side effects
				if (paper.status === 'FINAL') {
					// Delete the resolution vote result
					await tx
						.delete(schema.resolutionVoteResult)
						.where(eq(schema.resolutionVoteResult.paperId, args.paperId));
					// Restore as active DR if committee has none
					const committee = await tx.query.committee
						.findFirst({ where: { id: paper.committeeId } })
						.then(assertFindFirstExists);
					if (!committee.activeDraftResolutionId) {
						const firstClauseId = freshContent?.operative[0]?.id ?? null;
						await tx
							.update(schema.committee)
							.set({
								activeDraftResolutionId: args.paperId,
								currentOperativeIndex: 0,
								currentOperativeClauseId: firstClauseId
							})
							.where(eq(schema.committee.id, paper.committeeId));
					}
				} else if (paper.status === 'VOTING_PHASE') {
					// Delete all operative clause votes for this paper
					await tx
						.delete(schema.operativeClauseVote)
						.where(eq(schema.operativeClauseVote.paperId, args.paperId));
				} else if (paper.status === 'AMENDMENT_PHASE') {
					// Clear currentOperativeIndex on committee
					await tx
						.update(schema.committee)
						.set({ currentOperativeIndex: null, currentOperativeClauseId: null })
						.where(eq(schema.committee.id, paper.committeeId));
					if (args.restoreSnapshot) {
						// Reset applied amendments back to PENDING
						await tx
							.update(schema.amendment)
							.set({ status: 'PENDING' })
							.where(
								and(
									eq(schema.amendment.paperId, args.paperId),
									inArray(schema.amendment.status, ['CONSENSUS_ADOPTED', 'ACCEPTED'])
								)
							);
					}
				} else if (paper.status === 'DRAFT_RESOLUTION') {
					// Clear document number and sequence
					await tx
						.update(schema.resolutionPaper)
						.set({ documentNumber: null, sequenceNumber: null })
						.where(eq(schema.resolutionPaper.id, args.paperId));
					// Clear active DR if this paper was active
					const committee = await tx.query.committee
						.findFirst({ where: { id: paper.committeeId } })
						.then(assertFindFirstExists);
					if (committee.activeDraftResolutionId === args.paperId) {
						await tx
							.update(schema.committee)
							.set({
								activeDraftResolutionId: null,
								currentOperativeIndex: null,
								currentOperativeClauseId: null
							})
							.where(eq(schema.committee.id, paper.committeeId));
					}
				}
				// SUBMITTED → WORKING_PAPER: no side effects

				// Update the paper status
				await tx
					.update(schema.resolutionPaper)
					.set({ status: targetStatus })
					.where(eq(schema.resolutionPaper.id, args.paperId));

				await tx.insert(schema.paperContentSnapshot).values({
					paperId: args.paperId,
					content: freshContent ?? paper.content,
					trigger: `REVERT_FROM_${paper.status}`
				});
			});

			// Tx committed — only now push the restored snapshot to the live
			// Y.Doc so peers see the rollback after the DB state agrees.
			if (restoredContent) {
				await applyServerMutation(args.paperId, (doc) => {
					replaceResolution(doc, restoredContent);
				});
			}

			pubsub.updated(args.paperId);
			committeePubsub.updated(paper.committeeId);

			// Notify vote subscriptions when reverting from statuses that delete votes
			if (paper.status === 'FINAL') {
				voteResultPubsub.created();
			} else if (paper.status === 'VOTING_PHASE') {
				clauseVotePubsub.created();
			}

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({
							where: { id: args.paperId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
