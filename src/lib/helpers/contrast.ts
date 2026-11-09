/**
 * High contrast: a variant of the light and the dark theme (`app.css`, under
 * `[data-contrast='more']`) with dark semantic colours, full-strength muted text and stronger
 * borders and focus rings. Its toggle sits next to the light/dark switch. It follows the system's
 * "increase contrast" setting until someone chooses on this device. `src/app.html` repeats
 * `contrastIsMore` before the first paint.
 */

export const CONTRAST_STORAGE_KEY = 'contrast';

/** What was chosen on this device; anything else (nothing stored) follows the system. */
export type ContrastChoice = 'more' | 'normal';

export function storedContrastChoice(stored: string | null): ContrastChoice | null {
	return stored === 'more' || stored === 'normal' ? stored : null;
}

export function contrastIsMore({
	choice,
	systemPrefersMore
}: {
	choice: ContrastChoice | null;
	systemPrefersMore: boolean;
}): boolean {
	return choice ? choice === 'more' : systemPrefersMore;
}
