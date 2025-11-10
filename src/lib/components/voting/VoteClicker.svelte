<script lang="ts">
import hotkeys from "hotkeys-js";
import { onDestroy, onMount } from "svelte";

interface Props {
  active: boolean;
  value: number;
}

let { active, value = $bindable() }: Props = $props();

const scope = Math.random().toString(36).slice(2); // unique scope for each instance

function bindHotkeys() {
  hotkeys("up,down,space", { scope }, (event, handler) => {
    event.preventDefault();
    switch (handler.key) {
      case "up":
      case "space":
        value += 1;
        break;
      case "down":
        value -= 1;
        break;
    }
  });
}

function unbindHotkeys() {
  hotkeys.unbind("up,down", scope);
}

$effect(() => {
  if (active) {
    hotkeys.setScope(scope);
    bindHotkeys();
  } else {
    unbindHotkeys();
  }
});

onDestroy(() => {
  unbindHotkeys();
});
</script>

<div class="flex flex-col items-center gap-2">
	<button
		class="btn btn-lg"
		aria-label="increase-vote"
		onclick={() => (value += 1)}
		disabled={!active}
	>
		<i class="fas fa-arrow-up"></i>
	</button>
	<!-- <div class="countdown font-mono text-5xl">
		<span style="--value:{value};" aria-live="polite" aria-label={value.toString()}>{value}</span>
	</div> -->
	<div class="font-mono text-5xl">
		<span aria-live="polite" aria-label={value.toString()}>{value}</span>
	</div>
	<button
		class="btn btn-lg"
		aria-label="decrease-vote"
		onclick={() => (value -= 1)}
		disabled={!active}
	>
		<i class="fas fa-arrow-down"></i>
	</button>
</div>
