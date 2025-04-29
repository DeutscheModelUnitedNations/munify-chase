import { abilityBuilder } from '$api/rumble';
import { eq } from 'drizzle-orm';
import { basics } from './basics';
import { schema } from '$api/db/db';

const { arg, ref, pubsub, table } = basics('conferenceUser');

abilityBuilder.conferenceUser.allow('read');

// abilityBuilder.conferenceUser.allow('read').when(({ user }) => {
// 	if (user) {
// 		return {
// 			where: eq(schema.conferenceUser.id, user.sub)
// 		};
// 	}
// });

// abilityBuilder.conferenceUser.allow('read').when(({ user }) => {
// 	// TODO
// 	if (user) {
// 		return {};
// 	}
// });
