import { abilityBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';

// abilityBuilder.resolutionVoteResult.allow('read').when((ctx) => {
// 	if (isGlobalAdmin(ctx)) return 'allow';
// });

abilityBuilder.resolutionVoteResult.allow('read').when(({ mustBeLoggedIn }) => {
	const _user = mustBeLoggedIn();
	return 'allow';
});

object({ table: 'resolutionVoteResult' });
rumblePubsub({ table: 'resolutionVoteResult' });
query({ table: 'resolutionVoteResult' });
