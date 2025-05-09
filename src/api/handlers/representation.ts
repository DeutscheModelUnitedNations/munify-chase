import { abilityBuilder } from '$api/rumble';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('representation');

abilityBuilder.representation.allow(['read', 'update']);
