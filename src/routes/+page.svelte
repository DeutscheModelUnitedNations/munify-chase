<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { setLocale } from '$lib/paraglide/runtime';
	import type { PageData } from './$houdini';

	let { data }: { data: PageData } = $props();
</script>

{m.example_message()}

<br />

<a href="/app">Login</a>

<br />

<button onclick={() => setLocale('de')}>de</button>|
<button onclick={() => setLocale('en')}>en</button>
