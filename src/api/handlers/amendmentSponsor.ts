import { abilityBuilder } from '$api/rumble';
import { basics } from './basics';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';

const { arg, ref, pubsub, table } = basics('amendmentSponsor');

abilityBuilder.amendmentSponsor.allow('read').when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

abilityBuilder.amendmentSponsor.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});
