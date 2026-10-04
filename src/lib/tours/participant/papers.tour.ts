import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Participant papers list. Anchors live in the page. */
export const tour: Tour = {
	id: 'participant.papers',
	steps: [
		{
			title: () => m.tourParticipantPapersIntroTitle(),
			body: () => m.tourParticipantPapersIntroBody()
		},
		{
			anchor: 'papers.new',
			title: () => m.tourParticipantPapersNewTitle(),
			body: () => m.tourParticipantPapersNewBody(),
			side: 'bottom'
		},
		{
			anchor: 'papers.redeem',
			title: () => m.tourParticipantPapersRedeemTitle(),
			body: () => m.tourParticipantPapersRedeemBody(),
			side: 'bottom'
		},
		{
			anchor: 'papers.mine',
			title: () => m.tourParticipantPapersMineTitle(),
			body: () => m.tourParticipantPapersMineBody(),
			side: 'top'
		},
		{
			anchor: 'papers.submitted',
			title: () => m.tourParticipantPapersSubmittedTitle(),
			body: () => m.tourParticipantPapersSubmittedBody(),
			side: 'top'
		},
		{
			anchor: 'papers.published',
			title: () => m.tourParticipantPapersPublishedTitle(),
			body: () => m.tourParticipantPapersPublishedBody(),
			side: 'top'
		}
	]
};
