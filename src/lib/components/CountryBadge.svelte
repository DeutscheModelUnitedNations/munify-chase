<script lang="ts">
  import Flag from './Flag.svelte';

  interface Props {
    alpha2Code: string;
    alpha3Code?: string;
    name?: string;
    onRemove?: () => void;
  }

  let { alpha2Code, alpha3Code, name, onRemove }: Props = $props();
</script>

<div
  class="group card relative flex w-12 flex-wrap items-center justify-center bg-base-300 p-1"
  title={name}
>
  <Flag representation={{ alpha2Code, alpha3Code }} size="xs" />
  <div class="mt-1 font-mono text-xs uppercase">
    {alpha2Code}
  </div>
  {#if onRemove}
    <button
      type="button"
      class="btn absolute top-1/2 right-1/2 z-40 btn-circle translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 btn-xs btn-error group-hover:opacity-100"
      aria-label="Remove"
      onclick={onRemove}
    >
      <i class="fa-solid fa-trash text-xs"></i>
    </button>
  {/if}
</div>
