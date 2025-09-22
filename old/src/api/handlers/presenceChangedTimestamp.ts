import { abilityBuilder } from '$api/rumble';
import { isDMUNEmail } from '$api/services/isDMUNEmail';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('presenceChangedTimestamp');

abilityBuilder.presenceChangedTimestamp.allow(['read']).when(({ hasRole }) => {
	if (hasRole('admin')) {
		return 'allow';
	}
});
