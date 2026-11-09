<script lang="ts">
	import { m } from '#lib/paraglide/messages';

	let { onclose }: { onclose: () => void } = $props();
</script>

<!-- Closes on a click beside the box; out of the tab order, keyboard users have Escape or the
	 dialog's own close button -->
<form method="dialog" class="modal-backdrop">
	<button tabindex="-1" onclick={onclose}>{m.close()}</button>
</form>
