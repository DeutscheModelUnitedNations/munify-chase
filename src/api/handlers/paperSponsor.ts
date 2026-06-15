import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import {
	isParticipantInConference,
	isTeamInConference,
	isGlobalAdmin
} from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.paperSponsor.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.paperSponsor.allow('read').when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
		}
	};
});

abilityBuilder.paperSponsor.allow(['update', 'delete']).when((ctx) => {
	return {
		where: {
			paper: { committee: isTeamInConference(ctx) }
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
			id: t.arg.id(),
			paperId: t.arg.id({ required: true }),
			committeeMemberId: t.arg.id()
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			const paper = await db.query.resolutionPaper
				.findFirst({
					where: { id: args.paperId },
					with: { committee: true }
				})
				.then(assertFindFirstExists);

			let committeeMemberId = args.committeeMemberId;
			const user = ctx.mustBeLoggedIn();
			const isChair = !!(await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					conference: { committees: { id: paper.committeeId } },
					conferenceUserType: { in: ['ADMIN', 'TEAM'] }
				}
			}));

			if (!committeeMemberId) {
				if (!user.email) throw new GraphQLError('User email required');
				const cu = await db.query.conferenceUser
					.findFirst({
						where: { userEmail: user.email, committeeMember: { committeeId: paper.committeeId } },
						with: { committeeMember: true }
					})
					.then(assertFindFirstExists);
				if (!cu.committeeMember) throw new GraphQLError('Not a committee member');
				committeeMemberId = cu.committeeMember.id;
			}

			// Permission window: delegates can sponsor when paper is WORKING_PAPER /
			// SUBMITTED, or while support re-eval is open. Chairs always.
			if (!isChair) {
				const allow =
					paper.status === 'WORKING_PAPER' ||
					paper.status === 'SUBMITTED' ||
					paper.committee.supportReevaluationOpen;
				if (!allow) {
					throw new GraphQLError('Sponsoring is not open for this paper');
				}
			}

			await db
				.insert(schema.paperSponsor)
				.values({
					id: entityId,
					paperId: args.paperId,
					committeeMemberId
				})
				.onConflictDoNothing();

			pubsub.created();

			return db.query.paperSponsor
				.findFirst(
					query(
						ctx.abilities.paperSponsor.filter('read').merge({
							where: { paperId: args.paperId, committeeMemberId }
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
				.findFirst({
					where: { id: args.id },
					with: { paper: true, committeeMember: { with: { users: true } } }
				})
				.then(assertFindFirstExists);

			const user = ctx.mustBeLoggedIn();
			const isChair = !!(await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					conference: { committees: { id: sponsor.paper.committeeId } },
					conferenceUserType: { in: ['ADMIN', 'TEAM'] }
				}
			}));
			const isSelf = sponsor.committeeMember.users.some((u) => u.userEmail === user.email);

			if (!isSelf && !isChair && !isGlobalAdmin(ctx)) {
				throw new GraphQLError('Only the sponsor or a chair can remove a sponsor');
			}

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
