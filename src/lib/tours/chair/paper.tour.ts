import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/**
 * Chair view of a paper. Anchors live in PaperPage, ChairControlBar and AmendmentList
 * and are only rendered for chairs, so the participant paper tour can't pick them up.
 * Vote, share and decide steps are skipped when the paper's stage hides them.
 */
export const tour: Tour = {
	id: 'chair.paper',
	steps: [
		{
			title: () => m.tourChairPaperIntroTitle(),
			body: () => m.tourChairPaperIntroBody()
		},
		{
			anchor: 'chair-paper.phases',
			title: () => m.tourChairPaperPhasesTitle(),
			body: () => m.tourChairPaperPhasesBody()
		},
		{
			anchor: 'chair-paper.vote-actions',
			title: () => m.tourChairPaperVoteTitle(),
			body: () => m.tourChairPaperVoteBody()
		},
		{
			anchor: 'chair-paper.share',
			title: () => m.tourChairPaperShareTitle(),
			body: () => m.tourChairPaperShareBody()
		},
		{
			anchor: 'chair-paper.sponsors',
			title: () => m.tourChairPaperSponsorsTitle(),
			body: () => m.tourChairPaperSponsorsBody()
		},
		{
			anchor: 'chair-paper.ai',
			title: () => m.tourChairPaperAiTitle(),
			body: () => m.tourChairPaperAiBody()
		},
		{
			anchor: 'chair-paper.history',
			title: () => m.tourChairPaperHistoryTitle(),
			body: () => m.tourChairPaperHistoryBody()
		},
		{
			anchor: 'chair-paper.amendments',
			title: () => m.tourChairPaperAmendmentsTitle(),
			body: () => m.tourChairPaperAmendmentsBody(),
			side: 'left'
		},
		{
			anchor: 'chair-paper.decide',
			title: () => m.tourChairPaperDecideTitle(),
			body: () => m.tourChairPaperDecideBody(),
			side: 'left'
		}
	]
};
