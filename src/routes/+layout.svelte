<script lang="ts">
	import { enableViewTransitionApi } from '#lib/helpers/viewTransitionApi.svelte';
	import { Toaster, useToasterStore } from 'svelte-french-toast';
	import toast from 'svelte-french-toast';
	import { page } from '$app/state';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import '../app.css';
	import 'flag-icons/css/flag-icons.min.css';
	import '@phosphor-icons/web/regular/style.css';
	import '@phosphor-icons/web/fill/style.css';
	import '@phosphor-icons/web/duotone/style.css';

	import { dev } from '$app/env';
	import { initialSetTheme } from '#lib/utils/theme.svelte';
	import { onMount } from 'svelte';
	import Alert from '#lib/components/Alert/PromiseAlert.svelte';
	import OfflineBanner from '#lib/components/OfflineBanner.svelte';
	import CookieBanner from '#lib/components/CookieBanner.svelte';
	import Inspect from 'svelte-inspect-value';
	import { SPLASH_SCREENS } from '#lib/pwa/splashScreens';
	import { m } from '#lib/paraglide/messages';

	dayjs.extend(duration);

	let { children } = $props();

	enableViewTransitionApi();

	onMount(() => {
		initialSetTheme();
		const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
		matchMedia.addEventListener('change', () => {
			initialSetTheme();
		});
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
	{#each SPLASH_SCREENS as screen (screen.file)}
		<link rel="apple-touch-startup-image" href="/{screen.file}" media={screen.media} />
	{/each}
</svelte:head>

<!-- The first thing Tab reaches: past the navigation, to the layout's <main> -->
<a
	href="#main-content"
	class="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100]"
>
	{m.a11ySkipToContent()}
</a>

{@render children()}

<Toaster
	position={page.route.id?.includes('[paperId]') ? 'bottom-left' : 'top-right'}
	containerClassName="mt-16"
	toastOptions={{ className: 'border-2' }}
/>
<Alert />
<OfflineBanner />
<CookieBanner />

{#if dev}
	<Inspect.Panel />
{/if}
