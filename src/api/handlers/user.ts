import { schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { basics } from './basics';
import { and, eq } from 'drizzle-orm';

const { arg, ref, pubsub, table } = basics('user');

// abilityBuilder.user.allow('read').when(({ oidc }) => {
// 	if (oidc?.user) {
// 		return {
// 			where: { id: oidc.user.sub }
// 		};
// 	}
// });

abilityBuilder.user.allow('read');
// .when(({ mustBeLoggedIn }) => {
// 	const user = mustBeLoggedIn();
// 	if (user?.email && isDMUNEmail(user.email)) {
// 		console.log("allowed");
// 		return 'allow';
// 	}
// });
