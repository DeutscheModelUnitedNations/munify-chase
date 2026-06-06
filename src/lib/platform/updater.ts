import { isTauri } from './index';
import { alertDialog } from '$lib/components/Alert/alert';
import toast from 'svelte-french-toast';
import { m } from '$lib/paraglide/messages';

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
			title: m.appUpdateTitle(),
			description: m.appUpdateDescription({
				version: update.version,
				currentVersion: update.currentVersion
			}),
			cancelText: m.appUpdateLater(),
			confirmText: m.appUpdateNow()
		});
		if (!accepted) return;

		await toast.promise(update.downloadAndInstall(), {
			loading: m.appUpdateDownloading(),
			success: m.appUpdateInstalled(),
			error: m.appUpdateFailed()
		});

		const { relaunch } = await import('@tauri-apps/plugin-process');
		await relaunch();
	} catch (e) {
		console.error('[updater] check failed:', e);
	}
}
