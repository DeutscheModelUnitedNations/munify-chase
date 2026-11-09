<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { m } from '#lib/paraglide/messages';
	import WhiteboardViewer from '#lib/components/whiteboard/WhiteboardViewer.svelte';

	interface Props {
		data: ComponentProps<typeof WhiteboardViewer>['data'];
	}

	let { data }: Props = $props();
</script>

<div class="card bg-base-100 shadow-sm" data-tour="committee.whiteboard">
	<div class="card-body p-4">
		<h2 class="card-title text-lg">{m.whiteboard()}</h2>
		<WhiteboardViewer {data} />
	</div>
</div>
