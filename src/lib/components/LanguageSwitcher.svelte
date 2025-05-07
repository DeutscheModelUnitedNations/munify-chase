<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref, getLocale } from '$lib/paraglide/runtime';

	const getNextLocale = () => {
		const currentIndex = locales.indexOf(getLocale());
		const nextIndex = (currentIndex + 1) % locales.length;
		return locales[nextIndex];
	};
</script>

<a class="btn flex-1" href={localizeHref(page.url.pathname, { locale: getNextLocale() })}>
	{#if getLocale() === 'de'}
		🇩🇪
	{:else if getLocale() === 'en'}
		🇬🇧
	{/if}
</a>
