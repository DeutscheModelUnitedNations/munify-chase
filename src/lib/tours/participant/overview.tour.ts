import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Participant conference overview for NSAs and visitors. Anchors live in the page. */
export const tour: Tour = {
	id: 'participant.overview',
	steps: [
		{
			title: () => m.tourParticipantOverviewIntroTitle(),
			body: () => m.tourParticipantOverviewIntroBody()
		},
		{
			anchor: 'overview.identity',
			title: () => m.tourParticipantOverviewIdentityTitle(),
			body: () => m.tourParticipantOverviewIdentityBody(),
			side: 'bottom'
		},
		{
			anchor: 'overview.attendance',
			title: () => m.tourParticipantOverviewAttendanceTitle(),
			body: () => m.tourParticipantOverviewAttendanceBody(),
			side: 'bottom'
		},
		{
			anchor: 'overview.committees',
			title: () => m.tourParticipantOverviewCommitteesTitle(),
			body: () => m.tourParticipantOverviewCommitteesBody(),
			side: 'top'
		}
	]
};
