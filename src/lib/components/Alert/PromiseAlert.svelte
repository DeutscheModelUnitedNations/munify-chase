<script lang="ts">
import { AlertDialog } from "bits-ui";
import hotkeys from "hotkeys-js";
import { onMount, type Snippet } from "svelte";
import { fade, fly, scale } from "svelte/transition";
import { browser } from "$app/environment";
import { alertDialogStore } from "./alert";

$effect(() => {
  if (browser && $alertDialogStore) {
    hotkeys("enter", (event, handler) => {
      event.preventDefault();
      switch (handler.key) {
        case "enter":
          if (!$alertDialogStore) return;
          $alertDialogStore.onConfirm!();
          break;
      }
    });
  } else if (browser) {
    hotkeys.unbind("enter");
  }
});

let open = $state(false);

$effect(() => {
  if (browser && $alertDialogStore) {
    open = true;
  } else if (browser) {
    open = false;
  }
});

$effect(() => {
  if (!open) {
    $alertDialogStore = null;
  }
});
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Portal>
		<AlertDialog.Overlay forceMount>
			{#if open}
				<div
					class="backdrop-brightness-70 fixed inset-0 z-30 backdrop-blur-sm"
					transition:fade={{ duration: 300 }}
				></div>
			{/if}
		</AlertDialog.Overlay>
		{#if open}
			<div
				class="card bg-base-100 fixed left-1/2 top-1/2 z-40 m-4 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 shadow-md"
				transition:fly={{ duration: 500 }}
			>
				<AlertDialog.Content>
					<div class="card-body flex w-full flex-col items-center justify-center gap-6">
						<div class="flex w-full flex-col items-center justify-center gap-2">
							<AlertDialog.Title class="text-2xl font-bold">
								{$alertDialogStore?.title}
							</AlertDialog.Title>
							<AlertDialog.Description class="text-base">
								{$alertDialogStore?.description}
							</AlertDialog.Description>
						</div>
						<div class="modal-actions flex w-full gap-2">
							<AlertDialog.Cancel onclick={$alertDialogStore?.onClose} class="btn btn-lg flex-1">
								<i class="fas fa-xmark"></i>
								{$alertDialogStore?.cancelText}
								<span class="kbd kbd-sm"> esc </span>
							</AlertDialog.Cancel>
							<AlertDialog.Action
								onclick={$alertDialogStore?.onConfirm}
								class="btn btn-{$alertDialogStore?.confirmColor ?? 'primary'} btn-lg flex-1"
							>
								<i class="fas fa-check"></i>
								{$alertDialogStore?.confirmText}
								<span class="kbd kbd-sm text-base-content"> ↵ </span>
							</AlertDialog.Action>
						</div>
					</div>
				</AlertDialog.Content>
			</div>
		{/if}
	</AlertDialog.Portal>
</AlertDialog.Root>
