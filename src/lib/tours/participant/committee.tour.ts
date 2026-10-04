import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Participant committee dashboard. Anchors live in the page. */
export const tour: Tour = {
	id: 'participant.committee',
	steps: [
		{
			title: () => m.tourParticipantCommitteeIntroTitle(),
			body: () => m.tourParticipantCommitteeIntroBody()
		},
		{
			anchor: 'committee.status',
			title: () => m.tourParticipantCommitteeStatusTitle(),
			body: () => m.tourParticipantCommitteeStatusBody(),
			side: 'bottom'
		},
		{
			anchor: 'committee.majorities',
			title: () => m.tourParticipantCommitteeMajoritiesTitle(),
			body: () => m.tourParticipantCommitteeMajoritiesBody(),
			side: 'bottom'
		},
		{
			anchor: 'committee.speakers',
			title: () => m.tourParticipantCommitteeSpeakersTitle(),
			body: () => m.tourParticipantCommitteeSpeakersBody(),
			side: 'top'
		},
		{
			anchor: 'committee.self-add',
			title: () => m.tourParticipantCommitteeSelfAddTitle(),
			body: () => m.tourParticipantCommitteeSelfAddBody(),
			side: 'top'
		},
		{
			anchor: 'committee.requests',
			title: () => m.tourParticipantCommitteeRequestsTitle(),
			body: () => m.tourParticipantCommitteeRequestsBody(),
			side: 'top'
		},
		{
			anchor: 'committee.resolutions',
			title: () => m.tourParticipantCommitteeResolutionsTitle(),
			body: () => m.tourParticipantCommitteeResolutionsBody(),
			side: 'top'
		},
		{
			anchor: 'committee.whiteboard',
			title: () => m.tourParticipantCommitteeWhiteboardTitle(),
			body: () => m.tourParticipantCommitteeWhiteboardBody(),
			side: 'top'
		}
	]
};
