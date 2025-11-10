<script lang="ts">
import { blur } from "svelte/transition";

export type HourglassStatus = "active" | "paused" | "overtime";

interface Props {
  status: HourglassStatus;
}

const { status }: Props = $props();

let activeIcon = $state("fa-hourglass-start");

$effect(() => {
  if (status !== "active") {
    return;
  }
  const animation = setInterval(() => {
    setTimeout(() => {
      activeIcon = "fa-hourglass-half";
    }, 500);
    setTimeout(() => {
      activeIcon = "fa-hourglass-end";
    }, 1000);
    setTimeout(() => {
      activeIcon += " hourglass-animation";
    }, 1500);
    setTimeout(() => {
      activeIcon = "fa-hourglass-start";
    }, 2000);
  }, 2000);
  return () => clearInterval(animation);
});
</script>

<div class="relative h-10 w-10 text-2xl">
	{#if status === 'active'}
		<div class="absolute inset-0 flex items-center justify-center">
			<i class="fa-duotone {activeIcon}" in:blur={{ duration: 500 }} out:blur={{ duration: 500 }}
			></i>
		</div>
	{:else if status === 'paused'}
		<div class="absolute inset-0 flex items-center justify-center">
			<i class="fa-duotone fa-circle-pause" in:blur={{ duration: 500 }} out:blur={{ duration: 500 }}
			></i>
		</div>
	{:else if status === 'overtime'}
		<div class="absolute inset-0 flex items-center justify-center">
			<i
				class="fas fa-bell fa-shake text-error"
				in:blur={{ duration: 500 }}
				out:blur={{ duration: 500 }}
			></i>
		</div>
	{/if}
</div>

<style lang="postcss">
	@keyframes hourglass-animation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(180deg);
		}
	}

	.hourglass-animation {
		animation: hourglass-animation 0.5s ease-in-out;
	}
</style>
