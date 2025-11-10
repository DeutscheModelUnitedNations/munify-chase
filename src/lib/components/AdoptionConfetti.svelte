<script lang="ts">
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { onMount } from "svelte";
import { cubicInOut } from "svelte/easing";
import { fade, fly } from "svelte/transition";
import { Confetti } from "svelte-confetti";
import Marquee from "svelte-fast-marquee";
import { m } from "$lib/paraglide/messages";

interface Props {
  agendaItem: string;
  committeeName: string;
  lastAdoptionDate?: Date | null;
  confettiDurationSec?: number;
  showBanner?: boolean;
}

const {
  lastAdoptionDate,
  agendaItem,
  committeeName,
  confettiDurationSec = 30,
  showBanner = false,
}: Props = $props();

let timeSinceLastAdoption = $state(
  lastAdoptionDate && dayjs().diff(dayjs(lastAdoptionDate), "seconds"),
);

onMount(() => {
  const interval = setInterval(() => {
    if (lastAdoptionDate) {
      timeSinceLastAdoption = dayjs().diff(lastAdoptionDate, "seconds");
    }
  }, 1000);
  return () => {
    clearInterval(interval);
  };
});

const confettiExplosionCount = $derived(Math.floor(confettiDurationSec) * 1.6);
function randomPercentage() {
  return Math.random() * 100;
}
function randomDelay() {
  return Math.random() * confettiDurationSec * 1000;
}
</script>

{#if timeSinceLastAdoption && timeSinceLastAdoption < confettiDurationSec}
	<div
		class="pointer-events-none fixed -top-[50px] bottom-0 left-0 right-0 z-50 flex justify-center overflow-hidden"
		out:fade={{ duration: 3000 }}
	>
		<Confetti
			x={[-5, 5]}
			y={[0, 0.1]}
			delay={[500, 2000]}
			infinite
			duration={5000}
			amount={200}
			fallDistance="100vh"
		/>
	</div>
	<div class="pointer-events-none fixed inset-0 z-50" out:fade={{ duration: 3000 }}>
		{#each Array(confettiExplosionCount) as _, i}
			{@const delay = randomDelay()}
			<div style="position: absolute; top: {randomPercentage()}%; left: {randomPercentage()}%;">
				<Confetti delay={[delay, delay]} duration={1000} x={[-0.5, 0.5]} y={[-0.5, 0.5]} />
			</div>
		{/each}
	</div>

	{#if showBanner}
		<div
			class="h-md bg-primary text-primary-content fixed bottom-0 left-0 right-0 z-50"
			transition:fly={{ y: 100, easing: cubicInOut, duration: 1000 }}
		>
			<Marquee class="h-full w-full overflow-hidden whitespace-nowrap py-6" speed={50} gap="4rem">
				<h1 class="text-4xl font-bold">
					{m.adoptionAnnouncement({
						committeeName,
						agendaItem
					})}
				</h1>
				<h1 class="text-4xl font-bold">+++</h1>
			</Marquee>
		</div>
	{/if}
{/if}
