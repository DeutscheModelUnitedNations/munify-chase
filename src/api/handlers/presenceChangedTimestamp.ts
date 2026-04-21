import { abilityBuilder, object, pubsub as rumblePubsub, query } from '$api/rumble';

abilityBuilder.presenceChangedTimestamp.allow(['read']).when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});

object({ table: 'presenceChangedTimestamp' });
const pubsub = rumblePubsub({ table: 'presenceChangedTimestamp' });
query({ table: 'presenceChangedTimestamp' });
