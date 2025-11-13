<script lang="ts">
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Toaster } from "svelte-french-toast";
import { page } from "$app/state";
import { enableViewTransitionApi } from "$lib/helpers/viewTransitionApi.svelte";
import { locales, localizeHref } from "$lib/paraglide/runtime";
import "../app.css";
import "/node_modules/flag-icons/css/flag-icons.min.css";

import "@fontsource/outfit/100.css";
import "@fontsource/outfit/200.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/outfit/900.css";
import "@fontsource/roboto-mono/100.css";
import "@fontsource/roboto-mono/200.css";
import "@fontsource/roboto-mono/300.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/600.css";
import "@fontsource/roboto-mono/700.css";
import "@fontsource/vollkorn/400.css";
import "@fontsource/vollkorn/500.css";
import "@fontsource/vollkorn/600.css";
import "@fontsource/vollkorn/700.css";
import "@fontsource/vollkorn/800.css";
import "@fontsource/vollkorn/900.css";
import { onMount } from "svelte";
import { browser } from "$app/environment";
import Alert from "$lib/components/Alert/PromiseAlert.svelte";
import { initialSetTheme } from "$lib/utils/theme.svelte";

dayjs.extend(duration);

const { children } = $props();

enableViewTransitionApi();

const changeFaDuotoneTheme = () => {
  const r = document.querySelector(":root");
  const html = document.querySelector("html");
  if (html?.getAttribute("data-theme") === "dark") {
    (r as any)?.style.setProperty("--fa-primary-color", "#b1cbed");
    (r as any)?.style.setProperty("--fa-primary-opacity", "1");
    (r as any)?.style.setProperty("--fa-secondary-color", "#3d7dd2");
    (r as any)?.style.setProperty("--fa-secondary-opacity", "1");
  } else {
    (r as any)?.style.setProperty("--fa-primary-color", "#000000");
    (r as any)?.style.setProperty("--fa-primary-opacity", "1");
    (r as any)?.style.setProperty("--fa-secondary-color", "#3d7dd2");
    (r as any)?.style.setProperty("--fa-secondary-opacity", "1");
  }

  //--fa-primary-opacity: 1;
  // --fa-secondary-color: #3d7dd2;
  // --fa-secondary-opacity: 1;
};

if (browser) {
  changeFaDuotoneTheme();
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        changeFaDuotoneTheme();
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}

onMount(() => {
  initialSetTheme();
  const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
  matchMedia.addEventListener("change", (e) => {
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
