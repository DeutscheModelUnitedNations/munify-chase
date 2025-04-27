<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { setLocale } from '$lib/paraglide/runtime';
	import type { PageData } from './$houdini';
	import Footer from './Footer.svelte';

	let { data }: { data: PageData } = $props();
</script>

<br />

<a href="/app">Login</a>
