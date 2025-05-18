import { abilityBuilder } from '$api/rumble';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('conference');

export const ConferenceRef = ref;

abilityBuilder.conference.allow('read');
// .when(({ user }) => {
// 	if (user) {
// 		return {};
// 	}
// });
