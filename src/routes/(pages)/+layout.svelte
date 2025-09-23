<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from './Navbar.svelte';
	let { children } = $props();
</script>

<Navbar />

{@render children()}

<Footer />
