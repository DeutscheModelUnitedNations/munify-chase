<script lang="ts">
	import { page } from '$app/state';
	import { enableViewTransitionApi } from '$lib/helpers/viewTransitionApi.svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../app.css';

	import '@fontsource/outfit/100.css';
	import '@fontsource/outfit/200.css';
	import '@fontsource/outfit/300.css';
	import '@fontsource/outfit/400.css';
	import '@fontsource/outfit/500.css';
	import '@fontsource/outfit/600.css';
	import '@fontsource/outfit/700.css';
	import '@fontsource/outfit/800.css';
	import '@fontsource/outfit/900.css';
	import '@fontsource/roboto-mono/100.css';
	import '@fontsource/roboto-mono/200.css';
	import '@fontsource/roboto-mono/300.css';
	import '@fontsource/roboto-mono/400.css';
	import '@fontsource/roboto-mono/500.css';
	import '@fontsource/roboto-mono/600.css';
	import '@fontsource/roboto-mono/700.css';
	import '@fontsource/vollkorn/400.css';
	import '@fontsource/vollkorn/500.css';
	import '@fontsource/vollkorn/600.css';
	import '@fontsource/vollkorn/700.css';
	import '@fontsource/vollkorn/800.css';
	import '@fontsource/vollkorn/900.css';
	import { browser } from '$app/environment';

	let { children } = $props();

	enableViewTransitionApi();

	const changeFaDuotoneTheme = () => {
		const r = document.querySelector(':root');
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
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
		const colorSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		colorSchemeMediaQuery.addEventListener('change', changeFaDuotoneTheme);
	}
</script>

{@render children()}

<div aria-hidden="true" style="display:none">
	{#each locales as locale, index (index)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<SvelteToast options={{}} />
