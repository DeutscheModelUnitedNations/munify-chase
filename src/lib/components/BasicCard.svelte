<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    className?: string;
    title?: string;
    kbd?: string;
  }

  const { children, className = '', title, kbd }: Props = $props();
</script>

<div class="card w-full bg-base-100 {className}">
  <div class="card-body">
    {#if title}
      <div class="mb-4">
        <h2 class="text-2xl font-bold">
          {title}

          {#if kbd}
            <div class="ml-2 kbd">{kbd}</div>
          {/if}
        </h2>
      </div>
    {/if}
    {@render children()}
  </div>
</div>
