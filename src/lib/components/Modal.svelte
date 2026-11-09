<script lang="ts">
	import hotkeys from 'hotkeys-js';
	import type { Snippet } from 'svelte';
	import { modalFocus } from '#lib/helpers/modalFocus';

	interface Props {
		open: boolean;
		children: Snippet;
		closeOnEsc?: boolean;
		/** Announced when it opens; without it the first heading inside names it */
		label?: string;
	}

	let { open = $bindable(), children, closeOnEsc = true, label }: Props = $props();

	$effect(() => {
		if (open && closeOnEsc) {
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
	<!-- Not showModal(): toasts and the command palette must stay above it. Focus is kept inside
		 by modalFocus, and aria-modal tells screen readers to ignore the page behind. -->
	<dialog
		class="modal z-30"
		open
		aria-modal="true"
		aria-label={label}
		{@attach modalFocus(closeOnEsc ? () => (open = false) : undefined)}
	>
		<div class="modal-box bg-base-100 relative w-full max-w-2xl">
			{@render children()}
		</div>
	</dialog>
{/if}
