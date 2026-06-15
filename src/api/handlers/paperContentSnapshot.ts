import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import { isParticipantInConference, isGlobalAdmin } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, isValidNanoid } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { applyServerMutation, readPaperJson } from '$api/yjs/server';
import { replaceResolution } from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import type { Resolution } from '@deutschemodelunitednations/munify-resolution-editor/schema';

abilityBuilder.paperContentSnapshot.allow(['read', 'update', 'delete']).when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.paperContentSnapshot.allow('read').when((ctx) => {
	return {
		where: {
			paper: { committee: isParticipantInConference(ctx) }
		}
	};
});

const ref = object({ table: 'paperContentSnapshot' });
query({ table: 'paperContentSnapshot' });
const pubsub = rumblePubsub({ table: 'paperContentSnapshot' });

async function ensureChairOfPaper(
	ctx: {
		mustBeLoggedIn: () => { sub: string };
		hasRole: (r: string) => boolean;
	},
	paperId: string
) {
	if (isGlobalAdmin(ctx)) return;
	const user = ctx.mustBeLoggedIn();
	const paper = await db.query.resolutionPaper
		.findFirst({ where: { id: paperId } })
		.then(assertFindFirstExists);
	const chair = await db.query.conferenceUser.findFirst({
		where: {
			user: { id: user.sub },
			conference: { committees: { id: paper.committeeId } },
			conferenceUserType: { in: ['ADMIN', 'TEAM'] }
		}
	});
	if (!chair) throw new GraphQLError('Chair access required');
}

schemaBuilder.mutationFields((t) => ({
	createManualSnapshot: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id(),
			paperId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			if (args.id != null && !isValidNanoid(args.id)) {
				throw new GraphQLError('Invalid ID format');
			}
			const entityId = args.id ?? nanoid();
			await ensureChairOfPaper(ctx, args.paperId);

			const content = await readPaperJson(args.paperId);
			await db.insert(schema.paperContentSnapshot).values({
				id: entityId,
				paperId: args.paperId,
				content,
				trigger: 'MANUAL'
			});

			pubsub.created();

			return db.query.paperContentSnapshot
				.findFirst(
					query(
						ctx.abilities.paperContentSnapshot.filter('read').merge({ where: { id: entityId } })
							.query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),

	restorePaperFromSnapshot: t.drizzleField({
		type: ref,
		args: {
			snapshotId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			const snapshot = await db.query.paperContentSnapshot
				.findFirst({ where: { id: args.snapshotId } })
				.then(assertFindFirstExists);
			await ensureChairOfPaper(ctx, snapshot.paperId);

			// 1. Snapshot the current state first so the restore can be undone.
			const currentContent = await readPaperJson(snapshot.paperId);
			await db.insert(schema.paperContentSnapshot).values({
				id: nanoid(),
				paperId: snapshot.paperId,
				content: currentContent,
				trigger: 'MANUAL'
			});

			// 2. Apply the chosen snapshot to the Y.Doc.
			let parsed: Resolution;
			try {
				parsed = JSON.parse(snapshot.content) as Resolution;
			} catch {
				throw new GraphQLError('Snapshot content is invalid JSON — cannot restore');
			}
			await applyServerMutation(snapshot.paperId, (doc) => {
				replaceResolution(doc, parsed);
			});

			pubsub.created();

			return db.query.paperContentSnapshot
				.findFirst(
					query(
						ctx.abilities.paperContentSnapshot.filter('read').merge({
							where: { id: args.snapshotId }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
