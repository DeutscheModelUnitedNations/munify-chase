<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
  children: Snippet;
  className?: string;
  title?: string;
  kbd?: string;
}

const { children, className = "", title, kbd }: Props = $props();
</script>

<div class="card bg-base-100 w-full {className}">
	<div class="card-body">
		{#if title}
			<div class="mb-4">
				<h2 class="text-2xl font-bold">
					{title}

					{#if kbd}
						<div class="kbd ml-2">{kbd}</div>
					{/if}
				</h2>
			</div>
		{/if}
		{@render children()}
	</div>
</div>
