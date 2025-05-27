import { db, schema } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	pubsub as rumblePubsub,
	schemaBuilder,
	arg as rumbleArg
} from '$api/rumble';
import { isDMUNEmail } from '$api/services/isDMUNEmail';
import { assertFirstEntryExists } from '@m1212e/rumble';

const ref = object({
	table: 'agendaItem',
	adjust: (t) => ({
		isActive: t.field({
			type: 'Boolean',
			resolve: async (parent, args, context, info) => {
				const parentId = parent.id;
				const res = await db.query.committee
					.findFirst({
						where: { activeAgendaItemId: parentId }
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
const arg = rumbleArg({ table: 'agendaItem' });
query({
	table: 'agendaItem'
});

abilityBuilder.agendaItem.allow(['read']).when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isDMUNEmail(user.email)) {
		return 'allow';
	}
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
				const res = await db
					.insert(schema.agendaItem)
					.values({
						title: args.title,
						committeeId: args.committeeId,
						id: crypto.randomUUID()
					})
					.returning()
					.then(assertFirstEntryExists);

				pubsub.updated(res.id);

				await db.insert(schema.speakersList).values({
					agendaItemId: res.id,
					id: crypto.randomUUID(),
					type: 'SPEAKERS_LIST',
					speakingTime: 180
				});

				await db.insert(schema.speakersList).values({
					agendaItemId: res.id,
					id: crypto.randomUUID(),
					type: 'COMMENT_LIST',
					speakingTime: 30
				});

				return res;
			}
		})
	};
});
