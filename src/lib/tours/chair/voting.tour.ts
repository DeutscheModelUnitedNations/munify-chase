import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/**
 * Chair voting page. Anchors live in VotingSetup and VotingSetupForm. While a vote
 * is running only the resume step shows, otherwise only the setup form steps.
 */
export const tour: Tour = {
	id: 'chair.voting',
	steps: [
		{
			title: () => m.tourVotingIntroTitle(),
			body: () => m.tourVotingIntroBody()
		},
		{
			anchor: 'voting.resume',
			title: () => m.tourVotingResumeTitle(),
			body: () => m.tourVotingResumeBody(),
			side: 'left'
		},
		{
			anchor: 'voting.type',
			title: () => m.tourVotingTypeTitle(),
			body: () => m.tourVotingTypeBody(),
			side: 'left'
		},
		{
			anchor: 'voting.majority',
			title: () => m.tourVotingMajorityTitle(),
			body: () => m.tourVotingMajorityBody(),
			side: 'left'
		},
		{
			anchor: 'voting.title',
			title: () => m.tourVotingTitleTitle(),
			body: () => m.tourVotingTitleBody(),
			side: 'left'
		},
		{
			anchor: 'voting.start',
			title: () => m.tourVotingStartTitle(),
			body: () => m.tourVotingStartBody(),
			side: 'top'
		}
	]
};
