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
	isAdminInConference,
	isParticipantInConference,
	isTeamInConference,
	linkedDelegator,
	SYNCED_CONFERENCE
} from '#api/services/authHelper';
import {
	assertFindFirstExists,
	assertFirstEntryExists,
	mapNullFieldsToUndefined
} from '@m1212e/rumble';
import { and, count, eq, isNull, type InferSelectModel } from 'drizzle-orm';
import { calculateMajority } from '#lib/utils/majorities';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { NOT_MANAGED_BY_DELEGATOR } from '#api/services/link/managedRows';
import { assertNotManagedByDelegator } from '#api/services/link/managedRows';
import {
	findCommittee,
	findUpdatableConference,
	type HandlerContext
} from './helpers/scopedLookups';

// The linked DELEGATOR reads back the presence of its conferences (`docs/plans/delegator-link.md`).
abilityBuilder.committee.allow('read').when(
	linkedDelegator({
		where: { conference: SYNCED_CONFERENCE },
		columns: { id: true, conferenceId: true }
	})
);

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
	// a committee synced from a linked DELEGATOR is removed there
	return { where: { ...isAdminInConference(ctx), ...NOT_MANAGED_BY_DELEGATOR } };
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
		}),
		paperSupportThreshold: t.field({
			type: 'Int',
			resolve: async (parent) => {
				const total = await getTotalPresentCount(parent as CommitteeParentWithOptionalMembers);
				return Math.ceil(total * (parent.paperSupportThreshold / 100));
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

async function readableCommittee(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.committee.filter('read')).merge({ where: { id } }).query.single;
}

/** Writes to a committee the caller may change and announces it. */
async function updateCommittee({
	ctx,
	committeeId,
	set
}: {
	ctx: HandlerContext;
	committeeId: string;
	set: Partial<typeof schema.committee.$inferInsert>;
}) {
	await db
		.update(schema.committee)
		.set(set)
		.where(
			(await ctx.abilities.committee.filter('update')).merge({ where: { id: committeeId } }).sql
				.where
		);
	pubsub.updated(committeeId);
	return readableCommittee(ctx, committeeId);
}

/** Only a submitted paper of the active agenda item can go on the beamer. */
async function assertMayPresentPaper({
	paperId,
	committeeId
}: {
	paperId: string;
	committeeId: string;
}) {
	const paper = await db.query.resolutionPaper
		.findFirst({ where: { id: paperId, committeeId } })
		.then(assertFindFirstExists);
	const committee = await findCommittee(committeeId);

	if (paper.status === 'WORKING_PAPER') {
		throw new GraphQLError(
			'Working papers cannot be set as active, the paper must be submitted or promoted first'
		);
	}
	if (committee.activeAgendaItemId && paper.agendaItemId !== committee.activeAgendaItemId) {
		throw new GraphQLError(
			'Only papers belonging to the currently active agenda item may be set as active'
		);
	}
}

/**
 * An amendment goes on the beamer only for the committee's selected draft resolution; the first
 * time it does is stamped as presentedAt.
 */
async function presentAmendment({
	amendmentId,
	committeeId
}: {
	amendmentId: string;
	committeeId: string;
}) {
	const committee = await findCommittee(committeeId);
	if (!committee.activeDraftResolutionId) {
		throw new GraphQLError('No active draft resolution selected');
	}
	await db.query.amendment
		.findFirst({ where: { id: amendmentId, paperId: committee.activeDraftResolutionId } })
		.then(assertFindFirstExists);

	await db
		.update(schema.amendment)
		.set({ presentedAt: new Date() })
		.where(and(eq(schema.amendment.id, amendmentId), isNull(schema.amendment.presentedAt)));
}

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
				await findUpdatableConference(ctx, args.conferenceId);

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
					.findFirst(query(await readableCommittee(ctx, result.id)))
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
						(await ctx.abilities.committee.filter('delete')).merge({ where: { id: args.id } }).sql
							.where
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
				allowRequests: t.arg.boolean(),
				presentationLayout: t.arg.string(),
				presentationRootFontSize: t.arg.int(),
				presentationResolutionFontSize: t.arg.int(),
				displayRegionalGroups: t.arg.boolean(),
				presentationShowRequests: t.arg.boolean()
			},
			resolve: async (query, _root, args, ctx) => {
				// the name and abbreviation of a committee from DELEGATOR are changed there
				const row = await db.query.committee.findFirst({
					where: { id: args.id },
					columns: { managedByDelegator: true }
				});
				assertNotManagedByDelegator({
					managed: row?.managedByDelegator,
					touchesDelegatorFields: args.name != null || args.abbreviation != null
				});
				const { id, ...fields } = mapNullFieldsToUndefined(args);
				await db.transaction(async (tx) => {
					await tx
						.update(schema.committee)
						.set(fields)
						.where(
							(await ctx.abilities.committee.filter('update')).merge({ where: { id } }).sql.where
						);

					if (args.activeAgendaItemId) {
						await tx.insert(schema.committeeTopicChangedTimestamp).values({
							committeeId: id,
							agendaItemId: args.activeAgendaItemId,
							timestamp: new Date()
						});
					}
				});

				pubsub.updated(id);

				return db.query.committee
					.findFirst(query(await readableCommittee(ctx, id)))
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
					await assertMayPresentPaper({ paperId: args.paperId, committeeId: args.committeeId });
				}
				const filter = await updateCommittee({
					ctx,
					committeeId: args.committeeId,
					set: { activeDraftResolutionId: args.paperId ?? null, activeAmendmentId: null }
				});
				return db.query.committee.findFirst(query(filter)).then(assertFindFirstExists);
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
					await presentAmendment({ amendmentId: args.amendmentId, committeeId: args.committeeId });
				}
				const filter = await updateCommittee({
					ctx,
					committeeId: args.committeeId,
					set: { activeAmendmentId: args.amendmentId ?? null }
				});
				return db.query.committee.findFirst(query(filter)).then(assertFindFirstExists);
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
				const { committeeId, ...toggles } = mapNullFieldsToUndefined(args);
				const filter = await updateCommittee({ ctx, committeeId, set: toggles });
				return db.query.committee.findFirst(query(filter)).then(assertFindFirstExists);
			}
		})
	};
});
