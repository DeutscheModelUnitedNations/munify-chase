import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import { isParticipantInConference, isTeamInConference } from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { nanoidValidation } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.paperSponsor.allow('read').when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
		}
	};
});

abilityBuilder.paperSponsor.allow('delete').when((ctx) => {
	const user = ctx.mustBeLoggedIn();
	return {
		where: {
			OR: [
				{ paper: { committee: isTeamInConference(ctx) } },
				{ committeeMember: { users: { user: { id: user.sub } } } }
			]
		}
	};
});

const ref = object({ table: 'paperSponsor' });
query({ table: 'paperSponsor' });
const pubsub = rumblePubsub({ table: 'paperSponsor' });

schemaBuilder.mutationFields((t) => ({
	addPaperSponsor: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			paperId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id()
		},
		resolve: async (query, _root, args, ctx) => {
			const paper = await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('read').merge({
						where: { id: args.paperId }
					}).query.single
				)
				.then(assertFindFirstExists);

			const isChair = !!(await db.query.committee.findFirst({
				where: { ...isTeamInConference(ctx), id: paper.committeeId }
			}));

			let createdId: string;

			if (isChair) {
				if (!args.committeeMemberId)
					throw new GraphQLError('Committee member ID required for chair sponsorship');
				createdId = await db
					.insert(schema.paperSponsor)
					.values({
						id: args.id,
						paperId: args.paperId,
						committeeMemberId: args.committeeMemberId
					})
					.returning({ id: schema.paperSponsor.id })
					.onConflictDoNothing()
					.then(assertFirstEntryExists)
					.then((p) => p.id);

				pubsub.created();
			} else {
				const committeeMember = await db.query.committeeMember
					.findFirst({
						where: {
							...isParticipantInConference(ctx),
							committee: { resolutionPapers: { id: args.paperId } }
						}
					})
					.then(assertFindFirstExists);

				if (paper.status !== 'WORKING_PAPER' && paper.status !== 'SUBMITTED') {
					throw new GraphQLError('Sponsoring is not open for this paper');
				}

				createdId = await db
					.insert(schema.paperSponsor)
					.values({
						id: args.id,
						paperId: args.paperId,
						committeeMemberId: committeeMember.id
					})
					.returning({ id: schema.paperSponsor.id })
					.onConflictDoNothing()
					.then(assertFirstEntryExists)
					.then((p) => p.id);
			}

			return db.query.paperSponsor
				.findFirst(
					query(
						ctx.abilities.paperSponsor.filter('read').merge({
							where: { id: createdId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	removePaperSponsor: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			await db
				.delete(schema.paperSponsor)
				.where(
					ctx.abilities.paperSponsor.filter('delete').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.removed();
			return true;
		}
	})
}));
