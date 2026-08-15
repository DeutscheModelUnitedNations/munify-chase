import { isTauri } from './index';
import type { Update } from '@tauri-apps/plugin-updater';

/**
 * Checks GitHub Releases for a newer version. Returns the update handle (with
 * `.version`/`.currentVersion` and `.downloadAndInstall()`) if one is
 * available, else null. No-op outside Tauri.
 */
export async function checkForUpdate(): Promise<Update | null> {
	if (!isTauri()) return null;

	const { check } = await import('@tauri-apps/plugin-updater');
	return await check();
}

/** Restarts the app to apply an already-installed update. */
export async function relaunchApp(): Promise<void> {
	const { relaunch } = await import('@tauri-apps/plugin-process');
	await relaunch();
}
