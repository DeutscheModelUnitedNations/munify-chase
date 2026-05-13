import { abilityBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isGlobalAdmin } from '$api/services/authHelper';

abilityBuilder.resolutionVoteResult.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.resolutionVoteResult.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

object({ table: 'resolutionVoteResult' });
const pubsub = rumblePubsub({ table: 'resolutionVoteResult' });
query({ table: 'resolutionVoteResult' });
