<script lang="ts">
import { page } from "$app/state";

const { data }: { data: any } = $props();
</script>

<div class="max-w-lg overflow-x-scroll p-4">
	<p class="text-lg">{page.route.id}</p>
	<pre>{JSON.stringify(data, null, 2)}</pre>
</div>
