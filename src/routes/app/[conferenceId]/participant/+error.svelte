<script lang="ts">
	import { page } from '$app/state';
	import ErrorPage from '$lib/components/ErrorPage.svelte';
</script>

<ErrorPage
	status={page.status}
	message={page.error?.message}
	backHref="/app/{page.params.conferenceId}"
	backLabel="Back to Conference"
/>
