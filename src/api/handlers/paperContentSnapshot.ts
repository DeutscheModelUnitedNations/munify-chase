import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import { isTeamInConference } from '$api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { nanoid, nanoidValidation } from '$lib/helpers/nanoid';
import { GraphQLError } from 'graphql';
import { applyServerMutation, readPaperJson } from '$api/yjs/server';
import { replaceResolution } from '@deutschemodelunitednations/munify-resolution-editor/yjs';
import type { Resolution } from '@deutschemodelunitednations/munify-resolution-editor/schema';

// Snapshots are immutable: read-only at the ability level. The create/
// restore mutations gate authorization on `resolutionPaper.update` (chair).
abilityBuilder.paperContentSnapshot.allow('read').when((ctx) => {
	return {
		where: {
			paper: { committee: isTeamInConference(ctx) }
		}
	};
});

const ref = object({ table: 'paperContentSnapshot' });
query({ table: 'paperContentSnapshot' });
const pubsub = rumblePubsub({ table: 'paperContentSnapshot' });

schemaBuilder.mutationFields((t) => ({
	createManualSnapshot: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			paperId: t.arg.id({ required: true })
		},
		resolve: async (query, _root, args, ctx) => {
			await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({ where: { id: args.paperId } })
						.query.single
				)
				.then(assertFindFirstExists);

			const content = await readPaperJson(args.paperId);
			await db.insert(schema.paperContentSnapshot).values({
				id: args.id,
				paperId: args.paperId,
				content,
				trigger: 'MANUAL'
			});

			pubsub.created();

			return db.query.paperContentSnapshot
				.findFirst(
					query(
						ctx.abilities.paperContentSnapshot.filter('read').merge({ where: { id: args.id } })
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
				.findFirst(
					ctx.abilities.paperContentSnapshot.filter('read').merge({
						where: { id: args.snapshotId }
					}).query.single
				)
				.then(assertFindFirstExists);

			await db.query.resolutionPaper
				.findFirst(
					ctx.abilities.resolutionPaper.filter('update').merge({
						where: { id: snapshot.paperId }
					}).query.single
				)
				.then(assertFindFirstExists);

			const currentContent = await readPaperJson(snapshot.paperId);
			await db.insert(schema.paperContentSnapshot).values({
				id: nanoid(),
				paperId: snapshot.paperId,
				content: currentContent,
				trigger: 'MANUAL'
			});

			let parsed: Resolution;
			try {
				parsed = JSON.parse(snapshot.content) as Resolution;
			} catch {
				throw new GraphQLError('Snapshot content is invalid JSON, cannot restore');
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
