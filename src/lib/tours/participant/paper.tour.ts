import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Participant paper editor. Anchors live in PaperPage (participant branch only). */
export const tour: Tour = {
	id: 'participant.paper',
	steps: [
		{
			title: () => m.tourParticipantPaperIntroTitle(),
			body: () => m.tourParticipantPaperIntroBody()
		},
		{
			anchor: 'paper.lifecycle',
			title: () => m.tourParticipantPaperLifecycleTitle(),
			body: () => m.tourParticipantPaperLifecycleBody(),
			side: 'bottom'
		},
		{
			anchor: 'paper.share',
			title: () => m.tourParticipantPaperShareTitle(),
			body: () => m.tourParticipantPaperShareBody(),
			side: 'bottom'
		},
		{
			anchor: 'paper.sponsors',
			title: () => m.tourParticipantPaperSponsorsTitle(),
			body: () => m.tourParticipantPaperSponsorsBody(),
			side: 'bottom'
		},
		{
			anchor: 'paper.submit',
			title: () => m.tourParticipantPaperSubmitTitle(),
			body: () => m.tourParticipantPaperSubmitBody(),
			side: 'bottom'
		},
		{
			anchor: 'paper.preview',
			title: () => m.tourParticipantPaperPreviewTitle(),
			body: () => m.tourParticipantPaperPreviewBody(),
			side: 'right'
		},
		{
			anchor: 'paper.editor',
			title: () => m.tourParticipantPaperEditorTitle(),
			body: () => m.tourParticipantPaperEditorBody(),
			side: 'left'
		},
		{
			anchor: 'paper.context',
			title: () => m.tourParticipantPaperContextTitle(),
			body: () => m.tourParticipantPaperContextBody(),
			side: 'left'
		}
	]
};
