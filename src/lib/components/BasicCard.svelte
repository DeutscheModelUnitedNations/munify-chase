<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		className?: string;
		title?: string;
		kbd?: string;
	}

	let { children, className = '', title, kbd }: Props = $props();
</script>

<div class="card bg-base-100 w-full {className}">
	<div class="card-title"></div>
	<div class="card-body">
		<div class="mb-4">
			<h2 class="text-2xl font-bold">
				{title}

				{#if kbd}
					<kbd class="kbd kbd-lg ml-2">{kbd}</kbd>
				{/if}
			</h2>
		</div>
		{@render children()}
	</div>
</div>
