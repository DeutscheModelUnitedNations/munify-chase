<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from './Navbar.svelte';
	import { isTauri } from '$lib/platform';
	let { children } = $props();
</script>

{#if !isTauri()}
	<Navbar />
{/if}

{@render children()}

{#if !isTauri()}
	<Footer />
{/if}
