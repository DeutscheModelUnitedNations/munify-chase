// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { focusableIn, modalFocus, wrappedTabTarget } from './modalFocus';

beforeEach(() => {
	vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
		callback(0);
		return 0;
	});
});

afterEach(() => {
	vi.restoreAllMocks();
	document.body.innerHTML = '';
});

function setup(html: string) {
	document.body.innerHTML = `<button id="opener">open</button><div id="dialog">${html}</div>`;
	const opener = document.getElementById('opener')!;
	opener.focus();
	return { opener, dialog: document.getElementById('dialog')! };
}

function tab(dialog: HTMLElement, shiftKey = false) {
	const event = new KeyboardEvent('keydown', {
		key: 'Tab',
		shiftKey,
		bubbles: true,
		cancelable: true
	});
	dialog.dispatchEvent(event);
	return event;
}

describe('modalFocus', () => {
	it('moves focus to the first control and back to the opener on close', () => {
		const { opener, dialog } = setup('<input id="a" /><button id="b">ok</button>');
		const detach = modalFocus()(dialog);
		expect(document.activeElement?.id).toBe('a');
		if (typeof detach === 'function') detach();
		expect(document.activeElement).toBe(opener);
	});

	it('prefers an autofocus element', () => {
		const { dialog } = setup('<input id="a" /><button id="b" autofocus>ok</button>');
		modalFocus()(dialog);
		expect(document.activeElement?.id).toBe('b');
	});

	it('focuses the dialog itself when it holds no control', () => {
		const { dialog } = setup('<p>text</p>');
		modalFocus()(dialog);
		expect(document.activeElement).toBe(dialog);
	});

	it('keeps Tab and Shift+Tab inside', () => {
		const { dialog } = setup('<input id="a" /><button id="b">ok</button>');
		modalFocus()(dialog);
		document.getElementById('b')!.focus();
		expect(tab(dialog).defaultPrevented).toBe(true);
		expect(document.activeElement?.id).toBe('a');
		expect(tab(dialog, true).defaultPrevented).toBe(true);
		expect(document.activeElement?.id).toBe('b');
	});

	it('keeps Tab on the dialog when it holds no control', () => {
		const { dialog } = setup('<p>text</p>');
		modalFocus()(dialog);
		expect(tab(dialog).defaultPrevented).toBe(true);
		expect(document.activeElement).toBe(dialog);
	});

	it('leaves other keys alone', () => {
		const { dialog } = setup('<button>ok</button>');
		const onEscape = vi.fn();
		modalFocus(onEscape)(dialog);
		const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
		dialog.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(false);
		expect(onEscape).not.toHaveBeenCalled();
	});

	it('is named after its first heading unless it has a name', () => {
		const { dialog } = setup('<h3>Delete?</h3><button>ok</button>');
		modalFocus()(dialog);
		const heading = dialog.querySelector('h3')!;
		expect(dialog.getAttribute('aria-labelledby')).toBe(heading.id);

		const named = setup('<h3>Delete?</h3>').dialog;
		named.setAttribute('aria-label', 'Own name');
		modalFocus()(named);
		expect(named.hasAttribute('aria-labelledby')).toBe(false);
	});

	it('closes on Escape without reaching an outer dialog', () => {
		const { dialog } = setup('<button>ok</button>');
		const onEscape = vi.fn();
		const outer = vi.fn();
		document.body.addEventListener('keydown', outer);
		modalFocus(onEscape)(dialog);
		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		expect(onEscape).toHaveBeenCalledOnce();
		expect(outer).not.toHaveBeenCalled();
	});
});

describe('focusableIn', () => {
	it('skips disabled, inert and aria-hidden controls', () => {
		const { dialog } = setup(
			'<button disabled>x</button><div inert><button>y</button></div><div aria-hidden="true"><a href="#">z</a></div><a id="ok" href="#">ok</a>'
		);
		expect(focusableIn(dialog).map((element) => element.id)).toEqual(['ok']);
	});
});

describe('wrappedTabTarget', () => {
	const dialog = document.createElement('div');
	const [a, b, c] = ['a', 'b', 'c'].map((id) =>
		Object.assign(document.createElement('button'), { id })
	);
	const items = [a, b, c];

	it('wraps forwards from the last control only', () => {
		expect(wrappedTabTarget({ items, active: c, dialog, backwards: false })).toBe(a);
		expect(wrappedTabTarget({ items, active: b, dialog, backwards: false })).toBeUndefined();
	});

	it('wraps backwards from the first control or the dialog itself', () => {
		expect(wrappedTabTarget({ items, active: a, dialog, backwards: true })).toBe(c);
		expect(wrappedTabTarget({ items, active: dialog, dialog, backwards: true })).toBe(c);
		expect(wrappedTabTarget({ items, active: b, dialog, backwards: true })).toBeUndefined();
	});
});
