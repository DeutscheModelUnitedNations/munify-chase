<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from './Navbar.svelte';
	let { children } = $props();
</script>

<!-- The public pages sit on white (DMUN: white + navy), unlike the app's tinted ground -->
<div class="bg-base-100 min-h-screen">
	<Navbar />

	{@render children()}

	<Footer />
</div>
