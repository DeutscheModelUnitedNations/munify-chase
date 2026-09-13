<script lang="ts">
	import { m } from '$lib/paraglide/messages';
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
		// Off by default: this component is also used on chair-facing/admin
		// screens (mission-control, a chair's own presentation tab), which
		// may be muted, backgrounded, or just not an appropriate place for
		// unprompted audio. Kiosk displays are the unattended, sound-appropriate
		// case (see chase-kiosk.json's AutoplayAllowlist, needed for the
		// browser to actually let this play with no user gesture).
		playSound?: boolean;
	}

	let {
		lastAdoptionDate,
		confettiDurationSec = 45,
		showBanner = false,
		committeeName = '',
		agendaItem = '',
		playSound = false
	}: Props = $props();

	let now = $state(Date.now());

	onMount(() => {
		const interval = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => clearInterval(interval);
	});

	// --- Gong sound (kiosk only) ---------------------------------------------
	// Synthesized via Web Audio rather than shipping an audio file: no
	// licensing to track, nothing extra for the offline-first cache to manage,
	// and it keeps this self-contained.
	let audioCtx: AudioContext | null = null;

	function getAudioContext(): AudioContext | null {
		if (typeof window === 'undefined') return null;
		if (!audioCtx) {
			try {
				const Ctor =
					window.AudioContext ||
					(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
				audioCtx = Ctor ? new Ctor() : null;
			} catch {
				audioCtx = null;
			}
		}
		return audioCtx;
	}

	function playGong(): void {
		const ctx = getAudioContext();
		if (!ctx) return;
		if (ctx.state === 'suspended') ctx.resume().catch(() => {});

		const start = ctx.currentTime;
		const master = ctx.createGain();
		master.gain.value = 0.6;
		master.connect(ctx.destination);

		// Inharmonic partials (not clean integer multiples) are what makes
		// this read as a struck metal gong rather than a pitched bell/organ
		// note; each rings out on its own slightly-different decay so the
		// tail thins out unevenly, like a real strike.
		const fundamental = 110;
		const partials = [1, 1.48, 2.0, 2.66, 3.31, 4.1];
		for (const [i, ratio] of partials.entries()) {
			const osc = ctx.createOscillator();
			osc.type = 'sine';
			osc.frequency.value = fundamental * ratio;

			const gain = ctx.createGain();
			const peak = 0.5 / (i + 1);
			const decay = 3.5 + i * 0.4;
			gain.gain.setValueAtTime(0, start);
			gain.gain.linearRampToValueAtTime(peak, start + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.0001, start + decay);

			osc.connect(gain);
			gain.connect(master);
			osc.start(start);
			osc.stop(start + decay + 0.1);
		}

		// Brief filtered noise burst layered under the tone partials, for
		// the percussive "strike" transient at the very start.
		const noiseDuration = 0.15;
		const bufferSize = Math.floor(ctx.sampleRate * noiseDuration);
		const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
		}
		const noise = ctx.createBufferSource();
		noise.buffer = buffer;
		const noiseFilter = ctx.createBiquadFilter();
		noiseFilter.type = 'bandpass';
		noiseFilter.frequency.value = 800;
		const noiseGain = ctx.createGain();
		noiseGain.gain.value = 0.4;
		noise.connect(noiseFilter);
		noiseFilter.connect(noiseGain);
		noiseGain.connect(master);
		noise.start(start);
	}

	// Whether to show/count down the confetti at all is decided once per
	// distinct adoption, the moment we first observe it, using the kiosk's
	// own clock (`observedAt`) rather than the server's timestamp for the
	// ongoing countdown. A kiosk Pi has no RTC and can have a briefly-wrong
	// system clock while NTP races the WiFi/captive-portal flow at boot; the
	// previous code re-derived "how long has this been showing" from
	// `now - lastAdoptionDate.getTime()` on every tick, so a client clock
	// that's behind the server's made that diff negative for as long as the
	// drift lasted — satisfying "< confettiDurationSec" forever, i.e. the
	// confetti/banner never timed out. Only the one-time freshness check
	// below ("is this actually a new adoption, not old news from before I
	// loaded/reconnected") still needs to compare against the server clock;
	// once that decision is made, the countdown is a pure client-side
	// stopwatch and can't get stuck on clock skew.
	let observedKey = $state<number | null>(null);
	let observedAt = $state<number | null>(null);
	$effect(() => {
		const key = lastAdoptionDate ? lastAdoptionDate.getTime() : null;
		if (key === observedKey) return;
		observedKey = key;
		observedAt = key != null && (Date.now() - key) / 1000 < confettiDurationSec ? Date.now() : null;
	});

	let lastPlayedKey = $state<number | null>(null);
	$effect(() => {
		if (!playSound || observedAt == null || observedKey === lastPlayedKey) return;
		lastPlayedKey = observedKey;
		playGong();
	});

	const timeSinceLastAdoption = $derived(
		observedAt != null ? Math.floor((now - observedAt) / 1000) : null
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
