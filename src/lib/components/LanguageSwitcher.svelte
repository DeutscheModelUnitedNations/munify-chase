<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { locales, localizeHref, getLocale } from '$lib/paraglide/runtime';
	import { fly } from 'svelte/transition';

	const getNextLocale = () => {
		const currentIndex = locales.indexOf(getLocale());
		const nextIndex = (currentIndex + 1) % locales.length;
		return locales[nextIndex];
	};

	let locale = $state(getLocale());

	$effect(() => {
		if (browser) {
			locale = getLocale();
		}
	});

	const localeLookup = {
		en: 'EN',
		de: '🇩🇪'
	};
</script>

<button
	class="btn btn-lg relative min-h-10 flex-1 text-2xl"
	onclick={() => {
		locale = getNextLocale();
		window.location.href = localizeHref(page.url.pathname, { locale: getNextLocale() });
	}}
>
	{#each locales as l}
		{#if locale === l}
			<div class="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
				<div in:fly={{ x: -20 }} out:fly={{ x: 20 }}>{localeLookup[l]}</div>
			</div>
		{/if}
	{/each}
</button>
