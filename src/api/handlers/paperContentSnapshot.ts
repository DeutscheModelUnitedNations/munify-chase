import { abilityBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';
import { isGlobalAdmin } from '$api/services/authHelper';

abilityBuilder.paperContentSnapshot.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.paperContentSnapshot.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

object({ table: 'paperContentSnapshot' });
const pubsub = rumblePubsub({ table: 'paperContentSnapshot' });
query({ table: 'paperContentSnapshot' });
