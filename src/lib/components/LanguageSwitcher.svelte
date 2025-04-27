<script>
	import { page } from '$app/state';
	import { locales, localizeHref, getLocale } from '$lib/paraglide/runtime';
</script>

<span class="flex">
	{#each locales as locale, i}
		<a
			class={getLocale() === locale ? 'font-bold' : ''}
			href={localizeHref(page.url.pathname, { locale })}
			aria-current={locale === getLocale() ? 'page' : undefined}
		>
			{locale.toUpperCase()}
		</a>
		{#if locales.length > i + 1}
			|
		{/if}
	{/each}
</span>
