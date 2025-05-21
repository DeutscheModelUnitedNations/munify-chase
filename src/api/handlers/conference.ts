import { db } from '$api/db/db';
import {
	abilityBuilder,
	enum_,
	object,
	query,
	pubsub as rumblePubsub,
	schemaBuilder,
	arg as rumbleArg
} from '$api/rumble';
import { and, eq } from 'drizzle-orm';

abilityBuilder.conference.allow('read');
// .when(({ user }) => {
// 	if (user) {
// 		return {};
// 	}
// });

const ref = object({
	table: 'conference'
	// adjust: (t) => ({
	// 	nonStateActors: t.relation('members', {
	// 		args: {
	// 			where: t.arg({
	// 				type: 'ConferenceMemberWhereInput',
	// 				required: false
	// 			})
	// 		},
	// 		nullable: false,
	// 		query: (args, ctx) => {
	// 			// const queryFilter = ctx.abilities.conferenceMember.filter('read').query.many;

	// 			// filter the query
	// 			// ...

	// 			return db.query.conferenceMember.findMany({
	// 				where: {
	// 					AND: [{

	// 					}]
	// 				}
	// 			});
	// 		}
	// 	})
	// })
});

const pubsub = rumblePubsub({ table: 'committee' });
const arg = rumbleArg({ table: 'committee' });
query({
	table: 'conference'
});

export const ConferenceRef = ref;
