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
	isPaperAuthor
} from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { nanoid, nanoidValidation } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { readPaperJson } from '$api/yjs/server';
import { and, count, eq, inArray } from 'drizzle-orm';
import {
	toRoman,
	isClauseEmpty
} from '@deutschemodelunitednations/munify-resolution-editor/schema';
import type { Resolution } from '@deutschemodelunitednations/munify-resolution-editor/schema';

abilityBuilder.resolutionPaper.allow('read').when((ctx) => {
	return { where: { committee: isTeamInConference(ctx) } };
});

abilityBuilder.resolutionPaper.allow('read').when((ctx) => {
	return { where: { ...isPaperAuthor(ctx) } };
});

abilityBuilder.resolutionPaper.allow('read').when((ctx) => {
	const user = ctx.mustBeLoggedIn();
	return {
		where: {
			sponsors: { committeeMember: { users: { user: { id: user.sub } } } }
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
export const ResolutionPaperRef = ref;

const statusEnum = enum_({ tsName: 'paperStatus' });

const pubsub = rumblePubsub({ table: 'resolutionPaper' });

query({ table: 'resolutionPaper' });

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

			let creatorCommitteeMemberId: string;
			let status: typeof schema.resolutionPaper.$inferSelect.status;
			let editorConferenceUserIds: string[];

			if (chair) {
				if (!args.creatorCommitteeMemberId) {
					throw new GraphQLError('creatorCommitteeMemberId is required when creating as chair');
				}
				const creator = await db.query.committeeMember
					.findFirst({
						where: { id: args.creatorCommitteeMemberId, committeeId: args.committeeId },
						with: { users: true }
					})
					.then(assertFindFirstExists);
				creatorCommitteeMemberId = creator.id;
				status = args.status ?? 'SUBMITTED';
				editorConferenceUserIds = creator.users.map((u) => u.id);
			} else {
				const user = ctx.mustBeLoggedIn();
				if (!user.email) throw new GraphQLError('User email is required');

				const conferenceUser = await db.query.conferenceUser
					.findFirst({
						where: {
							userEmail: user.email,
							committeeMember: { committeeId: args.committeeId }
						},
						with: { committeeMember: true }
					})
					.then(assertFindFirstExists);

				if (!conferenceUser.committeeMember) {
					throw new GraphQLError('You are not assigned as a committee member');
				}
				creatorCommitteeMemberId = conferenceUser.committeeMember.id;
				status = 'WORKING_PAPER';
				editorConferenceUserIds = [conferenceUser.id];
			}

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
			});

			pubsub.created();

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({ where: { id: args.id } }).query
							.single
					)
				)
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
			const updateFilter = ctx.abilities.resolutionPaper
				.filter('update')
				.merge({ where: { id: args.id } });

			const needsChairCheck =
				args.documentNumber != null || (args.status != null && args.status !== 'SUBMITTED');
			const isChair = needsChairCheck
				? !!(await db.query.resolutionPaper.findFirst({
						where: {
							id: args.id,
							committee: isTeamInConference(ctx)
						},
						columns: { id: true }
					}))
				: false;
			if (args.documentNumber != null && !isChair) {
				throw new GraphQLError('Only chairs may set the document number');
			}

			// Persist plain metadata first, so it is set before any submission flow
			const metaUpdate: Partial<typeof schema.resolutionPaper.$inferInsert> = {};
			if (args.title != null) metaUpdate.title = args.title;
			if (args.documentNumber != null) metaUpdate.documentNumber = args.documentNumber;
			if (Object.keys(metaUpdate).length > 0) {
				await db.update(schema.resolutionPaper).set(metaUpdate).where(updateFilter.sql.where);
			}

			if (args.status === 'SUBMITTED') {
				const paper = await db.query.resolutionPaper
					.findFirst(updateFilter.query.single)
					.then(assertFindFirstExists);

				if (paper.status === 'WORKING_PAPER') {
					// Only the creator or a chair may submit.
					const isChairSubmit = !!(await db.query.resolutionPaper.findFirst({
						where: { id: args.id, committee: isTeamInConference(ctx) },
						columns: { id: true }
					}));
					if (!isChairSubmit) {
						const submitter = ctx.mustBeLoggedIn();
						const isCreatorSubmit = !!(await db.query.resolutionPaper.findFirst({
							where: {
								id: args.id,
								creatorCommitteeMember: { users: { user: { id: submitter.sub } } }
							},
							columns: { id: true }
						}));
						if (!isCreatorSubmit) {
							throw new GraphQLError('Only the paper creator or a chair may submit this paper');
						}
					}

					const sponsors = await db.query.paperSponsor.findMany({
						where: { paperId: args.id }
					});
					if (sponsors.length === 0) {
						throw new GraphQLError('Paper needs at least one sponsor to submit');
					}

					const content = await readPaperJson(args.id);
					const resolution = JSON.parse(content) as Resolution;

					const hasPreambleContent = resolution.preamble.some((c) => c.content.trim().length > 0);
					if (!hasPreambleContent) {
						throw new GraphQLError(
							'Paper must have at least one preamble clause with content before submitting'
						);
					}

					const hasOperativeContent = resolution.operative.some((c) => !isClauseEmpty(c));
					if (!hasOperativeContent) {
						throw new GraphQLError(
							'Paper must have at least one operative clause with content before submitting'
						);
					}

					await db.transaction(async (tx) => {
						await tx.insert(schema.paperContentSnapshot).values({
							id: nanoid(),
							paperId: args.id,
							content,
							trigger: 'SUBMITTED'
						});
						await tx
							.update(schema.resolutionPaper)
							.set({ status: 'SUBMITTED' })
							.where(updateFilter.sql.where);
					});
				} else {
					// Revert from a later stage: simple status update without the
					// submission flow (chairs only, already enforced by ability filter).
					await db
						.update(schema.resolutionPaper)
						.set({ status: 'SUBMITTED' })
						.where(updateFilter.sql.where);
				}
			} else if (args.status === 'DRAFT_RESOLUTION') {
				if (!isChair) {
					throw new GraphQLError('Only chairs may promote a paper to draft resolution');
				}
				const paper = await db.query.resolutionPaper
					.findFirst(updateFilter.query.single)
					.then(assertFindFirstExists);

				const statusUpdate: Partial<typeof schema.resolutionPaper.$inferInsert> = {
					status: 'DRAFT_RESOLUTION'
				};

				if (!paper.documentNumber) {
					const committee = await db.query.committee
						.findFirst({ where: { id: paper.committeeId } })
						.then(assertFindFirstExists);

					const agendaItems = await db.query.agendaItem.findMany({
						where: { committeeId: paper.committeeId }
					});
					const agendaItemIndex = agendaItems.findIndex((ai) => ai.id === paper.agendaItemId);
					const agendaPosition = agendaItemIndex >= 0 ? agendaItemIndex + 1 : 1;

					const existingCount = await db
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

					statusUpdate.documentNumber = `${committee.abbreviation}/${toRoman(agendaPosition)}/DR.${existingCount.n + 1}`;
				}

				await db.update(schema.resolutionPaper).set(statusUpdate).where(updateFilter.sql.where);
			} else if (args.status != null) {
				if (!isChair) {
					throw new GraphQLError('Only chairs may change the paper status');
				}
				await db
					.update(schema.resolutionPaper)
					.set({ status: args.status })
					.where(updateFilter.sql.where);
				if (args.status === 'FINAL' && args.deployConfetti) {
					const paper = await db.query.resolutionPaper
						.findFirst({ where: { id: args.id }, columns: { committeeId: true } })
						.then(assertFindFirstExists);
					await db
						.update(schema.committee)
						.set({ lastResolutionAdoptionDate: new Date() })
						.where(eq(schema.committee.id, paper.committeeId));
				}
			}

			pubsub.updated(args.id);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({ where: { id: args.id } }).query
							.single
					)
				)
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
					ctx.abilities.resolutionPaper.filter('delete').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.removed();
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
			// Only chairs may conclude a vote.
			await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId, committee: isTeamInConference(ctx) },
					columns: { id: true }
				})
				.then(assertFindFirstExists);

			const content = await readPaperJson(args.paperId);
			const paperForCommittee = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId }, columns: { committeeId: true } })
				.then(assertFindFirstExists);
			await db.transaction(async (tx) => {
				await tx
					.update(schema.resolutionPaper)
					.set({
						status: 'FINAL',
						voteVotingSessionId: args.votingSessionId
					})
					.where(
						ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.paperId } })
							.sql.where
					);
				await tx.insert(schema.paperContentSnapshot).values({
					id: nanoid(),
					paperId: args.paperId,
					content,
					trigger: 'VOTE_CONCLUDED'
				});
				await tx
					.update(schema.committee)
					.set({ lastResolutionAdoptionDate: new Date() })
					.where(eq(schema.committee.id, paperForCommittee.committeeId));
			});

			pubsub.updated(args.paperId);

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({ where: { id: args.paperId } })
							.query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
