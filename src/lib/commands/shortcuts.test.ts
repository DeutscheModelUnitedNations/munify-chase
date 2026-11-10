// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { isEnabled, resolveShortcut, togglesPalette } from './shortcuts';
import type { Command } from './types';

function command(overrides: Partial<Command> = {}): Command {
	return { id: 'test', title: () => 'Test', group: 'page', run: vi.fn(), ...overrides };
}

describe('resolveShortcut', () => {
	it('runs the first enabled visible command of the key', () => {
		const disabled = command({ id: 'a', shortcut: 'alt+n', enabled: () => false });
		const enabled = command({ id: 'b', shortcut: 'alt+n' });
		const other = command({ id: 'c', shortcut: 'alt+m' });
		const result = resolveShortcut({ shortcut: 'alt+n', offered: [other, disabled, enabled] });
		expect(result.owned).toBe(true);
		expect(result.matching).toEqual([disabled, enabled]);
		expect(result.command).toBe(enabled);
	});

	it('keeps a key owned by a hidden command, running nothing', () => {
		const hidden = command({ shortcut: 'alt+n', visible: () => false });
		expect(resolveShortcut({ shortcut: 'alt+n', offered: [hidden] })).toEqual({
			owned: true,
			matching: [],
			command: undefined
		});
	});

	it('leaves keys nobody owns alone', () => {
		expect(resolveShortcut({ shortcut: 'alt+n', offered: [command()] }).owned).toBe(false);
	});
});

describe('isEnabled', () => {
	it('defaults to enabled', () => {
		expect(isEnabled(command())).toBe(true);
		expect(isEnabled(command({ enabled: () => false }))).toBe(false);
	});
});

describe('togglesPalette', () => {
	const key = (key: string, extra: Partial<KeyboardEvent> = {}) => ({
		key,
		ctrlKey: false,
		metaKey: false,
		target: null,
		...extra
	});

	it('toggles on Ctrl/⌘+K, open or not', () => {
		expect(togglesPalette({ event: key('K', { ctrlKey: true }), open: false })).toBe(true);
		expect(togglesPalette({ event: key('k', { metaKey: true }), open: true })).toBe(true);
		expect(togglesPalette({ event: key('/', { ctrlKey: true }), open: false })).toBe(false);
	});

	it('opens on / outside fields only', () => {
		expect(togglesPalette({ event: key('/'), open: false })).toBe(true);
		expect(togglesPalette({ event: key('/'), open: true })).toBe(false);
		expect(togglesPalette({ event: key('k'), open: false })).toBe(false);
		const input = document.createElement('input');
		expect(togglesPalette({ event: key('/', { target: input }), open: false })).toBe(false);
		const editor = document.createElement('div');
		editor.contentEditable = 'true';
		Object.defineProperty(editor, 'isContentEditable', { value: true });
		expect(togglesPalette({ event: key('/', { target: editor }), open: false })).toBe(false);
		const button = document.createElement('button');
		expect(togglesPalette({ event: key('/', { target: button }), open: false })).toBe(true);
	});
});
