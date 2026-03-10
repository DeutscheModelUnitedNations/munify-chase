<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import hotkeys from 'hotkeys-js';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		children: Snippet;
	}

	let { open = $bindable(), children }: Props = $props();

	$effect(() => {
		if (open) {
			hotkeys('esc', () => {
				open = false;
			});
			return () => {
				hotkeys.unbind('esc');
			};
		}
	});
</script>

{#if open}
	<dialog class="modal z-30" open>
		<div class="modal-box bg-base-100 relative w-full max-w-2xl">
			{@render children()}
		</div>
	</dialog>
{/if}
