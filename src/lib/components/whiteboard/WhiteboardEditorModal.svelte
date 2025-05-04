<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import WhiteboardEditor from './WhiteboardEditor.svelte';

	interface Props {
		open: boolean;
		committeeId?: string | null;
		whiteboardContent?: string | null;
		close: () => void;
	}

	let { open = $bindable(), committeeId, whiteboardContent, close }: Props = $props();

	let newWhiteboardContent = $state<string | null | undefined>(whiteboardContent);

	$inspect(newWhiteboardContent);
</script>

<dialog class="modal" {open}>
	<div class="modal-box bg-base-200 max-h-[95vh] min-h-[75vh] w-full max-w-2xl">
		<h3 class="mb-4 text-lg font-bold">{m.whiteboard()}</h3>
		<div class="bg-base-100 card h-full flex-1 p-4 shadow-sm">
			<WhiteboardEditor bind:whiteboardContent={newWhiteboardContent} />
		</div>
		<div class="modal-action sticky bottom-0 justify-between">
			<button class="btn btn-error" onclick={() => close()}
				><i class="fas fa-xmark"></i>{m.abort()}</button
			>
			<button class="btn btn-primary" onclick={() => close()}
				><i class="fas fa-paper-plane"></i>{m.publishChanges()}</button
			>
		</div>
	</div>
</dialog>
