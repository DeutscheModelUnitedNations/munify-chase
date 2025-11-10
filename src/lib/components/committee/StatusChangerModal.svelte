<script lang="ts">
import hotkeys from "hotkeys-js";
import type { CommitteeStatusEnum$options } from "$houdini";
import { m } from "$lib/paraglide/messages";
import Modal from "../Modal.svelte";
import StatusChanger from "./StatusChanger.svelte";

interface Props {
  committeeId: string;
  oldStatus?: CommitteeStatusEnum$options;
  oldUntil?: Date;
  oldCustomName?: string;
}

const { committeeId, oldStatus, oldUntil, oldCustomName }: Props = $props();

let open = $state(false);

$effect(() => {
  hotkeys("alt+s, esc", (event, handler) => {
    event.preventDefault();
    switch (handler.key) {
      case "alt+s":
        open = !open;
        break;
      case "esc":
        open = false;
        break;
    }
  });
});
</script>

<Modal bind:open>
	<StatusChanger
		{committeeId}
		{oldStatus}
		{oldUntil}
		{oldCustomName}
		abort={() => (open = false)}
	/>
</Modal>
