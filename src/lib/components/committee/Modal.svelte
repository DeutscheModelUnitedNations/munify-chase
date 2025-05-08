<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		children: Snippet;
	}

	let { open = $bindable(), children }: Props = $props();
</script>

<dialog class="modal z-30" {open}>
	<div class="modal-box bg-base-100 w-full max-w-2xl">
		{@render children()}
	</div>
</dialog>
