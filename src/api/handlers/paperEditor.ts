import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import {
	isParticipantInConference,
	isTeamInConference,
	isGlobalAdmin
} from '$api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';

abilityBuilder.paperEditor.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.paperEditor.allow('read').when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
		}
	};
});

abilityBuilder.paperEditor.allow(['update', 'delete']).when((ctx) => {
	return {
		where: {
			paper: { committee: isTeamInConference(ctx) }
		}
	};
});

const ref = object({ table: 'paperEditor' });
query({ table: 'paperEditor' });
const pubsub = rumblePubsub({ table: 'paperEditor' });

schemaBuilder.mutationFields((t) => ({
	removePaperEditor: t.field({
		type: 'Boolean',
		args: { id: t.arg.id({ required: true }) },
		resolve: async (_root, args, ctx) => {
			const editor = await db.query.paperEditor
				.findFirst({
					where: { id: args.id },
					with: { paper: true, conferenceUser: true }
				})
				.then(assertFindFirstExists);

			const user = ctx.mustBeLoggedIn();
			const isSelf = editor.conferenceUser.userEmail === user.email;
			const isChair = !!(await db.query.conferenceUser.findFirst({
				where: {
					user: { id: user.sub },
					conference: { committees: { id: editor.paper.committeeId } },
					conferenceUserType: { in: ['ADMIN', 'TEAM'] }
				}
			}));

			if (!isSelf && !isChair && !isGlobalAdmin(ctx)) {
				throw new GraphQLError('Only the editor themselves or a chair can remove an editor');
			}

			await db
				.delete(schema.paperEditor)
				.where(
					ctx.abilities.paperEditor.filter('delete').merge({ where: { id: args.id } }).sql.where
				);
			pubsub.removed();
			return true;
		}
	}),

	addPaperEditor: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id(),
			paperId: t.arg.id({ required: true }),
			conferenceUserId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();

			// Only chairs can directly add editors. Self-add happens via share code.
			const paper = await db.query.resolutionPaper
				.findFirst({ where: { id: args.paperId } })
				.then(assertFindFirstExists);
			if (!isGlobalAdmin(ctx)) {
				const user = ctx.mustBeLoggedIn();
				const chair = await db.query.conferenceUser.findFirst({
					where: {
						user: { id: user.sub },
						conference: { committees: { id: paper.committeeId } },
						conferenceUserType: { in: ['ADMIN', 'TEAM'] }
					}
				});
				if (!chair) throw new GraphQLError('Chair access required');
			}

			await db
				.insert(schema.paperEditor)
				.values({
					id: entityId,
					paperId: args.paperId,
					conferenceUserId: args.conferenceUserId
				})
				.onConflictDoNothing();

			pubsub.created();

			return db.query.paperEditor
				.findFirst(
					query(
						ctx.abilities.paperEditor.filter('read').merge({
							where: { paperId: args.paperId, conferenceUserId: args.conferenceUserId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));

void assertFirstEntryExists;
