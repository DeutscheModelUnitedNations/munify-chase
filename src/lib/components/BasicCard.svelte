<script lang="ts">
	import type { Snippet } from 'svelte';
	import Kbd from './Kbd.svelte';

	interface Props {
		children: Snippet;
		className?: string;
		title?: string;
		kbd?: string;
	}

	let { children, className = '', title, kbd }: Props = $props();
</script>

<div class="card bg-base-100 w-full {className}">
	<div class="card-body">
		{#if title}
			<div class="mb-4">
				<h2 class="text-2xl font-bold">
					{title}

					{#if kbd}
						<Kbd hotkey={kbd} class="ml-2" />
					{/if}
				</h2>
			</div>
		{/if}
		{@render children()}
	</div>
</div>
