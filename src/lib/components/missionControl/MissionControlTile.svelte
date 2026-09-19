<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Uppercase card heading — omit for tiles that don't need one (e.g. attendance). */
		title?: string;
		/** Centers content vertically/horizontally, for single-stat tiles. */
		center?: boolean;
		children: Snippet;
	}

	let { title, center = false, children }: Props = $props();
</script>

<!--
	Shared shell for mission-control stat tiles, so every tile's title (when it
	has one) uses the exact same font/size — previously each tile hand-rolled
	its own heading and they drifted out of sync.
-->
<div class="card bg-base-100 shadow-sm">
	<div
		class="card-body flex min-h-0 flex-1 flex-col gap-3 overflow-hidden {center
			? 'items-center justify-center text-center'
			: ''}"
	>
		{#if title}
			<h3
				class="text-base-content/60 border-base-content/10 shrink-0 border-b pb-2 text-xl font-semibold tracking-wide uppercase"
			>
				{title}
			</h3>
		{/if}
		{@render children()}
	</div>
</div>
