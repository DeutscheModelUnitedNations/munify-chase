<script lang="ts">
	import { page } from '$app/state';
	import CommitteePresentation from '$lib/components/presentation/CommitteePresentation.svelte';

	const committeeId = page.params.committeeId!;
</script>

<!-- Force a remount on committeeId change: CommitteePresentation's live query
     binds to its committeeId prop only once at mount, so client-side
     navigation between two committees' presentation URLs (SvelteKit reuses
     the component instance across a dynamic-param-only navigation) needs a
     fresh instance rather than an in-place prop update. -->
{#key committeeId}
	<CommitteePresentation {committeeId} />
{/key}
