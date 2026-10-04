import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Chair speakers list page. Anchors live in the page and in ChairControls. */
export const chairSpeakersListTour: Tour = {
	id: 'chair.speakers-list',
	steps: [
		{
			title: () => m.tourSpeakersListIntroTitle(),
			body: () => m.tourSpeakersListIntroBody()
		},
		{
			anchor: 'speakers-list.current-speaker',
			title: () => m.tourSpeakersListCurrentTitle(),
			body: () => m.tourSpeakersListCurrentBody()
		},
		{
			anchor: 'speakers-list.timer',
			title: () => m.tourSpeakersListTimerTitle(),
			body: () => m.tourSpeakersListTimerBody()
		},
		{
			anchor: 'speakers-list.queue-controls',
			title: () => m.tourSpeakersListNextTitle(),
			body: () => m.tourSpeakersListNextBody()
		},
		{
			anchor: 'speakers-list.add-speakers',
			title: () => m.tourSpeakersListAddTitle(),
			body: () => m.tourSpeakersListAddBody()
		},
		{
			anchor: 'speakers-list.queue',
			title: () => m.tourSpeakersListQueueTitle(),
			body: () => m.tourSpeakersListQueueBody(),
			side: 'top'
		},
		{
			anchor: 'speakers-list.comment-list',
			title: () => m.tourSpeakersListCommentTitle(),
			body: () => m.tourSpeakersListCommentBody(),
			side: 'left'
		}
	]
};
