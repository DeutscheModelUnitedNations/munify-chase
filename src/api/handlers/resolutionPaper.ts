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
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { isNull } from 'drizzle-orm';
import { readPaperJson } from '$api/yjs/server';

abilityBuilder.resolutionPaper.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

// Anyone in the conference can see papers (status-based read filtering happens in UI).
abilityBuilder.resolutionPaper.allow('read').when((ctx) => {
	return {
		where: {
			committee: isParticipantInConference(ctx),
			deletedAt: { isNull: true }
		}
	};
});

// Chairs can do anything; creator/editor permissions handled per-mutation.
abilityBuilder.resolutionPaper.allow(['update', 'delete']).when((ctx) => {
	return {
		where: {
			committee: isTeamInConference(ctx)
		}
	};
});

const ref = object({ table: 'resolutionPaper' });
export const ResolutionPaperRef = ref;

const statusEnum = enum_({ tsName: 'paperStatus' });

const pubsub = rumblePubsub({ table: 'resolutionPaper' });
const committeePubsub = rumblePubsub({ table: 'committee' });

query({ table: 'resolutionPaper' });

async function ensureLoggedInDelegateInCommittee(
	ctx: { mustBeLoggedIn: () => { sub: string; email?: string | null } },
	committeeId: string
) {
	const user = ctx.mustBeLoggedIn();
	if (!user.email) throw new GraphQLError('User email is required');

	const conferenceUser = await db.query.conferenceUser
		.findFirst({
			where: {
				userEmail: user.email,
				committeeMember: { committeeId }
			},
			with: { committeeMember: true }
		})
		.then(assertFindFirstExists);

	if (!conferenceUser.committeeMember) {
		throw new GraphQLError('You are not assigned as a committee member');
	}
	return { conferenceUser, committeeMember: conferenceUser.committeeMember };
}

async function ensureChairOfCommittee(
	ctx: {
		mustBeLoggedIn: () => { sub: string; email?: string | null };
		hasRole: (r: string) => boolean;
	},
	committeeId: string
) {
	if (isGlobalAdmin(ctx)) return;
	const user = ctx.mustBeLoggedIn();
	if (!user.email) throw new GraphQLError('User email is required');
	const conferenceUser = await db.query.conferenceUser.findFirst({
		where: {
			userEmail: user.email,
			conference: { committees: { id: committeeId } },
			conferenceUserType: { in: ['ADMIN', 'TEAM'] }
		}
	});
	if (!conferenceUser) throw new GraphQLError('Chair access required');
}

schemaBuilder.mutationFields((t) => ({
	createResolutionPaper: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id(),
			committeeId: t.arg.id({ required: true }),
			agendaItemId: t.arg.id({ required: true }),
			title: t.arg.string()
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			const { conferenceUser, committeeMember } = await ensureLoggedInDelegateInCommittee(
				ctx,
				args.committeeId
			);

			await db.transaction(async (tx) => {
				await tx.insert(schema.resolutionPaper).values({
					id: entityId,
					committeeId: args.committeeId,
					agendaItemId: args.agendaItemId,
					creatorCommitteeMemberId: committeeMember.id,
					status: 'WORKING_PAPER',
					title: args.title ?? null
				});

				// Creator is auto-added as sponsor + editor.
				await tx.insert(schema.paperSponsor).values({
					id: nanoid(),
					paperId: entityId,
					committeeMemberId: committeeMember.id
				});
				await tx.insert(schema.paperEditor).values({
					id: nanoid(),
					paperId: entityId,
					conferenceUserId: conferenceUser.id
				});
			});

			pubsub.created();

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({ where: { id: entityId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	chairCreateResolutionPaper: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id(),
			committeeId: t.arg.id({ required: true }),
			agendaItemId: t.arg.id({ required: true }),
			creatorCommitteeMemberId: t.arg.id({ required: true }),
			title: t.arg.string(),
			status: t.arg({ type: statusEnum })
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();
			await ensureChairOfCommittee(ctx, args.committeeId);

			const creator = await db.query.committeeMember
				.findFirst({
					where: { id: args.creatorCommitteeMemberId, committeeId: args.committeeId },
					with: { users: true }
				})
				.then(assertFindFirstExists);

			await db.transaction(async (tx) => {
				await tx.insert(schema.resolutionPaper).values({
					id: entityId,
					committeeId: args.committeeId,
					agendaItemId: args.agendaItemId,
					creatorCommitteeMemberId: args.creatorCommitteeMemberId,
					status: args.status ?? 'SUBMITTED',
					title: args.title ?? null
				});
				await tx.insert(schema.paperSponsor).values({
					id: nanoid(),
					paperId: entityId,
					committeeMemberId: args.creatorCommitteeMemberId
				});
				// Editor row only created if the creator member has an associated conferenceUser.
				for (const cu of creator.users) {
					await tx.insert(schema.paperEditor).values({
						id: nanoid(),
						paperId: entityId,
						conferenceUserId: cu.id
					});
				}
			});

			pubsub.created();

			return db.query.resolutionPaper
				.findFirst(
					query(
						ctx.abilities.resolutionPaper.filter('read').merge({ where: { id: entityId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	updatePaperTitle: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id({ required: true }),
			title: t.arg.string()
		},
		resolve: async (query, _root, args, ctx) => {
			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.id } })
				.then(assertFindFirstExists);

			if (paper.status !== 'WORKING_PAPER') {
				// Chairs can update later statuses; delegates cannot.
				if (!isGlobalAdmin(ctx)) {
					await ensureChairOfCommittee(ctx, paper.committeeId);
				}
			}

			await db
				.update(schema.resolutionPaper)
				.set({ title: args.title ?? null })
				.where(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.id } }).sql.where
				);
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
			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.id } })
				.then(assertFindFirstExists);

			await ensureChairOfCommittee(ctx, paper.committeeId);

			await db
				.update(schema.resolutionPaper)
				.set({ deletedAt: new Date() })
				.where(
					ctx.abilities.resolutionPaper.filter('delete').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.removed();
			return true;
		}
	}),

	submitPaper: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.id },
					with: { sponsors: true }
				})
				.then(assertFindFirstExists);

			if (paper.status !== 'WORKING_PAPER') {
				throw new GraphQLError('Only working papers can be submitted');
			}
			if (paper.sponsors.length === 0) {
				throw new GraphQLError('Paper needs at least one sponsor to submit');
			}

			// Anyone with edit permission can submit (creator/editor/chair).
			// We don't need a separate check; ability rules cover team, and
			// editors are filtered out for now (relaxing this would need
			// dedicated logic — out of scope for first pass).
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
					.where(
						ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.id } }).sql
							.where
					);
			});

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

	setPaperStatus: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id({ required: true }),
			status: t.arg({ type: statusEnum, required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.id } })
				.then(assertFindFirstExists);
			await ensureChairOfCommittee(ctx, paper.committeeId);

			await db
				.update(schema.resolutionPaper)
				.set({ status: args.status })
				.where(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.id } }).sql.where
				);

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

	setActiveDraftResolution: t.drizzleField({
		type: 'committee',
		args: {
			committeeId: t.arg.id({ required: true }),
			paperId: t.arg.id()
		},
		resolve: async (query, _root, args, ctx) => {
			await ensureChairOfCommittee(ctx, args.committeeId);
			if (args.paperId) {
				await db.query.resolutionPaper
					.findFirst({ where: { id: args.paperId, committeeId: args.committeeId } })
					.then(assertFindFirstExists);
			}
			await db
				.update(schema.committee)
				.set({
					activeDraftResolutionId: args.paperId ?? null,
					activeAmendmentId: null
				})
				.where(
					ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).sql
						.where
				);
			committeePubsub.updated(args.committeeId);
			return db.query.committee
				.findFirst(
					query(
						ctx.abilities.committee.filter('read').merge({ where: { id: args.committeeId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	setActiveAmendment: t.drizzleField({
		type: 'committee',
		args: {
			committeeId: t.arg.id({ required: true }),
			amendmentId: t.arg.id()
		},
		resolve: async (query, _root, args, ctx) => {
			await ensureChairOfCommittee(ctx, args.committeeId);
			await db
				.update(schema.committee)
				.set({ activeAmendmentId: args.amendmentId ?? null })
				.where(
					ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).sql
						.where
				);
			committeePubsub.updated(args.committeeId);
			return db.query.committee
				.findFirst(
					query(
						ctx.abilities.committee.filter('read').merge({ where: { id: args.committeeId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	setCommitteeResolutionToggles: t.drizzleField({
		type: 'committee',
		args: {
			committeeId: t.arg.id({ required: true }),
			supportReevaluationOpen: t.arg.boolean(),
			amendmentSubmissionOpen: t.arg.boolean(),
			amendmentSponsoringOpen: t.arg.boolean(),
			currentOperativeIndex: t.arg.int()
		},
		resolve: async (query, _root, args, ctx) => {
			await ensureChairOfCommittee(ctx, args.committeeId);
			await db
				.update(schema.committee)
				.set({
					supportReevaluationOpen: args.supportReevaluationOpen ?? undefined,
					amendmentSubmissionOpen: args.amendmentSubmissionOpen ?? undefined,
					amendmentSponsoringOpen: args.amendmentSponsoringOpen ?? undefined,
					currentOperativeIndex: args.currentOperativeIndex ?? undefined
				})
				.where(
					ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).sql
						.where
				);
			committeePubsub.updated(args.committeeId);
			return db.query.committee
				.findFirst(
					query(
						ctx.abilities.committee.filter('read').merge({ where: { id: args.committeeId } }).query
							.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));

// Suppress unused-import lint
void isNull;
