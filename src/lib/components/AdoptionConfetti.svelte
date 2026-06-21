<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { Confetti } from 'svelte-confetti';
	import Marquee from 'svelte-fast-marquee';
	import { cubicInOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	interface Props {
		lastAdoptionDate?: Date | null;
		confettiDurationSec?: number;
		showBanner?: boolean;
		committeeName?: string;
		agendaItem?: string;
	}

	let {
		lastAdoptionDate,
		confettiDurationSec = 45,
		showBanner = false,
		committeeName = '',
		agendaItem = ''
	}: Props = $props();

	let now = $state(Date.now());

	onMount(() => {
		const interval = setInterval(() => { now = Date.now(); }, 1000);
		return () => clearInterval(interval);
	});

	const timeSinceLastAdoption = $derived(
		lastAdoptionDate ? Math.floor((now - lastAdoptionDate.getTime()) / 1000) : null
	);

	const confettiExplosionCount = $derived(Math.floor(confettiDurationSec * 1.6));
	function randomPercentage() {
		return Math.random() * 100;
	}
	function randomDelay() {
		return Math.random() * confettiDurationSec * 1000;
	}
</script>

{#if timeSinceLastAdoption != null && timeSinceLastAdoption < confettiDurationSec}
	<div
		class="pointer-events-none fixed -top-[50px] right-0 bottom-0 left-0 z-50 flex justify-center overflow-hidden"
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
		{#each Array(confettiExplosionCount) as _, idx (idx)}
			{@const delay = randomDelay()}
			<div style="position: absolute; top: {randomPercentage()}%; left: {randomPercentage()}%;">
				<Confetti delay={[delay, delay]} duration={1000} x={[-0.5, 0.5]} y={[-0.5, 0.5]} />
			</div>
		{/each}
	</div>

	{#if showBanner && committeeName && agendaItem}
		<div
			class="bg-primary text-primary-content fixed right-0 bottom-0 left-0 z-50 h-20"
			transition:fly={{ y: 100, easing: cubicInOut, duration: 1000 }}
		>
			<Marquee class="h-full w-full overflow-hidden py-6 whitespace-nowrap" speed={50} gap="4rem">
				<h1 class="text-4xl font-bold">
					{m.adoptionAnnouncement({ committeeName, agendaItem })}
				</h1>
				<h1 class="text-4xl font-bold">+++</h1>
			</Marquee>
		</div>
	{/if}
{/if}
