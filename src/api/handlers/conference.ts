import { abilityBuilder } from '$api/rumble';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('conference');

abilityBuilder.conference.allow('read');
// .when(({ user }) => {
// 	if (user) {
// 		return {};
// 	}
// });
