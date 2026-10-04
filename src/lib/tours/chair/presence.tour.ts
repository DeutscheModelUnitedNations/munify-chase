import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Chair presence page. Anchors live in the presence +page.svelte and NsaAttendanceCard. */
export const tour: Tour = {
	id: 'chair.presence',
	steps: [
		{
			title: () => m.tourPresenceIntroTitle(),
			body: () => m.tourPresenceIntroBody()
		},
		{
			anchor: 'presence.roll-call',
			title: () => m.tourPresenceRollCallTitle(),
			body: () => m.tourPresenceRollCallBody(),
			side: 'right'
		},
		{
			anchor: 'presence.bulk-actions',
			title: () => m.tourPresenceBulkTitle(),
			body: () => m.tourPresenceBulkBody(),
			side: 'right'
		},
		{
			anchor: 'presence.nsa',
			title: () => m.tourPresenceNsaTitle(),
			body: () => m.tourPresenceNsaBody(),
			side: 'left'
		},
		{
			anchor: 'presence.delegations',
			title: () => m.tourPresenceDelegationsTitle(),
			body: () => m.tourPresenceDelegationsBody(),
			side: 'left'
		},
		{
			anchor: 'presence.un-actors',
			title: () => m.tourPresenceUnActorsTitle(),
			body: () => m.tourPresenceUnActorsBody(),
			side: 'left'
		}
	]
};
