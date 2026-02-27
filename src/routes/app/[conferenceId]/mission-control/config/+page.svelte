<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import BasicCard from '$lib/components/BasicCard.svelte';
</script>

<div class="flex h-full w-full items-center justify-center">
  <div class="flex h-full w-full max-w-screen-xl flex-col gap-6 p-6">
    <BasicCard title={m.configuration()}>
      <p class="text-base-content/60">TODO: Migrate conference configuration page to Rumble</p>
    </BasicCard>
  </div>
</div>
