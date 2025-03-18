<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { setLocale } from '$lib/paraglide/runtime';
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{m.example_message()}

<br />

<button onclick={() => setLocale('de')}>de</button>
<button onclick={() => setLocale('en')}>en</button>
