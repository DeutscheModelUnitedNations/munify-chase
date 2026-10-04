import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Chair setup page. Anchors live in the setup +page.svelte. */
export const tour: Tour = {
	id: 'chair.setup',
	steps: [
		{
			title: () => m.tourSetupIntroTitle(),
			body: () => m.tourSetupIntroBody()
		},
		{
			anchor: 'setup.whiteboard',
			title: () => m.tourSetupWhiteboardTitle(),
			body: () => m.tourSetupWhiteboardBody(),
			side: 'right'
		},
		{
			anchor: 'setup.status',
			title: () => m.tourSetupStatusTitle(),
			body: () => m.tourSetupStatusBody(),
			side: 'left'
		},
		{
			anchor: 'setup.state-of-debate',
			title: () => m.tourSetupStateOfDebateTitle(),
			body: () => m.tourSetupStateOfDebateBody(),
			side: 'left'
		},
		{
			anchor: 'setup.agenda-item',
			title: () => m.tourSetupAgendaTitle(),
			body: () => m.tourSetupAgendaBody(),
			side: 'left'
		},
		{
			anchor: 'setup.presentation',
			title: () => m.tourSetupPresentationTitle(),
			body: () => m.tourSetupPresentationBody(),
			side: 'left'
		},
		{
			anchor: 'setup.self-add',
			title: () => m.tourSetupSelfAddTitle(),
			body: () => m.tourSetupSelfAddBody(),
			side: 'left'
		},
		{
			anchor: 'setup.requests',
			title: () => m.tourSetupRequestsTitle(),
			body: () => m.tourSetupRequestsBody(),
			side: 'left'
		}
	]
};
