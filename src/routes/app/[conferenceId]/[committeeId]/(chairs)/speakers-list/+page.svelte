<script lang="ts">
	import DevPlaceholder from '$lib/components/DevPlaceholder.svelte';
	import { m } from '$lib/paraglide/messages';
	import type { PageData } from './$houdini';

	let { data }: { data: PageData } = $props();
</script>

<DevPlaceholder {data} />
