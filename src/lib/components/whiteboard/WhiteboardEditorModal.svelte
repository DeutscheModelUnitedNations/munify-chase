<script lang="ts">
  import toast from 'svelte-french-toast';
  import { m } from '$lib/paraglide/messages';
  import { promiseToastStrings } from '$lib/utils/toast';
  import WhiteboardEditor from './WhiteboardEditor.svelte';
  import { client } from '$lib/api/rumbleClient/client';

  interface Props {
    open: boolean;
    committeeId?: string | null;
    whiteboardContent?: string | null;
    close: () => void;
  }

  const { open = $bindable(), committeeId, whiteboardContent, close }: Props = $props();

  let newWhiteboardContent = $state<string | null | undefined>(whiteboardContent);

  const publishChanges = async () => {
    if (!committeeId) {
      return;
    }

    await toast.promise(
      client.mutate.updateCommittee({
        __args: {
          id: committeeId,
          whiteboardContent: newWhiteboardContent ?? ''
        },
        id: true,
        whiteboardContent: true
      }),
      promiseToastStrings(m.whiteboard(), 'update')
    );
    close();
  };
</script>

<dialog class="modal" {open}>
  <div class="modal-box max-h-[95vh] min-h-[75vh] w-full max-w-2xl bg-base-200">
    <h3 class="mb-4 text-lg font-bold">{m.whiteboard()}</h3>
    <div class="card h-full flex-1 bg-base-100 p-4 shadow-sm">
      <WhiteboardEditor bind:whiteboardContent={newWhiteboardContent} />
    </div>
    <div class="sticky bottom-0 modal-action justify-between">
      <button class="btn btn-error" onclick={() => close()}
        ><i class="fas fa-xmark"></i>{m.abort()}</button
      >
      <button class="btn btn-primary" onclick={publishChanges}
        ><i class="fas fa-paper-plane"></i>{m.publishChanges()}</button
      >
    </div>
  </div>
</dialog>
