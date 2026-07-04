import { isTauri } from '$lib/platform';

const TAURI_LABEL = 'presentation';

let presentationWindow: Window | null = null;
let isOpen = $state(false);
let pollInterval: ReturnType<typeof setInterval> | null = null;

function startPolling() {
	if (pollInterval) return;
	pollInterval = setInterval(() => {
		if (presentationWindow?.closed) {
			presentationWindow = null;
			isOpen = false;
		}
		if (!presentationWindow && pollInterval) {
			clearInterval(pollInterval);
			pollInterval = null;
		}
	}, 1000);
}

export function presentationOpen(): boolean {
	return isOpen;
}

async function openTauriPresentation(url: string): Promise<void> {
	const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow');
	const existing = await WebviewWindow.getByLabel(TAURI_LABEL);
	if (existing) {
		await existing.setFocus();
		isOpen = true;
		void existing.once('tauri://destroyed', () => {
			isOpen = false;
		});
		return;
	}
	const win = new WebviewWindow(TAURI_LABEL, {
		url,
		title: 'MUNify CHASE – Presentation',
		width: 1280,
		height: 720
	});
	void win.once('tauri://created', () => {
		isOpen = true;
	});
	void win.once('tauri://destroyed', () => {
		isOpen = false;
	});
}

export function openPresentationWindow(url: string, committeeId: string): Window | null {
	if (isTauri()) {
		void openTauriPresentation(url);
		return null;
	}
	if (presentationWindow && !presentationWindow.closed) {
		presentationWindow.focus();
		return presentationWindow;
	}
	presentationWindow = window.open(url, `presentation-${committeeId}`);
	isOpen = !!presentationWindow;
	if (presentationWindow) startPolling();
	return presentationWindow;
}

/**
 * Best-effort check for whether `requestFullscreen()` in the presentation popup
 * can be triggered from the chair window via postMessage capability delegation.
 * The delegation mechanism is only implemented in Chromium-based browsers; in
 * Firefox/Safari the popup's message handler has no user activation and the
 * fullscreen request would be rejected. `userAgentData` is a Chromium-only API,
 * so its presence is a reliable proxy. In Tauri the presentation is a native
 * webview window whose fullscreen state we control directly, so it is always
 * supported there.
 */
export function fullscreenDelegationSupported(): boolean {
	if (isTauri()) return true;
	if (typeof window === 'undefined' || typeof document === 'undefined') return false;
	if (!document.fullscreenEnabled) return false;
	return 'userAgentData' in navigator;
}

export function postToPresentation(message: unknown): boolean {
	if (isTauri()) {
		if (!isOpen) return false;
		void (async () => {
			const { WebviewWindow } = await import('@tauri-apps/api/webviewWindow');
			const win = await WebviewWindow.getByLabel(TAURI_LABEL);
			if (!win) {
				isOpen = false;
				return;
			}
			// The only cross-window message today is the fullscreen toggle; in Tauri
			// we control the presentation window's fullscreen state directly instead
			// of delegating via postMessage.
			if (message === 'toggle-fullscreen') {
				const fs = await win.isFullscreen();
				await win.setFullscreen(!fs);
			}
			await win.setFocus();
		})();
		return true;
	}
	if (!presentationWindow || presentationWindow.closed) {
		isOpen = false;
		return false;
	}
	presentationWindow.focus();
	// Delegate fullscreen capability so the popup can call requestFullscreen()
	// inside its message handler — user activation does not cross postMessage
	// without explicit delegation. Falls back to a plain postMessage on browsers
	// without capability-delegation support.
	try {
		presentationWindow.postMessage(message, {
			targetOrigin: window.location.origin,
			delegate: 'fullscreen'
		} as WindowPostMessageOptions);
	} catch {
		presentationWindow.postMessage(message, window.location.origin);
	}
	return true;
}
