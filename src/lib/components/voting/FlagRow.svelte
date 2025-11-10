<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
  children?: Snippet;
  faIcon?: string;
  color?: "info" | "success" | "warning" | "error";
  countValue?: number;
  className?: string;
}

const { children, faIcon, color, countValue = 0, className }: Props = $props();
</script>

<div
	class="card bg-{color
		? `${color}/20`
		: 'base-100'} flex flex-1 flex-row items-center gap-4 overflow-hidden p-4 shadow-sm {className ||
		''}"
>
	<div class="w-26 flex flex-shrink-0 flex-col items-center gap-2 font-mono text-5xl">
		{#if faIcon}
			<i class="fas fa-{faIcon.replace('fa-', '')} text-{color || 'content'}"></i>
		{/if}
		{#if countValue || countValue === 0}
			<span class="font-mono">
				{countValue}
			</span>
		{/if}
	</div>
	{#if children}
		{@render children()}
	{/if}
</div>
