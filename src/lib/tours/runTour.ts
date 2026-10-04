import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { m } from '$lib/paraglide/messages';
import type { Tour } from './types';

function anchorSelector(anchor: string) {
	return `[data-tour="${anchor}"]`;
}

function isVisible(element: Element) {
	return element.getClientRects().length > 0;
}

/**
 * Starts a tour on the current page. Steps whose anchor is missing or hidden
 * (e.g. a sidebar only shown on wide screens) are skipped instead of breaking the tour.
 */
export function startTour(tour: Tour) {
	const steps: DriveStep[] = tour.steps
		.filter((step) => {
			if (!step.anchor) return true;
			const element = document.querySelector(anchorSelector(step.anchor));
			return element !== null && isVisible(element);
		})
		.map((step) => ({
			element: step.anchor ? anchorSelector(step.anchor) : undefined,
			popover: { title: step.title(), description: step.body(), side: step.side }
		}));

	if (steps.length === 0) return;

	driver({
		steps,
		showProgress: steps.length > 1,
		progressText: m.tourProgress({ current: '{{current}}', total: '{{total}}' }),
		nextBtnText: m.tourNext(),
		prevBtnText: m.tourPrevious(),
		doneBtnText: m.tourDone(),
		popoverClass: 'chase-tour',
		// driver.js only scrolls elements outside the window, but fixed bars like the bottom
		// dock can still cover them, so always bring the highlighted element to the middle
		onHighlightStarted: (element) => element?.scrollIntoView({ block: 'center' }),
		stagePadding: 6,
		stageRadius: 12
	}).drive();
}
