export const isTauri = (): boolean =>
	typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

/** Open a URL in the system default browser (or a new tab in web). */
export async function openExternal(url: string): Promise<void> {
	if (isTauri()) {
		const { openUrl } = await import('@tauri-apps/plugin-opener');
		await openUrl(url);
	} else {
		window.open(url, '_blank', 'noopener,noreferrer');
	}
}

/** Toggle fullscreen for the current window. */
export async function toggleFullscreen(): Promise<void> {
	if (isTauri()) {
		const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
		const win = getCurrentWebviewWindow();
		const fs = await win.isFullscreen();
		await win.setFullscreen(!fs);
	} else {
		if (!document.fullscreenElement) {
			await document.documentElement.requestFullscreen();
		} else {
			await document.exitFullscreen();
		}
	}
}

/** Whether the app is currently fullscreen (approximate for web). */
export async function isFullscreen(): Promise<boolean> {
	if (isTauri()) {
		const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow');
		return getCurrentWebviewWindow().isFullscreen();
	}
	return !!document.fullscreenElement;
}
