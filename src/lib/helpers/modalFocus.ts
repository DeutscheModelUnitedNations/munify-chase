import type { Attachment } from 'svelte/attachments';

const FOCUSABLE = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[contenteditable="true"]',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

/** The elements Tab reaches inside `container`, in document order, skipping hidden ones. */
export function focusableIn(container: HTMLElement): HTMLElement[] {
	return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
		(element) => !element.closest('[inert], [aria-hidden="true"]') && isRendered(element)
	);
}

/** False for `display: none` and the like; jsdom lays nothing out and has no `checkVisibility`. */
function isRendered(element: HTMLElement): boolean {
	return !('checkVisibility' in element) || element.checkVisibility();
}

/**
 * Where Tab goes instead of leaving the dialog: round from the last control to the first, and
 * with Shift from the first (or the dialog itself) to the last. Undefined lets the browser move.
 */
export function wrappedTabTarget({
	items,
	active,
	dialog,
	backwards
}: {
	items: HTMLElement[];
	active: Element | null;
	dialog: HTMLElement;
	backwards: boolean;
}): HTMLElement | undefined {
	if (backwards) return active === items[0] || active === dialog ? items.at(-1) : undefined;
	return active === items.at(-1) ? items[0] : undefined;
}

function keepTabInside({ dialog, event }: { dialog: HTMLElement; event: KeyboardEvent }) {
	const items = focusableIn(dialog);
	const target = items.length
		? wrappedTabTarget({ items, active: document.activeElement, dialog, backwards: event.shiftKey })
		: dialog;
	if (!target) return;
	event.preventDefault();
	target.focus();
}

let headingIds = 0;

/** A dialog without a name of its own is announced by its first heading. */
function nameAfterHeading(dialog: HTMLElement) {
	if (dialog.hasAttribute('aria-label') || dialog.hasAttribute('aria-labelledby')) return;
	const heading = dialog.querySelector('h1, h2, h3, h4, h5, h6');
	if (!heading) return;
	heading.id ||= `dialog-heading-${++headingIds}`;
	dialog.setAttribute('aria-labelledby', heading.id);
}

/**
 * Makes the element a modal dialog for keyboard and screen reader users: focus moves into it
 * (to an `[autofocus]` element, else the first control, else the dialog itself), Tab and
 * Shift+Tab stay inside, Escape calls `onEscape`, and closing hands focus back to whatever had
 * it before. The element needs `role="dialog"` (or `alertdialog`) and `aria-modal="true"`;
 * without `aria-label(ledby)` it is named after its first heading.
 */
export function modalFocus(onEscape?: () => void): Attachment<HTMLElement> {
	return (dialog) => {
		const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		if (!dialog.hasAttribute('tabindex')) dialog.tabIndex = -1;

		// After the dialog's content has rendered: an awaited child may not be there yet
		const frame = requestAnimationFrame(() => {
			nameAfterHeading(dialog);
			if (dialog.contains(document.activeElement)) return;
			const target =
				dialog.querySelector<HTMLElement>('[autofocus]') ?? focusableIn(dialog)[0] ?? dialog;
			target.focus();
		});

		function onKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape' && onEscape) {
				// A dialog inside another one closes alone
				event.stopPropagation();
				onEscape();
			} else if (event.key === 'Tab') {
				keepTabInside({ dialog, event });
			}
		}

		dialog.addEventListener('keydown', onKeydown);
		return () => {
			cancelAnimationFrame(frame);
			dialog.removeEventListener('keydown', onKeydown);
			if (previous?.isConnected) previous.focus();
		};
	};
}
