<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		className?: string;
	}

	let { children, className = '' }: Props = $props();
</script>

<div class="card bg-base-100 w-full {className}">
	<div class="card-body">
		{@render children()}
	</div>
</div>
