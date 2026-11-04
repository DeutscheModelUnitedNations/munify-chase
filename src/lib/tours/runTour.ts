import { startTour as startKitTour } from '@deutschemodelunitednations/docs-kit/tour';
import { m } from '#lib/paraglide/messages';
import type { Tour } from './types';

/**
 * Starts a tour on the current page. Steps whose anchor is missing or hidden
 * (e.g. a sidebar only shown on wide screens) are skipped instead of breaking the tour.
 */
export function startTour(tour: Tour) {
	startKitTour({
		tour,
		labels: {
			next: m.tourNext(),
			previous: m.tourPrevious(),
			done: m.tourDone(),
			progress: m.tourProgress({ current: '{{current}}', total: '{{total}}' })
		}
	});
}
