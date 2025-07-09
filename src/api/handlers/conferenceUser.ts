import { abilityBuilder } from '$api/rumble';
import { eq } from 'drizzle-orm';
import { basics } from './basics';
import { schema } from '$api/db/db';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';

const { arg, ref, pubsub, table } = basics('conferenceUser');

abilityBuilder.conferenceUser.allow('read').when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

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
