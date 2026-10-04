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
