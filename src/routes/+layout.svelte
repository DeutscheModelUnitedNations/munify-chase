<script lang="ts">
	import { enableViewTransitionApi } from '$lib/helpers/viewTransitionApi.svelte';
	import { Toaster, useToasterStore } from 'svelte-french-toast';
	import toast from 'svelte-french-toast';
	import { page } from '$app/state';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import '../app.css';
	import '/node_modules/flag-icons/css/flag-icons.min.css';

	import { dev } from '$app/environment';
	import { initialSetTheme } from '$lib/utils/theme.svelte';
	import { onMount } from 'svelte';
	import Alert from '$lib/components/Alert/PromiseAlert.svelte';
	import OfflineBanner from '$lib/components/OfflineBanner.svelte';
	import Inspect from 'svelte-inspect-value';
	import { alertDialog } from '$lib/components/Alert/alert';
	import { checkForUpdate, relaunchApp } from '$lib/platform/updater';
	import { m } from '$lib/paraglide/messages';

	dayjs.extend(duration);

	let { children } = $props();

	enableViewTransitionApi();

	onMount(async () => {
		initialSetTheme();
		const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
		matchMedia.addEventListener('change', () => {
			initialSetTheme();
		});

		if ('__TAURI_INTERNALS__' in window) {
			// Activate the deep-link plugin's D-Bus listener so the OS can deliver
			// munify-chase:// URIs to this already-running instance at any time.
			const { register } = await import('@tauri-apps/plugin-deep-link');
			await register('munify-chase').catch((e) => console.error('[deep-link] register failed:', e));

			// Check for an update in the background, but always ask before
			// downloading/installing — on Linux, installing can trigger a native
			// pkexec/sudo prompt, so the user needs a heads-up for why it's
			// showing up rather than being hit with it out of nowhere.
			checkForUpdate()
				.then(async (update) => {
					if (!update) return;
					const proceed = await alertDialog({
						title: m.appUpdateTitle(),
						description: m.appUpdateDescription({
							version: update.version,
							currentVersion: update.currentVersion
						}),
						cancelText: m.appUpdateLater(),
						confirmText: m.appUpdateNow()
					});
					if (!proceed) return;

					await toast.promise(update.downloadAndInstall(), {
						loading: m.appUpdateDownloading(),
						success: m.appUpdateInstalled(),
						error: m.appUpdateFailed()
					});
					await relaunchApp();
				})
				.catch((e) => console.error('[updater] check failed:', e));
		}
	});

	const MAX_VISIBLE_TOASTS = 3;
	const { toasts: toastStore } = useToasterStore();
	$effect(() => {
		const visible = $toastStore.filter((t) => t.visible);
		if (visible.length > MAX_VISIBLE_TOASTS) {
			// toasts are prepended so the oldest are at the end of the array
			for (const t of visible.slice(MAX_VISIBLE_TOASTS)) {
				toast.dismiss(t.id);
			}
		}
	});
</script>

<svelte:head>
	<title>MUNify CHASE</title>
</svelte:head>

{@render children()}

<Toaster
	position={page.route.id?.includes('[paperId]') ? 'bottom-left' : 'top-right'}
	containerClassName="mt-16"
	toastOptions={{ className: 'border-2' }}
/>
<Alert />
<OfflineBanner />

{#if dev}
	<Inspect.Panel />
{/if}
