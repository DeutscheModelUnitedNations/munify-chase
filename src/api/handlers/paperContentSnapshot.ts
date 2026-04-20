import { abilityBuilder } from '$api/rumble';
import { basics } from './basics';
import { isGlobalAdmin } from '$api/services/authHelper';

const { ref, pubsub, table } = basics('paperContentSnapshot');

abilityBuilder.paperContentSnapshot.allow('read').when((ctx) => {
	if (isGlobalAdmin(ctx)) return 'allow';
});

abilityBuilder.paperContentSnapshot.allow('read').when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});
