export const PALETTE_SHORTCUT = 'mod+k';

let open = $state(false);

export const commandPalette = {
	get open() {
		return open;
	},
	set open(value: boolean) {
		open = value;
	}
};

const RECENT_KEY = 'chase:commands:recent';
const RECENT_LIMIT = 5;

export function recentCommandIds(): string[] {
	try {
		return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
	} catch {
		return [];
	}
}

export function rememberCommand(id: string) {
	try {
		const ids = [id, ...recentCommandIds().filter((other) => other !== id)];
		localStorage.setItem(RECENT_KEY, JSON.stringify(ids.slice(0, RECENT_LIMIT)));
	} catch {
		// Storage can be unavailable (private mode), recent commands are only a convenience
	}
}
