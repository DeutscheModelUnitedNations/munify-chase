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
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, nanoidValidation } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { readPaperJson } from '$api/yjs/server';

abilityBuilder.resolutionPaper.allow('read').when((ctx) => {
	return {
		where: {
			committee: isParticipantInConference(ctx)
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
			status: t.arg({ type: statusEnum })
		},
		resolve: async (query, _root, args, ctx) => {
			const updateFilter = ctx.abilities.resolutionPaper
				.filter('update')
				.merge({ where: { id: args.id } });

			// Persist the title first, so it is set before any submission flow
			if (args.title != null) {
				await db
					.update(schema.resolutionPaper)
					.set({ title: args.title })
					.where(updateFilter.sql.where);
			}

			if (args.status === 'SUBMITTED') {
				// Submitting runs the submission flow: it is only allowed from
				// WORKING_PAPER, requires a sponsor, and snapshots the content.
				const paper = await db.query.resolutionPaper
					.findFirst(updateFilter.query.single)
					.then(assertFindFirstExists);

				if (paper.status !== 'WORKING_PAPER') {
					throw new GraphQLError('Only working papers can be submitted');
				}

				const sponsors = await db.query.paperSponsor.findMany({
					where: { paperId: args.id }
				});
				if (sponsors.length === 0) {
					throw new GraphQLError('Paper needs at least one sponsor to submit');
				}

				const content = await readPaperJson(args.id);
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
			} else if (args.status != null) {
				await db
					.update(schema.resolutionPaper)
					.set({ status: args.status })
					.where(updateFilter.sql.where);
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
			const content = await readPaperJson(args.paperId);
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
