<script lang="ts">
import hotkeys from "hotkeys-js";
import type { Snippet } from "svelte";
import { m } from "$lib/paraglide/messages";

interface Props {
  open: boolean;
  children: Snippet;
}

let { open = $bindable(), children }: Props = $props();

$effect(() => {
  if (open) {
    hotkeys("esc", () => {
      open = false;
    });
  } else {
    hotkeys.unbind("esc");
  }
});
</script>

<dialog class="modal z-30" {open}>
	<div class="modal-box bg-base-100 relative w-full max-w-2xl">
		{@render children()}
	</div>
</dialog>
