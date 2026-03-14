import { db, schema } from '$api/db/db';
import { abilityBuilder, enum_, schemaBuilder, pubsub as rumblePubsub } from '$api/rumble';
import { and, eq, isNull, count as drizzleCount, desc, inArray } from 'drizzle-orm';
import { basics } from './basics';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { GraphQLError } from 'graphql';
import {
	ResolutionSchema,
	createEmptyResolution,
	toRoman
} from '@deutschemodelunitednations/munify-resolution-editor/schema';

const { arg, ref, pubsub, table } = basics('resolutionPaper');
const committeePubsub = rumblePubsub({ table: 'committee' });
const voteResultPubsub = rumblePubsub({ table: 'resolutionVoteResult' });
const clauseVotePubsub = rumblePubsub({ table: 'operativeClauseVote' });

const paperStatusEnum = enum_({ tsName: 'paperStatus' });

abilityBuilder.resolutionPaper.allow(['read', 'update']).when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return { where: { deletedAt: { isNull: true } } };
	}
});

abilityBuilder.resolutionPaper.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return { where: { deletedAt: { isNull: true } } };
});

/**
 * Helper to check if the current user is a chair (ADMIN/TEAM) for a committee's conference,
 * or a global admin.
 */
export async function assertCommitteeChairOrAdmin(
	ctx: {
		hasRole: (role: string) => boolean;
		mustBeLoggedIn: () => { sub?: string; email?: string | null };
	},
	committeeId: string
) {
	if (ctx.hasRole('admin')) {
		return;
	}

	const user = ctx.mustBeLoggedIn();

	await db.query.conferenceUser
		.findFirst({
			where: {
				conference: {
					committees: {
						id: committeeId
					}
				},
				user: {
					id: user.sub
				},
				conferenceUserType: {
					in: ['ADMIN', 'TEAM']
				}
			}
		})
		.then(assertFindFirstExists);
}

schemaBuilder.mutationFields((t) => ({
	createResolutionPaper: t.drizzleField({
		type: ref,
		args: {
			committeeId: t.arg.id({ required: true }),
			agendaItemId: t.arg.id({ required: true }),
			title: t.arg.string()
		},
		resolve: async (query, root, args, ctx, info) => {
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
						ctx.abilities.resolutionPaper.filter('read', {
							inject: {
								where: { id: result.id }
							}
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
		resolve: async (query, root, args, ctx, info) => {
			await assertCommitteeChairOrAdmin(ctx, args.committeeId);

			// Validate committeeMemberId belongs to this committee
			const committeeMember = await db.query.committeeMember
				.findFirst({
					where: { id: args.committeeMemberId, committeeId: args.committeeId }
				})
				.then(assertFindFirstExists);

			// Get committee name for the empty resolution
			const committee = await db.query.committee
				.findFirst({
					where: { id: args.committeeId }
				})
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
						ctx.abilities.resolutionPaper.filter('read', {
							inject: {
								where: { id: result.id }
							}
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	updatePaperContent: t.drizzleField({
		type: ref,
		args: {
			paperId: t.arg.id({ required: true }),
			content: t.arg({ type: 'JSON', required: true })
		},
		resolve: async (query, root, args, ctx, info) => {
			const user = ctx.mustBeLoggedIn();

			// Validate content against schema
			const parsed = ResolutionSchema.safeParse(args.content);
			if (!parsed.success) {
				throw new GraphQLError('Invalid resolution content: ' + parsed.error.message);
			}

			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			// Status-dependent auth
			if (paper.status === 'DRAFT_RESOLUTION' || paper.status === 'AMENDMENT_PHASE') {
				// Only chair/admin can edit DRs
				await assertCommitteeChairOrAdmin(ctx, paper.committeeId);
			} else if (paper.status === 'SUBMITTED') {
				// Chair/admin OR creator + editors
				const isChair = await db.query.conferenceUser.findFirst({
					where: {
						conference: {
							committees: { id: paper.committeeId }
						},
						user: { id: user.sub },
						conferenceUserType: { in: ['ADMIN', 'TEAM'] }
					}
				});

				if (!isChair && !ctx.hasRole('admin')) {
					// Must be creator or editor
					const isEditor = await db.query.paperEditor.findFirst({
						where: {
							paperId: args.paperId,
							conferenceUser: { user: { id: user.sub } }
						}
					});

					if (!isEditor) {
						throw new GraphQLError('You do not have permission to edit this paper');
					}
				}
			} else if (paper.status === 'WORKING_PAPER') {
				// Creator + editors
				const isEditor = await db.query.paperEditor.findFirst({
					where: {
						paperId: args.paperId,
						conferenceUser: { user: { id: user.sub } }
					}
				});

				if (!isEditor && !ctx.hasRole('admin')) {
					throw new GraphQLError('You do not have permission to edit this paper');
				}
			} else {
				throw new GraphQLError('Paper cannot be edited in its current status');
			}

			// Resolve sender's conferenceUserId for lock-aware merge
			const senderConferenceUser = await db.query.conferenceUser.findFirst({
				where: { user: { id: user.sub } }
			});

			let contentToWrite = parsed.data;

			if (senderConferenceUser) {
				// Fetch active (non-expired) locks held by OTHER users
				const expiryThreshold = new Date(Date.now() - 60_000);
				const otherLocks = await db.query.paperClauseLock.findMany({
					where: {
						paperId: args.paperId,
						conferenceUserId: { ne: senderConferenceUser.id },
						acquiredAt: { gte: expiryThreshold }
					}
				});

				if (otherLocks.length > 0 && paper.content) {
					const othersLockedClauseIds = new Set(otherLocks.map((l) => l.clauseId));
					const currentContent = ResolutionSchema.safeParse(paper.content);

					if (currentContent.success) {
						const dbContent = currentContent.data;
						const incoming = parsed.data;

						// Build map of DB clauses by ID
						const dbPreambleMap = new Map(dbContent.preamble.map((c) => [c.id, c]));
						const dbOperativeMap = new Map(dbContent.operative.map((c) => [c.id, c]));

						// Merge preamble: for locked clauses, keep DB version
						const mergedPreamble = incoming.preamble.map((clause) => {
							if (othersLockedClauseIds.has(clause.id) && dbPreambleMap.has(clause.id)) {
								return dbPreambleMap.get(clause.id)!;
							}
							return clause;
						});

						// Append preamble clauses locked by others that sender deleted
						for (const [id, clause] of dbPreambleMap) {
							if (othersLockedClauseIds.has(id) && !incoming.preamble.some((c) => c.id === id)) {
								mergedPreamble.push(clause);
							}
						}

						// Merge operative: for locked clauses, keep DB version
						const mergedOperative = incoming.operative.map((clause) => {
							if (othersLockedClauseIds.has(clause.id) && dbOperativeMap.has(clause.id)) {
								return dbOperativeMap.get(clause.id)!;
							}
							return clause;
						});

						// Append operative clauses locked by others that sender deleted
						for (const [id, clause] of dbOperativeMap) {
							if (othersLockedClauseIds.has(id) && !incoming.operative.some((c) => c.id === id)) {
								mergedOperative.push(clause);
							}
						}

						contentToWrite = {
							committeeName: incoming.committeeName,
							preamble: mergedPreamble,
							operative: mergedOperative
						};
					}
				}

				// Refresh sender's locks (keep alive during active editing)
				await db
					.update(schema.paperClauseLock)
					.set({ acquiredAt: new Date() })
					.where(
						and(
							eq(schema.paperClauseLock.paperId, args.paperId),
							eq(schema.paperClauseLock.conferenceUserId, senderConferenceUser.id)
						)
					);
			}

			await db
				.update(schema.resolutionPaper)
				.set({ content: contentToWrite })
				.where(eq(schema.resolutionPaper.id, args.paperId));

			pubsub.updated(args.paperId);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read', {
							inject: {
								where: { id: args.paperId }
							}
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
		resolve: async (query, root, args, ctx, info) => {
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
						ctx.abilities.resolutionPaper.filter('read', {
							inject: {
								where: { id: args.paperId }
							}
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
		resolve: async (query, root, args, ctx, info) => {
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
			const conferenceUser = await db.query.conferenceUser
				.findFirst({
					where: {
						user: { id: user.sub },
						committeeMemberId: paper.creatorCommitteeMemberId
					}
				})
				.then(assertFindFirstExists);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.resolutionPaper)
					.set({ status: 'SUBMITTED' })
					.where(eq(schema.resolutionPaper.id, args.paperId));

				// Create content snapshot
				await tx.insert(schema.paperContentSnapshot).values({
					paperId: args.paperId,
					content: paper.content,
					trigger: 'SUBMITTED'
				});

				// Remove all clause locks so the chair can edit freely
				await tx
					.delete(schema.paperClauseLock)
					.where(eq(schema.paperClauseLock.paperId, args.paperId));
			});

			pubsub.updated(args.paperId);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read', {
							inject: {
								where: { id: args.paperId }
							}
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
		resolve: async (query, root, args, ctx, info) => {
			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			if (paper.status !== 'SUBMITTED') {
				throw new GraphQLError('Only submitted papers can be promoted to draft resolutions');
			}

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

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

			await db.transaction(async (tx) => {
				await tx
					.update(schema.resolutionPaper)
					.set({
						status: 'DRAFT_RESOLUTION',
						documentNumber,
						sequenceNumber
					})
					.where(eq(schema.resolutionPaper.id, args.paperId));

				// Create content snapshot
				await tx.insert(schema.paperContentSnapshot).values({
					paperId: args.paperId,
					content: paper.content,
					trigger: 'DRAFT_RESOLUTION'
				});
			});

			pubsub.updated(args.paperId);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read', {
							inject: {
								where: { id: args.paperId }
							}
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
		resolve: async (query, root, args, ctx, info) => {
			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			if (paper.status !== 'AMENDMENT_PHASE') {
				throw new GraphQLError('Paper must be in AMENDMENT_PHASE to start voting');
			}

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			await db.transaction(async (tx) => {
				await tx
					.update(schema.resolutionPaper)
					.set({ status: 'VOTING_PHASE' })
					.where(eq(schema.resolutionPaper.id, args.paperId));

				await tx.insert(schema.paperContentSnapshot).values({
					paperId: args.paperId,
					content: paper.content,
					trigger: 'VOTING_PHASE'
				});

				// Reset currentOperativeIndex to 0 for voting navigation
				await tx
					.update(schema.committee)
					.set({ currentOperativeIndex: 0 })
					.where(eq(schema.committee.id, paper.committeeId));
			});

			pubsub.updated(args.paperId);
			committeePubsub.updated(paper.committeeId);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read', {
							inject: {
								where: { id: args.paperId }
							}
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
		resolve: async (query, root, args, ctx, info) => {
			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			if (paper.status !== 'VOTING_PHASE' && paper.status !== 'AMENDMENT_PHASE') {
				throw new GraphQLError('Paper must be in VOTING_PHASE to record final vote');
			}

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

			await db.transaction(async (tx) => {
				await tx.insert(schema.resolutionVoteResult).values({
					paperId: args.paperId,
					outcome: args.outcome,
					votesFor: args.votesFor,
					votesAgainst: args.votesAgainst,
					votesAbstain: args.votesAbstain ?? 0
				});

				const updateSet: { status: 'FINAL'; content?: unknown; documentNumber?: string } = {
					status: 'FINAL'
				};

				if (args.outcome === 'ADOPTED') {
					const rejectedVotes = await tx.query.operativeClauseVote.findMany({
						where: { paperId: args.paperId, outcome: 'REJECTED' }
					});
					const rejectedIds = new Set(rejectedVotes.map((v) => v.clauseId));

					if (rejectedIds.size > 0) {
						const parsed = ResolutionSchema.safeParse(paper.content);
						if (parsed.success) {
							parsed.data.operative = parsed.data.operative.filter(
								(clause) => !rejectedIds.has(clause.id)
							);
							updateSet.content = parsed.data;
						}
					}

					// Change DR to RES in document number
					if (paper.documentNumber) {
						updateSet.documentNumber = paper.documentNumber.replace('/DR.', '/RES.');
					}
				}

				await tx
					.update(schema.resolutionPaper)
					.set(updateSet)
					.where(eq(schema.resolutionPaper.id, args.paperId));
			});

			// Always clear activeDraftResolutionId and currentOperativeIndex
			const updateSet: Record<string, unknown> = {
				activeDraftResolutionId: null,
				currentOperativeIndex: null
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
						ctx.abilities.resolutionPaper.filter('read', {
							inject: {
								where: { id: args.paperId }
							}
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
		resolve: async (query, root, args, ctx, info) => {
			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId }
				})
				.then(assertFindFirstExists);

			await assertCommitteeChairOrAdmin(ctx, paper.committeeId);

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
						await tx
							.update(schema.committee)
							.set({
								activeDraftResolutionId: args.paperId,
								currentOperativeIndex: 0
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
						.set({ currentOperativeIndex: null })
						.where(eq(schema.committee.id, paper.committeeId));
					if (args.restoreSnapshot) {
						// Restore content from latest AMENDMENT_PHASE snapshot
						const snapshot = await tx.query.paperContentSnapshot.findFirst({
							where: { paperId: args.paperId, trigger: 'AMENDMENT_PHASE' },
							orderBy: { createdAt: 'desc' }
						});
						if (snapshot?.content) {
							await tx
								.update(schema.resolutionPaper)
								.set({ content: snapshot.content })
								.where(eq(schema.resolutionPaper.id, args.paperId));
						}
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
								currentOperativeIndex: null
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

				// Create audit snapshot
				await tx.insert(schema.paperContentSnapshot).values({
					paperId: args.paperId,
					content: paper.content,
					trigger: `REVERT_FROM_${paper.status}`
				});
			});

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
						ctx.abilities.resolutionPaper.filter('read', {
							inject: {
								where: { id: args.paperId }
							}
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
