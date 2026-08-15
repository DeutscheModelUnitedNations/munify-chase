import { isTauri } from './index';

/**
 * Checks GitHub Releases for a newer version and, if one is found, downloads
 * and installs it in the background. Returns true once an update has been
 * installed and is ready to apply on relaunch. No-op outside Tauri.
 */
export async function checkForUpdates(): Promise<boolean> {
	if (!isTauri()) return false;

	const { check } = await import('@tauri-apps/plugin-updater');
	const update = await check();
	if (!update) return false;

	await update.downloadAndInstall();
	return true;
}

/** Restarts the app to apply an already-installed update. */
export async function relaunchApp(): Promise<void> {
	const { relaunch } = await import('@tauri-apps/plugin-process');
	await relaunch();
}
