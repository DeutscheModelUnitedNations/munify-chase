<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { PageData } from './$houdini';

	let { data }: { data: PageData } = $props();
</script>

{JSON.stringify(data)}
