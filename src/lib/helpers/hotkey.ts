import { browser } from '$app/environment';

const isMac = browser && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

const macModifiers: Record<string, string> = {
	alt: '⌥',
	shift: '⇧',
	ctrl: '⌃',
	mod: '⌘',
	enter: '↵',
	space: '␣',
	backspace: '⌫',
	esc: 'Esc'
};

const nonMacModifiers: Record<string, string> = {
	alt: 'Alt',
	shift: 'Shift',
	ctrl: 'Ctrl',
	mod: 'Ctrl',
	enter: '↵',
	space: '␣',
	backspace: '⌫',
	esc: 'Esc'
};

/** Formats a hotkeys-js key string like `alt+shift+n` for display on the current platform */
export function formatHotkey(hotkey: string) {
	return hotkey
		.split('+')
		.map((part) => {
			const key = part.trim().toLowerCase();
			// Single letters read better uppercase, like on the keyboard
			const fallback = key.length === 1 ? key.toUpperCase() : part.trim();
			if (isMac) return macModifiers[key] ?? fallback;
			return nonMacModifiers[key] ?? fallback;
		})
		.join(isMac ? '' : '+');
}
