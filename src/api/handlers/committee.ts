import { db } from '$api/db/db';
import { abilityBuilder, enum_, schemaBuilder } from '$api/rumble';
import { and, eq } from 'drizzle-orm';
import { basics } from './basics';
import { assertFindFirstExists } from '@m1212e/rumble';

const { arg, ref, pubsub, table } = basics('committee');
const statusEnum = enum_({
	enumVariableName: 'committeeStatus'
});

abilityBuilder.committee.allow('read');

schemaBuilder.mutationFields((t) => {
	return {
		updateCommittee: t.drizzleField({
			type: ref,
			args: {
				id: t.arg.id({ required: true }),
				//TODO do we want to allow updates to these defaults?
				// e.g. abbreviation and name probably are pretty static...
				// name: t.arg.string(),
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
				activeAgendaItemId: t.arg.id()
			},
			resolve: async (query, root, args, ctx, info) => {
				await db
					.update(table)
					.set({
						whiteboardContent: args.whiteboardContent ?? undefined,
						showWhiteboard: args.showWhiteboard ?? undefined,
						status: args.status ?? undefined,
						statusHeadline: args.statusHeadline ?? undefined,
						statusUntil: args.statusUntil ?? undefined,
						stateOfDebate: args.stateOfDebate ?? undefined,
						activeAgendaItemId: args.activeAgendaItemId ?? undefined
					})
					.where(and(eq(table.id, args.id), ctx.abilities.committee.filter('update').single.where));

				pubsub.updated(args.id);

				return db.query.committee
					.findFirst(
						query(
							ctx.abilities.committee.filter('read', {
								inject: { where: { id: eq(table.id, args.id) } }
							}).single
						)
					)
					.then(assertFindFirstExists);
			}
		})
	};
});
