import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function fakeWindow() {
	return { closed: false, focus: vi.fn(), postMessage: vi.fn() };
}

let popup: ReturnType<typeof fakeWindow>;

beforeEach(() => {
	vi.useFakeTimers();
	vi.resetModules();
	popup = fakeWindow();
	vi.stubGlobal('window', { open: vi.fn(() => popup), location: { origin: 'https://chase.test' } });
});

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
});

describe('presentation window', () => {
	it('opens once and focuses the open popup again', async () => {
		const { openPresentationWindow, presentationOpen } = await import(
			'./presentationWindow.svelte'
		);
		expect(openPresentationWindow('/present', 'c1')).toBe(popup);
		expect(presentationOpen()).toBe(true);
		expect(openPresentationWindow('/present', 'c1')).toBe(popup);
		expect(popup.focus).toHaveBeenCalledOnce();
		expect(window.open).toHaveBeenCalledOnce();
	});

	it('notices the popup being closed', async () => {
		const { openPresentationWindow, presentationOpen, postToPresentation } = await import(
			'./presentationWindow.svelte'
		);
		openPresentationWindow('/present', 'c1');
		popup.closed = true;
		vi.advanceTimersByTime(1000);
		expect(presentationOpen()).toBe(false);
		expect(postToPresentation({ type: 'x' })).toBe(false);
		expect(vi.getTimerCount()).toBe(0);
	});

	it('posts to the open popup, delegating fullscreen where it can', async () => {
		const { openPresentationWindow, postToPresentation } = await import(
			'./presentationWindow.svelte'
		);
		openPresentationWindow('/present', 'c1');
		popup.postMessage.mockImplementationOnce(() => {
			throw new TypeError('no delegation');
		});
		expect(postToPresentation({ type: 'x' })).toBe(true);
		expect(popup.postMessage).toHaveBeenLastCalledWith({ type: 'x' }, 'https://chase.test');
	});

	it('stays closed when the browser blocks the popup', async () => {
		vi.mocked(window.open).mockReturnValueOnce(null);
		const { openPresentationWindow, presentationOpen } = await import(
			'./presentationWindow.svelte'
		);
		expect(openPresentationWindow('/present', 'c1')).toBeNull();
		expect(presentationOpen()).toBe(false);
		expect(vi.getTimerCount()).toBe(0);
	});
});
