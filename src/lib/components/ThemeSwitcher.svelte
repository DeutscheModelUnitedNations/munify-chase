<script lang="ts">
	import { getTheme, toggleTheme } from '#lib/utils/theme.svelte';
	import { fly } from 'svelte/transition';
	import { m } from '#lib/paraglide/messages';

	const themeName = (theme: ReturnType<typeof getTheme>) =>
		({ system: m.a11yThemeSystem(), light: m.a11yThemeLight(), dark: m.a11yThemeDark() })[theme];
</script>

<!-- Says what is set now; a press moves on to the next of system, light and dark -->
<button
	class="btn btn-lg relative flex-1"
	aria-label="{m.theme()}: {themeName(getTheme())}"
	onclick={() => toggleTheme()}
>
	{#if getTheme() === 'dark'}
		<div
			class="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center"
			in:fly={{ x: -20 }}
			out:fly={{ x: 20 }}
		>
			<i class="fa-duotone fa-moon w-6 text-center"></i>
		</div>
	{:else if getTheme() === 'light'}
		<div
			class="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center"
			in:fly={{ x: -20 }}
			out:fly={{ x: 20 }}
		>
			<i class="fa-duotone fa-sun w-6 text-center"></i>
		</div>
	{:else if getTheme() === 'system'}
		<div
			class="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center"
			in:fly={{ x: -20 }}
			out:fly={{ x: 20 }}
		>
			<i class="fa-duotone fa-desktop w-6 text-center"></i>
		</div>
	{:else}
		<div
			class="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center"
			in:fly={{ x: -20 }}
			out:fly={{ x: 20 }}
		>
			<i class="fa-duotone fa-question w-6 text-center"></i>
		</div>
	{/if}
</button>
