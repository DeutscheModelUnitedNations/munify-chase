<script lang="ts">
	import { page } from '$app/state';
	import { enableViewTransitionApi } from '$lib/helpers/viewTransitionApi.svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import '../app.css';

	let { children } = $props();

	enableViewTransitionApi();
</script>

{@render children()}

<div aria-hidden="true" style="display:none">
	{#each locales as locale, index (index)}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<SvelteToast options={{}} />
