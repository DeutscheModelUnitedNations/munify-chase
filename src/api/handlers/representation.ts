import { abilityBuilder } from '$api/rumble';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('representation');

abilityBuilder.representation.allow(['read', 'update']).when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});
