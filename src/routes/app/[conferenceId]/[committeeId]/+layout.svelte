<script lang="ts">
	import { page } from '$app/state';

	let { children } = $props();
</script>

<!--
	Chair and presentation pages read the committee id once and start their live queries
	with it. Moving to another committee keeps the same route, so remount everything below
	when the id changes instead of showing the previous committee.
-->
{#key page.params.committeeId}
	{@render children()}
{/key}
