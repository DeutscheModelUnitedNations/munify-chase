<script lang="ts">
	import { page } from '$app/state';

	let { data }: { data: any } = $props();
</script>

<div class="p-4">
	<p class="text-lg">{page.route.id}</p>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</div>
