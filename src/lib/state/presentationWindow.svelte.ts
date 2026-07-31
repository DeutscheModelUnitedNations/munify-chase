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

export function openPresentationWindow(url: string, committeeId: string): Window | null {
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
 * so its presence is a reliable proxy.
 */
export function fullscreenDelegationSupported(): boolean {
	if (typeof window === 'undefined' || typeof document === 'undefined') return false;
	if (!document.fullscreenEnabled) return false;
	return 'userAgentData' in navigator;
}

export function postToPresentation(message: unknown): boolean {
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
