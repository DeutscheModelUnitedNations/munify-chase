import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Chair requests page. Request steps are skipped while nothing is pending. */
export const tour: Tour = {
	id: 'chair.requests',
	steps: [
		{
			title: () => m.tourRequestsIntroTitle(),
			body: () => m.tourRequestsIntroBody()
		},
		{
			anchor: 'requests.queue',
			title: () => m.tourRequestsQueueTitle(),
			body: () => m.tourRequestsQueueBody()
		},
		{
			anchor: 'requests.request',
			title: () => m.tourRequestsRequestTitle(),
			body: () => m.tourRequestsRequestBody()
		},
		{
			anchor: 'requests.withdraw',
			title: () => m.tourRequestsWithdrawTitle(),
			body: () => m.tourRequestsWithdrawBody()
		},
		{
			anchor: 'requests.resolve',
			title: () => m.tourRequestsResolveTitle(),
			body: () => m.tourRequestsResolveBody()
		},
		{
			anchor: 'requests.history',
			title: () => m.tourRequestsHistoryTitle(),
			body: () => m.tourRequestsHistoryBody(),
			side: 'top'
		}
	]
};
