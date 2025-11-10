<script lang="ts">
import { fly } from "svelte/transition";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { page } from "$app/state";
import { getLocale, locales, localizeHref } from "$lib/paraglide/runtime";

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
  en: "gb",
  de: "de",
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
			<div class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
				<div in:fly={{ x: -20 }} out:fly={{ x: 20 }} class="fi fi-{localeLookup[l]}"></div>
			</div>
		{/if}
	{/each}
</button>
