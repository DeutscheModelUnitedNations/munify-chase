import type { Command } from './types';

export function isVisible(command: Command) {
	return command.visible?.() ?? true;
}

export function isEnabled(command: Command) {
	return command.enabled?.() ?? true;
}

/**
 * What pressing `shortcut` does among the `offered` commands. Hidden commands still own
 * their key (`owned`), so the browser default stays suppressed on the page the shortcut
 * would open; the first enabled visible one runs.
 */
export function resolveShortcut({ shortcut, offered }: { shortcut: string; offered: Command[] }) {
	const owning = offered.filter((command) => command.shortcut === shortcut);
	const matching = owning.filter(isVisible);
	return { owned: owning.length > 0, matching, command: matching.find(isEnabled) };
}

function isEditable(target: EventTarget | null) {
	return (
		target instanceof HTMLElement &&
		(target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
	);
}

type PaletteKey = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'target'>;

/** Ctrl/⌘+K toggles the palette; `/` opens it, unless it is typed into a field */
export function togglesPalette({ event, open }: { event: PaletteKey; open: boolean }) {
	const withModifier = event.ctrlKey || event.metaKey;
	if (withModifier) return event.key.toLowerCase() === 'k';
	return event.key === '/' && !open && !isEditable(event.target);
}
