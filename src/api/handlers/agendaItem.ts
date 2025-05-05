import { abilityBuilder } from '$api/rumble';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('agendaItem');

abilityBuilder.agendaItem.allow(['read']);
