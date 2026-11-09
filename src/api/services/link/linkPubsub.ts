import { pubsub } from '#api/rumble';

/** The link row's announcements, shared by the start-up sync and the link worker. */
export const instanceLinkPubsub = pubsub({ table: 'instanceLink' });
