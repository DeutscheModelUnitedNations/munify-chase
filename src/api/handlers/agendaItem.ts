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
import { and, count, eq, type InferSelectModel } from 'drizzle-orm';

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
