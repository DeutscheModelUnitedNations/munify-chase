import { abilityBuilder } from '$api/rumble';
import { basics } from './basics';
import { isGlobalAdmin } from '$api/services/isAdminEmail';

const { ref, pubsub, table } = basics('resolutionVoteResult');

abilityBuilder.resolutionVoteResult.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.resolutionVoteResult.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});
