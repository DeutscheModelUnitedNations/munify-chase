import { abilityBuilder } from '$api/rumble';
import { basics } from './basics';

const { arg, ref, pubsub, table } = basics('conferenceMember');

abilityBuilder.conferenceMember.allow('read');

export const ConferenceMemberWhereInput = arg;
export const ConferenceMemberRef = ref;
