<script lang="ts">
import toast from "svelte-french-toast";
import { invalidateAll } from "$app/navigation";
import { cache, graphql } from "$houdini";
import { m } from "$lib/paraglide/messages";
import { promiseToastStrings } from "$lib/utils/toast";
import WhiteboardEditor from "./WhiteboardEditor.svelte";

interface Props {
  open: boolean;
  committeeId?: string | null;
  whiteboardContent?: string | null;
  close: () => void;
}

const {
  open = $bindable(),
  committeeId,
  whiteboardContent,
  close,
}: Props = $props();

const newWhiteboardContent = $state<string | null | undefined>(
  whiteboardContent,
);

const UpdateWhiteboardMutation = graphql(`
		mutation UpdateWhiteboard($committeeId: ID!, $whiteboardContent: String!) {
			updateCommittee(id: $committeeId, whiteboardContent: $whiteboardContent) {
				id
				whiteboardContent
			}
		}
	`);

const publishChanges = async () => {
  if (!committeeId) {
    return;
  }

  await toast.promise(
    UpdateWhiteboardMutation.mutate({
      committeeId,
      whiteboardContent: newWhiteboardContent ?? "",
    }),
    promiseToastStrings(m.whiteboard(), "update"),
  );
  // cache.markStale('Committee');
  // invalidateAll();
  close();
};
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
			<button class="btn btn-primary" onclick={publishChanges}
				><i class="fas fa-paper-plane"></i>{m.publishChanges()}</button
			>
		</div>
	</div>
</dialog>
