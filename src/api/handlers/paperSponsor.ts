import { db, schema } from '#api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '#api/rumble';
import { isParticipantInConference, isTeamInConference } from '#api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { chairsCommittee, paperWithAbility, type ResolverContext } from './helpers/paperAccess';
import { assertSponsoringOpen, chairNamedMember } from './helpers/paperRules';

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

/** The caller's own seat in the paper's committee, while the paper takes sponsors. */
async function ownSponsoringMember({
	ctx,
	paper
}: {
	ctx: ResolverContext;
	paper: { id: string; status: Parameters<typeof assertSponsoringOpen>[0] };
}) {
	const user = ctx.mustBeLoggedIn();
	if (!user.email) throw new GraphQLError('User email required');
	const committeeMember = await db.query.committeeMember
		.findFirst({
			where: {
				users: { userEmail: user.email },
				committee: { resolutionPapers: { id: paper.id } }
			}
		})
		.then(assertFindFirstExists);
	assertSponsoringOpen(paper.status);
	return committeeMember.id;
}

schemaBuilder.mutationFields((t) => ({
	addPaperSponsor: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			paperId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id()
		},
		resolve: async (query, _root, args, ctx) => {
			const paper = await paperWithAbility({ ctx, paperId: args.paperId, action: 'read' });

			const committeeMemberId = (await chairsCommittee({ ctx, committeeId: paper.committeeId }))
				? chairNamedMember({
						committeeMemberId: args.committeeMemberId,
						missing: 'Committee member ID required for chair sponsorship'
					})
				: await ownSponsoringMember({ ctx, paper });

			const createdId = await db
				.insert(schema.paperSponsor)
				.values({ id: args.id, paperId: args.paperId, committeeMemberId })
				.returning({ id: schema.paperSponsor.id })
				.onConflictDoNothing()
				.then(assertFirstEntryExists)
				.then((p) => p.id);
			pubsub.created();

			return db.query.paperSponsor
				.findFirst(
					query(
						(await ctx.abilities.paperSponsor.filter('read')).merge({
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
			const sponsor = await db.query.paperSponsor
				.findFirst({ where: { id: args.id }, with: { paper: true } })
				.then(assertFindFirstExists);

			if (!(await chairsCommittee({ ctx, committeeId: sponsor.paper.committeeId }))) {
				assertSponsoringOpen(sponsor.paper.status);
			}

			await db
				.delete(schema.paperSponsor)
				.where(
					(await ctx.abilities.paperSponsor.filter('delete')).merge({ where: { id: args.id } }).sql
						.where
				);
			pubsub.removed();
			return true;
		}
	})
}));
