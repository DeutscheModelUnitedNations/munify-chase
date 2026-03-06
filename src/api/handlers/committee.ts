import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	pubsub as rumblePubsub,
	schemaBuilder,
	arg as rumbleArg
} from '$api/rumble';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { and, count, eq, type InferSelectModel } from 'drizzle-orm';
import { calculateMajority } from '$lib/utils/majorities';
import { assertConferenceAdmin } from './conferenceUser';
import { GraphQLError } from 'graphql';

const paperPubsub = rumblePubsub({ table: 'resolutionPaper' });

const statusEnum = enum_({
	tsName: 'committeeStatus'
});

abilityBuilder.committee.allow(['read', 'update']).when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

abilityBuilder.committee.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

const getTotalPresentCount = async (
	parent: InferSelectModel<typeof schema.committee> & {
		members: (InferSelectModel<typeof schema.committeeMember> & {
			representation: InferSelectModel<typeof schema.representation>;
		})[];
	}
) => {
	if (
		typeof parent.members?.at(0)?.present === 'boolean' &&
		parent.members?.at(0)?.representation.type
	) {
		return parent.members.filter((x) => x.present && x.representation.type === 'DELEGATION').length;
	}
	return (
		await db
			.select({ count: count() })
			.from(schema.committeeMember)
			.innerJoin(
				schema.representation,
				eq(schema.committeeMember.representationId, schema.representation.id)
			)
			.where(
				and(
					eq(schema.committeeMember.committeeId, parent.id),
					eq(schema.committeeMember.present, true),
					eq(schema.representation.type, 'DELEGATION')
				)
			)
			.then(assertFirstEntryExists)
	).count;
};

const ref = object({
	table: 'committee',
	adjust: (t) => ({
		totalPresent: t.field({
			type: 'Int',
			//TODO remove as any when rumble fixed it's types
			resolve: (parent, args, context, info) => getTotalPresentCount(parent as any)
		}),
		simpleMajority: t.field({
			type: 'Int',
			resolve: async (parent, args, context, info) => {
				if (parent.customSimpleMajority) {
					return parent.customSimpleMajority;
				}
				const total = await getTotalPresentCount(parent as any);
				return calculateMajority(total, 'simple');
			}
		}),
		twoThirdsMajority: t.field({
			type: 'Int',
			resolve: async (parent, args, context, info) => {
				if (parent.customTwoThirdsMajority) {
					return parent.customSimpleMajority;
				}
				const total = await getTotalPresentCount(parent as any);
				return calculateMajority(total, 'twoThirds');
			}
		}),
		paperSupportThreshold: t.field({
			type: 'Int',
			resolve: async (parent, args, context, info) => {
				if (parent.customPaperSupportThreshold) {
					return parent.customPaperSupportThreshold;
				}
				const total = await getTotalPresentCount(parent as any);
				return Math.ceil(total * 0.1);
			}
		})
	})
});
const pubsub = rumblePubsub({ table: 'committee' });
const arg = rumbleArg({ table: 'committee' });
query({
	table: 'committee'
});

schemaBuilder.mutationFields((t) => {
	return {
		createCommittee: t.drizzleField({
			type: ref,
			args: {
				conferenceId: t.arg.id({ required: true }),
				name: t.arg.string({ required: true }),
				abbreviation: t.arg.string({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				await assertConferenceAdmin(ctx, args.conferenceId);

				const result = await db
					.insert(schema.committee)
					.values({
						conferenceId: args.conferenceId,
						name: args.name,
						abbreviation: args.abbreviation
					})
					.returning()
					.then(assertFirstEntryExists);

				pubsub.updated(result.id);

				return db.query.committee
					.findFirst(
						query(
							ctx.abilities.committee.filter('read', {
								inject: {
									where: { id: result.id }
								}
							}).query.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),

		deleteCommittee: t.field({
			type: 'Boolean',
			args: {
				id: t.arg.id({ required: true })
			},
			resolve: async (root, args, ctx, info) => {
				const committee = await db.query.committee.findFirst({
					where: { id: args.id }
				});

				if (!committee) {
					throw new GraphQLError('Committee not found');
				}

				await assertConferenceAdmin(ctx, committee.conferenceId);

				await db.delete(schema.committee).where(eq(schema.committee.id, args.id));

				pubsub.removed(args.id);

				return true;
			}
		}),

		updateCommittee: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true }),
				name: t.arg.string(),
				abbreviation: t.arg.string(),
				whiteboardContent: t.arg.string(),
				showWhiteboard: t.arg.boolean(),
				status: t.arg({
					type: statusEnum
				}),
				statusHeadline: t.arg.string(),
				statusUntil: t.arg({
					type: 'DateTime'
				}),
				stateOfDebate: t.arg.string(),
				activeAgendaItemId: t.arg.id(),
				lastResolutionAdoptionDate: t.arg({
					type: 'DateTime'
				}),
				allowDelegationsToAddThemselvesToSpeakersList: t.arg.boolean(),
				maxDraftResolutions: t.arg.int(),
				activeDraftResolutionId: t.arg.id(),
				clearActiveDraftResolution: t.arg.boolean(),
				currentOperativeIndex: t.arg.int(),
				supportReEvaluationOpen: t.arg.boolean()
			},
			resolve: async (query, root, args, ctx, info) => {
				// Validate activeDraftResolutionId if provided
				if (args.activeDraftResolutionId) {
					const paper = await db.query.resolutionPaper.findFirst({
						where: { id: args.activeDraftResolutionId }
					});

					if (!paper) {
						throw new GraphQLError('Paper not found');
					}
					if (paper.committeeId !== args.id) {
						throw new GraphQLError('Paper does not belong to this committee');
					}
					if (
						paper.status !== 'DRAFT_RESOLUTION' &&
						paper.status !== 'AMENDMENT_PHASE' &&
						paper.status !== 'VOTING_PHASE'
					) {
						throw new GraphQLError('Only draft resolutions can be set as active');
					}
				}

				// Auto-close re-evaluation when setting an active DR
				const supportReEvaluationOpen = args.activeDraftResolutionId
					? false
					: (args.supportReEvaluationOpen ?? undefined);

				await db
					.update(schema.committee)
					.set({
						name: args.name ?? undefined,
						abbreviation: args.abbreviation ?? undefined,
						whiteboardContent: args.whiteboardContent ?? undefined,
						showWhiteboard: args.showWhiteboard ?? undefined,
						status: args.status ?? undefined,
						statusHeadline: args.statusHeadline ?? undefined,
						statusUntil: args.statusUntil ?? undefined,
						stateOfDebate: args.stateOfDebate ?? undefined,
						activeAgendaItemId: args.activeAgendaItemId ?? undefined,
						lastResolutionAdoptionDate: args.lastResolutionAdoptionDate ?? undefined,
						allowDelegationsToAddThemselvesToSpeakersList:
							args.allowDelegationsToAddThemselvesToSpeakersList ?? undefined,
						maxDraftResolutions: args.maxDraftResolutions ?? undefined,
						activeDraftResolutionId: args.clearActiveDraftResolution
							? null
							: (args.activeDraftResolutionId ?? undefined),
						currentOperativeIndex: args.currentOperativeIndex ?? undefined,
						supportReEvaluationOpen
					})
					.where(
						and(
							eq(schema.committee.id, args.id),
							ctx.abilities.committee.filter('update').sql.where
						)
					);

				// Auto-transition active DR to AMENDMENT_PHASE when currentOperativeIndex is set
				if (args.currentOperativeIndex !== undefined && args.currentOperativeIndex !== null) {
					const committee = await db.query.committee.findFirst({
						where: { id: args.id }
					});

					const activeDrId = args.activeDraftResolutionId ?? committee?.activeDraftResolutionId;

					if (activeDrId) {
						const activeDr = await db.query.resolutionPaper.findFirst({
							where: { id: activeDrId }
						});

						if (activeDr && activeDr.status === 'DRAFT_RESOLUTION') {
							await db
								.update(schema.resolutionPaper)
								.set({ status: 'AMENDMENT_PHASE' })
								.where(eq(schema.resolutionPaper.id, activeDrId));

							// Create snapshot
							await db.insert(schema.paperContentSnapshot).values({
								paperId: activeDrId,
								content: activeDr.content,
								trigger: 'AMENDMENT_PHASE'
							});

							paperPubsub.updated(activeDrId);
						}
					}
				}

				if (args.activeAgendaItemId) {
					await db.insert(schema.committeeTopicChangedTimestamp).values({
						committeeId: args.id,
						agendaItemId: args.activeAgendaItemId,
						timestamp: new Date()
					});
				}

				pubsub.updated(args.id);

				return db.query.committee.findFirst(
					query(
						ctx.abilities.committee.filter('read', {
							inject: {
								where: {
									id: args.id
								}
							}
						}).query.single
					)
				);
			}
		})
	};
});
