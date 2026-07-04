<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import PaperPage from '$lib/components/resolutions/PaperPage.svelte';

	const conferenceId = $derived(page.params.conferenceId!);
	const committeeId = $derived(page.params.committeeId!);
	const paperId = $derived(page.params.paperId!);

	const backHref = $derived(
		resolve('/app/[conferenceId]/participant/[committeeId]/papers', { conferenceId, committeeId })
	);
</script>

<PaperPage {paperId} {backHref} />
