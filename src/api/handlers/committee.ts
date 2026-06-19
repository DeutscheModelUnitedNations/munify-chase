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
	isTeamInConference,
	isAdminInConference,
	isParticipantInConference
} from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { and, count, eq, type InferSelectModel } from 'drizzle-orm';
import { calculateMajority } from '$lib/utils/majorities';
import { nanoidValidation } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.committee.allow('read').when((ctx) => {
	return {
		where: isParticipantInConference(ctx)
	};
});

abilityBuilder.committee.allow('update').when((ctx) => {
	return {
		where: isTeamInConference(ctx)
	};
});

abilityBuilder.committee.allow('delete').when((ctx) => {
	return { where: isAdminInConference(ctx) };
});

type CommitteeParentWithOptionalMembers = InferSelectModel<typeof schema.committee> & {
	members?: (InferSelectModel<typeof schema.committeeMember> & {
		representation: InferSelectModel<typeof schema.representation>;
	})[];
};

const getTotalPresentCount = async (parent: CommitteeParentWithOptionalMembers) => {
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
			resolve: (parent) => getTotalPresentCount(parent as CommitteeParentWithOptionalMembers)
		}),
		simpleMajority: t.field({
			type: 'Int',
			resolve: async (parent) => {
				const custom = parent.customSimpleMajority;
				if (custom) return custom;
				const total = await getTotalPresentCount(parent as CommitteeParentWithOptionalMembers);
				return calculateMajority(total, 'simple');
			}
		}),
		twoThirdsMajority: t.field({
			type: 'Int',
			resolve: async (parent) => {
				const custom = parent.customTwoThirdsMajority;
				if (custom) return custom;
				const total = await getTotalPresentCount(parent as CommitteeParentWithOptionalMembers);
				return calculateMajority(total, 'twoThirds');
			}
		})
	})
});

const statusEnum = enum_({
	tsName: 'committeeStatus'
});

const pubsub = rumblePubsub({ table: 'committee' });
query({
	table: 'committee'
});

schemaBuilder.mutationFields((t) => {
	return {
		createCommittee: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id().validate(nanoidValidation),
				conferenceId: t.arg.id({ required: true }),
				name: t.arg.string({ required: true }),
				abbreviation: t.arg.string({ required: true })
			},
			resolve: async (query, _root, args, ctx) => {

				await db.query.conference
					.findFirst(
						ctx.abilities.conference.filter('update').merge({ where: { id: args.conferenceId } })
							.query.single
					)
					.then(assertFindFirstExists);

				const result = await db
					.insert(schema.committee)
					.values({
						id: args.id,
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
							ctx.abilities.committee.filter('read').merge({
								where: { id: result.id }
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
			resolve: async (_root, args, ctx) => {
				await db
					.delete(schema.committee)
					.where(
						ctx.abilities.committee.filter('delete').merge({ where: { id: args.id } }).sql.where
					);

				pubsub.removed();

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
				allowDelegationsToAddThemselvesToSpeakersList: t.arg.boolean(),
				presentationLayout: t.arg.string(),
				presentationRootFontSize: t.arg.int(),
				presentationResolutionFontSize: t.arg.int(),
				displayRegionalGroups: t.arg.boolean()
			},
			resolve: async (query, _root, args, ctx) => {
				await db.transaction(async (tx) => {
					await tx
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
							allowDelegationsToAddThemselvesToSpeakersList:
								args.allowDelegationsToAddThemselvesToSpeakersList ?? undefined,
							presentationLayout: args.presentationLayout ?? undefined,
							presentationRootFontSize: args.presentationRootFontSize ?? undefined,
							presentationResolutionFontSize: args.presentationResolutionFontSize ?? undefined,
							displayRegionalGroups: args.displayRegionalGroups ?? undefined
						})
						.where(
							ctx.abilities.committee.filter('update').merge({ where: { id: args.id } }).sql.where
						);

					if (args.activeAgendaItemId) {
						await tx.insert(schema.committeeTopicChangedTimestamp).values({
							committeeId: args.id,
							agendaItemId: args.activeAgendaItemId,
							timestamp: new Date()
						});
					}
				});

				pubsub.updated(args.id);

				return db.query.committee
					.findFirst(
						query(
							ctx.abilities.committee.filter('read').merge({
								where: {
									id: args.id
								}
							}).query.single
						)
					)
					.then(assertFindFirstExists);
			}
		}),
		setActiveDraftResolution: t.drizzleField({
			type: ref,
			args: {
				committeeId: t.arg.id({ required: true }),
				paperId: t.arg.id()
			},
			resolve: async (query, _root, args, ctx) => {
				if (args.paperId) {
					const paper = await db.query.resolutionPaper
						.findFirst({ where: { id: args.paperId, committeeId: args.committeeId } })
						.then(assertFindFirstExists);

					const committee = await db.query.committee
						.findFirst({ where: { id: args.committeeId } })
						.then(assertFindFirstExists);

					if (
						committee.activeAgendaItemId &&
						paper.agendaItemId !== committee.activeAgendaItemId
					) {
						throw new GraphQLError(
							'Only papers belonging to the currently active agenda item may be set as active'
						);
					}
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
				pubsub.updated(args.committeeId);
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
			type: ref,
			args: {
				committeeId: t.arg.id({ required: true }),
				amendmentId: t.arg.id()
			},
			resolve: async (query, _root, args, ctx) => {
				if (args.amendmentId) {
					// the amendment must belong to the committee's currently selected draft resolution
					const committee = await db.query.committee
						.findFirst({ where: { id: args.committeeId } })
						.then(assertFindFirstExists);
					if (!committee.activeDraftResolutionId) {
						throw new GraphQLError('No active draft resolution selected');
					}
					await db.query.amendment
						.findFirst({
							where: { id: args.amendmentId, paperId: committee.activeDraftResolutionId }
						})
						.then(assertFindFirstExists);
				}
				await db
					.update(schema.committee)
					.set({ activeAmendmentId: args.amendmentId ?? null })
					.where(
						ctx.abilities.committee.filter('update').merge({ where: { id: args.committeeId } }).sql
							.where
					);
				pubsub.updated(args.committeeId);
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
			type: ref,
			args: {
				committeeId: t.arg.id({ required: true }),
				supportReevaluationOpen: t.arg.boolean(),
				amendmentSubmissionOpen: t.arg.boolean(),
				amendmentSponsoringOpen: t.arg.boolean(),
				currentOperativeIndex: t.arg.int()
			},
			resolve: async (query, _root, args, ctx) => {
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
				pubsub.updated(args.committeeId);
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
	};
});
