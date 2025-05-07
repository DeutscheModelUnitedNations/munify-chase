<script lang="ts">
	import { getTheme, toggleTheme } from '$lib/utils/theme.svelte';
</script>

<button class="btn flex-1" onclick={() => toggleTheme()}>
	{#if getTheme() === 'dark'}
		<i class="fa-duotone fa-moon w-6 text-center"></i>
	{:else if getTheme() === 'light'}
		<i class="fa-duotone fa-sun w-6 text-center"></i>
	{:else if getTheme() === 'system'}
		<i class="fa-duotone fa-desktop w-6 text-center"></i>
	{:else}
		<i class="fa-duotone fa-question w-6 text-center"></i>
	{/if}
</button>
