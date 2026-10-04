import { m } from '$lib/paraglide/messages';
import type { Tour } from '$lib/tours/types';

/** Chair resolutions list. Promote is skipped when no paper is submitted. */
export const tour: Tour = {
	id: 'chair.resolutions',
	steps: [
		{
			title: () => m.tourResolutionsIntroTitle(),
			body: () => m.tourResolutionsIntroBody()
		},
		{
			anchor: 'resolutions.create',
			title: () => m.tourResolutionsCreateTitle(),
			body: () => m.tourResolutionsCreateBody(),
			side: 'left'
		},
		{
			anchor: 'resolutions.phase-toggles',
			title: () => m.tourResolutionsTogglesTitle(),
			body: () => m.tourResolutionsTogglesBody()
		},
		{
			anchor: 'resolutions.filters',
			title: () => m.tourResolutionsFiltersTitle(),
			body: () => m.tourResolutionsFiltersBody()
		},
		{
			anchor: 'resolutions.list',
			title: () => m.tourResolutionsListTitle(),
			body: () => m.tourResolutionsListBody(),
			side: 'top'
		},
		{
			anchor: 'resolutions.promote',
			title: () => m.tourResolutionsPromoteTitle(),
			body: () => m.tourResolutionsPromoteBody()
		},
		{
			anchor: 'resolutions.set-active',
			title: () => m.tourResolutionsSetActiveTitle(),
			body: () => m.tourResolutionsSetActiveBody(),
			side: 'left'
		}
	]
};
