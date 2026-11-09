import { pubsub } from '#api/rumble';

/** The link row's announcements, shared by the pairing and the link worker. */
export const instanceLinkPubsub = pubsub({ table: 'instanceLink' });
