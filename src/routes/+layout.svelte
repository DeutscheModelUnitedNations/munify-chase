<script lang="ts">
	import { page } from '$app/state';
	import { enableViewTransitionApi } from '$lib/helpers/viewTransitionApi.svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { Toaster } from 'svelte-french-toast';
	import dayjs from 'dayjs';
	import duration from 'dayjs/plugin/duration';
	import '../app.css';
	import '/node_modules/flag-icons/css/flag-icons.min.css';

	import { browser, dev } from '$app/environment';
	import { initialSetTheme } from '$lib/utils/theme.svelte';
	import { onMount } from 'svelte';
	import { timeQuery } from '$lib/state/serverTime.svelte';
	import Alert from '$lib/components/Alert/PromiseAlert.svelte';
	import Inspect from 'svelte-inspect-value';

	dayjs.extend(duration);

	let { children } = $props();

	enableViewTransitionApi();

	const changeFaDuotoneTheme = () => {
		const r = document.querySelector(':root');
		const html = document.querySelector('html');
		if (html?.getAttribute('data-theme') === 'dark') {
			(r as any)?.style.setProperty('--fa-primary-color', '#b1cbed');
			(r as any)?.style.setProperty('--fa-primary-opacity', '1');
			(r as any)?.style.setProperty('--fa-secondary-color', '#3d7dd2');
			(r as any)?.style.setProperty('--fa-secondary-opacity', '1');
		} else {
			(r as any)?.style.setProperty('--fa-primary-color', '#000000');
			(r as any)?.style.setProperty('--fa-primary-opacity', '1');
			(r as any)?.style.setProperty('--fa-secondary-color', '#3d7dd2');
			(r as any)?.style.setProperty('--fa-secondary-opacity', '1');
		}

		//--fa-primary-opacity: 1;
		// --fa-secondary-color: #3d7dd2;
		// --fa-secondary-opacity: 1;
	};

	if (browser) {
		changeFaDuotoneTheme();
		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
					changeFaDuotoneTheme();
				}
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});
	}

	onMount(() => {
		initialSetTheme();
		timeQuery.fetch();
		const matchMedia = window.matchMedia('(prefers-color-scheme: dark)');
		matchMedia.addEventListener('change', (e) => {
			initialSetTheme();
		});
	});
</script>

<svelte:head>
	<title>MUNify CHASE</title>
</svelte:head>

{@render children()}

<div aria-hidden="true" style="display:none">
	{#each locales as locale, index (index)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<Toaster containerClassName="mt-16" toastOptions={{ className: 'border-2' }} />
<Alert />

{#if dev}
	<Inspect.Panel />
{/if}
