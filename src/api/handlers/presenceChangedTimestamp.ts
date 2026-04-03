import { abilityBuilder } from '$api/rumble';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('presenceChangedTimestamp');

abilityBuilder.presenceChangedTimestamp.allow(['read']).when(({ mustBeLoggedIn }) => {
	mustBeLoggedIn();
	return 'allow';
});
