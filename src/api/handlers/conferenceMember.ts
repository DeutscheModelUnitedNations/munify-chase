import { abilityBuilder } from '$api/rumble';
import { isWhitelistedEmail } from '$api/services/isDMUNEmail';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('conferenceMember');

abilityBuilder.conferenceMember.allow('read').when(({ mustBeLoggedIn }) => {
	const user = mustBeLoggedIn();
	if (user?.email && isWhitelistedEmail(user.email)) {
		return 'allow';
	}
});

abilityBuilder.conferenceMember.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

export const ConferenceMemberWhereInput = arg;
export const ConferenceMemberRef = ref;
