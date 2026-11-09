import { afterEach, describe, expect, it, vi } from 'vitest';

async function formatOn(platform: string) {
	vi.resetModules();
	vi.doMock('$app/env', () => ({ browser: true }));
	vi.stubGlobal('navigator', { platform });
	return (await import('./hotkey')).formatHotkey;
}

afterEach(() => {
	vi.unstubAllGlobals();
	vi.doUnmock('$app/env');
});

describe('formatHotkey', () => {
	it('spells modifiers out and joins with + elsewhere', async () => {
		const formatHotkey = await formatOn('Linux x86_64');
		expect(formatHotkey('mod+shift+k')).toBe('Ctrl+Shift+K');
		expect(formatHotkey('alt + space')).toBe('Alt+␣');
	});

	it('uses symbols without separators on a Mac', async () => {
		const formatHotkey = await formatOn('MacIntel');
		expect(formatHotkey('mod+shift+k')).toBe('⌘⇧K');
		expect(formatHotkey('ctrl+PageDown')).toBe('⌃PageDown');
	});
});
