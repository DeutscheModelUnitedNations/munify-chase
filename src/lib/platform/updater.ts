import { isTauri } from './index';
import { alertDialog } from '$lib/components/Alert/alert';
import toast from 'svelte-french-toast';

/**
 * Checks for an application update (Tauri native client only) and, if one is
 * available, asks the user whether to install it. The updater verifies the
 * package against the minisign public key in tauri.conf.json, so this is safe
 * even though the app itself is not OS-code-signed.
 *
 * Fully non-blocking and failure-tolerant: any error (offline, no release yet,
 * etc.) is logged and swallowed so app startup is never affected.
 */
export async function checkForUpdates(): Promise<void> {
	if (!isTauri()) return;

	try {
		const { check } = await import('@tauri-apps/plugin-updater');
		const update = await check();
		if (!update) return;

		const accepted = await alertDialog({
			title: 'Update available',
			description: `Version ${update.version} is available (you have ${update.currentVersion}). Install it now? The app will restart.`,
			cancelText: 'Later',
			confirmText: 'Update now'
		});
		if (!accepted) return;

		await toast.promise(update.downloadAndInstall(), {
			loading: 'Downloading update…',
			success: 'Update installed — restarting…',
			error: 'Update failed'
		});

		const { relaunch } = await import('@tauri-apps/plugin-process');
		await relaunch();
	} catch (e) {
		console.error('[updater] check failed:', e);
	}
}
