import { db, schema } from '$api/db/db';
import { abilityBuilder, object, query, pubsub as rumblePubsub, schemaBuilder } from '$api/rumble';
import { nanoid } from '$lib/helpers/nanoid';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { isParticipantInConference } from '$api/services/authHelper';

abilityBuilder.agendaItem.allow('read').when((ctx) => {
	return {
		where: {
			committee: isParticipantInConference(ctx)
		}
	};
});

const ref = object({
	table: 'agendaItem',
	adjust: (t) => ({
		isActive: t.field({
			type: 'Boolean',
			resolve: async (parent, args, context, info) => {
				const res = await db.query.committee
					.findFirst({
						where: { activeAgendaItemId: parent.id }
					})
					.then((r) => {
						return !!r;
					});
				return res;
			}
		})
	})
});
const pubsub = rumblePubsub({ table: 'agendaItem' });
query({
	table: 'agendaItem'
});

schemaBuilder.mutationFields((t) => {
	return {
		createAgendaItem: t.drizzleField({
			type: ref,
			args: {
				title: t.arg({ type: 'String', required: true }),
				committeeId: t.arg({ type: 'ID', required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				await db.query.committee
					.findFirst(
						ctx.abilities.committee.filter('update').merge({
							where: { id: args.committeeId }
						}).query.single
					)
					.then(assertFindFirstExists);

				return await db.transaction(async (tx) => {
					const res = await tx
						.insert(schema.agendaItem)
						.values({
							title: args.title,
							committeeId: args.committeeId,
							id: nanoid()
						})
						.returning()
						.then(assertFirstEntryExists);

					pubsub.updated(res.id);

					await tx.insert(schema.speakersList).values({
						agendaItemId: res.id,
						id: nanoid(),
						type: 'SPEAKERS_LIST',
						speakingTime: 180
					});

					await tx.insert(schema.speakersList).values({
						agendaItemId: res.id,
						id: nanoid(),
						type: 'COMMENT_LIST',
						speakingTime: 30
					});

					return await tx.query.agendaItem
						.findFirst(
							query(
								ctx.abilities.agendaItem.filter('read').merge({
									where: { id: res.id }
								}).query.single
							)
						)
						.then(assertFindFirstExists);
				});
			}
		})
	};
});
